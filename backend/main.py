from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers.learning_disability import router as LearningRouter
from routers.visual_disability import router as VisualRouter

app = FastAPI(
    title="ImagineCup backend",
    description="Backend API for Learning Disability, Visual & Hearing Pipelines",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔊 Serve audio / images
app.mount("/out", StaticFiles(directory="out"), name="out")

app.include_router(
    LearningRouter,
    prefix="/learning-disability",
    tags=["Learning Disability"]
)

app.include_router(
    VisualRouter,
    prefix="/visual-disability",
    tags=["Visual Disability"]
)

@app.get("/")
def root():
    return {"message": "Backend running successfully 🚀"}
