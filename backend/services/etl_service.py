from typing import List
import os
import cv2
import json
import tempfile
import subprocess
import fitz
import shutil
from PIL import Image
import google.generativeai as genai
import pytesseract
from ultralytics import YOLO
from fastapi import HTTPException
from typing import TypedDict, List, Dict, Any, Optional, Annotated
from pydantic import BaseModel, Field


class ETLPipeline:

    VISUAL_LABELS = ['Picture', 'Table', 'Formula']

    def __init__(self, model_path: str, page_image_dir: str, parsed_sections_dir: str):
        self.model = YOLO(model_path)
        self.page_image_dir = page_image_dir
        self.parsed_sections_dir = parsed_sections_dir
        # self.llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
        self.gemini = genai.GenerativeModel("gemini-2.0-flash")
        os.makedirs(self.page_image_dir, exist_ok=True)
        os.makedirs(self.parsed_sections_dir, exist_ok=True)
        os.environ["GOOGLE_API_KEY"] = ""
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

    def _render_pdf_to_all_images(self, pdf_path: str, base_filename: str, dpi: int) -> List[str]:
        image_paths = []
        try:
            with fitz.open(pdf_path) as doc:
                for page_num in range(len(doc)):
                    print(f"📄 Rendering page {page_num + 1}")
                    page = doc.load_page(page_num)
                    zoom_factor = dpi / 72.0
                    matrix = fitz.Matrix(zoom_factor, zoom_factor)
                    pixmap = page.get_pixmap(matrix=matrix)
                    output_image_path = os.path.join(self.page_image_dir, f"{base_filename}_page_{page_num + 1}.jpg")
                    pixmap.save(output_image_path)
                    print("🖼️ Image saved to:", output_image_path)
                    image_paths.append(output_image_path)
            return image_paths
        except Exception as e:
            print("❌ PDF IMAGE RENDER FAILED")
            print("❌ Error type:", type(e))
            print("❌ Error message:", e)
            raise

    def convert_document_to_images(self, input_path: str, original_filename: str, dpi: int = 300) -> List[str]:
        print("🧩 Converting document to images")
        print("📄 Input path:", input_path)
        print("📄 Original filename:", original_filename)
        file_extension = os.path.splitext(input_path)[1].lower()
        base_filename = os.path.splitext(original_filename)[0]
        image_paths = []
        if file_extension == '.pdf':
            image_paths = self._render_pdf_to_all_images(input_path, base_filename, dpi)
        elif file_extension in ['.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls']:
            try:
                with tempfile.TemporaryDirectory() as temp_dir:
                    subprocess.run([
                        "libreoffice", "--headless", "--convert-to", "pdf:writer_pdf_Export",
                        "--outdir", temp_dir, input_path,
                    ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                    intermediate_pdf = os.path.join(temp_dir, os.path.splitext(os.path.basename(input_path))[0] + ".pdf")
                    if not os.path.exists(intermediate_pdf):
                        raise FileNotFoundError("LibreOffice failed to create the intermediate PDF.")
                    image_paths = self._render_pdf_to_all_images(intermediate_pdf, base_filename, dpi)
            except FileNotFoundError:
                raise HTTPException(status_code=500, detail="LibreOffice not found. Please ensure it's installed.")
            except subprocess.CalledProcessError as e:
                raise HTTPException(status_code=500, detail=f"LibreOffice conversion failed: {e.stderr.decode()}")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
        print("🖼️ Total images generated:", len(image_paths))
        for p in image_paths:
            print("   -", p)
        return image_paths

    def parse_image_layout(self, source_image_path: str, output_dir: str) -> List[dict]:
        print("\n🔍 Parsing image:", source_image_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        page_content = []
        try:
            source_img = cv2.imread(source_image_path)
            if source_img is None:
                print("❌ Failed to load image:", source_image_path)
                return []
            else:
                print("✅ Image loaded:", source_img.shape)
            print("\n🤖 YOLO DEBUG")
            print("📂 Image path:", source_image_path)
            print("📐 Image shape:", source_img.shape)
            print("🧠 Model loaded:", self.model is not None)
            print("🚀 About to run YOLO inference...")
            results = self.model(source_img)
            result = results[0]
            print("✅ YOLO inference finished")
            print("📦 Boxes detected:", len(result.boxes))
            print("🏷️ Class labels:", result.names)
            class_names = result.names
            class_counts = {}
            detections = []
            # For drawing bounding boxes
            boxed_img = source_img.copy()
            for box in result.boxes:
                detections.append({'box': box, 'y1': int(box.xyxy[0][1])})
            sorted_detections = sorted(detections, key=lambda d: d['y1'])
            for item in sorted_detections:
                box = item['box']
                class_id = int(box.cls[0])
                label = class_names[class_id]
                coords = box.xyxy[0].cpu().numpy().astype(int)
                x1, y1, x2, y2 = coords
                # Draw bounding box on boxed_img
                color = (255, 0, 255)  # Green for all boxes, can be customized
                cv2.rectangle(boxed_img, (x1, y1), (x2, y2), color, 3)
                cv2.putText(boxed_img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                cropped_image = source_img[y1:y2, x1:x2]
                content_data = ""
                if label in self.VISUAL_LABELS:
                    count = class_counts.get(label, 0)
                    filename = f"{label}_{count}.png"
                    save_path = os.path.join(output_dir, filename)
                    class_counts[label] = count + 1
                    cv2.imwrite(save_path, cropped_image)
                    content_data = save_path
                else:
                    pil_image = Image.fromarray(cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB))
                    text = pytesseract.image_to_string(pil_image, lang='eng')
                    content_data = text.strip()
                page_content.append({
                    "tag": label,
                    "content": content_data
                })
            # Save the image with bounding boxes
            boxed_img_path = os.path.join(output_dir, "boxed_layout.png")
            cv2.imwrite(boxed_img_path, boxed_img)
        except Exception as e:
            print("❌ PARSE IMAGE ERROR:", e)
            raise
        return page_content


def normalize_for_speech(tag: str, content: str) -> str:
        tag = tag.lower()

        if tag == "list-item":
            return f"Bullet point. {content}"
        elif tag == "section-header":
            return f"Section heading. {content}"
        elif tag == "title":
            return f"Title. {content}"
        elif tag == "text":
            return content
        elif tag == "table":
            return "Table detected."
        elif tag == "picture":
            return "Image detected."
        else:
            return content
