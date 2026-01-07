# Future Features for AACL Platform

## 1. **AI Tutor Assistant (Chatbot)**
   - **Constraint**: Purely offline or private.
   - **Feature**: A simple chatbot that can answer specific questions about the current slide or concept.
   - **Implementation**: Could use a small, quantized LLM (like TinyLlama) running locally via WebLLM (browser-based) to ensure data privacy and offline access.

## 2. **Gamification & Streaks**
   - **Feature**: Daily login streaks, "Physics Wizard" badges, and XP leaderboards (fake or local-only).
   - **Why**: Keeps engagement high for students with attention difficulties.

## 3. **Sign Language Avatar (ISL/ASL)**
   - **Feature**: A 3D avatar that translates the simplified text into Sign Language.
   - **Why**: Critical for students who are D/deaf or hard of hearing.
   - **Tech**: Use ready-made glossary GIFs triggered by keywords (e.g., "Motion" -> GIF of Motion sign).

## 4. **Mind Map Generator**
   - **Feature**: Automatically visualize the relationships between concepts (e.g., how Velocity relates to Speed and Direction).
   - **Tech**: `react-flow` to generate a node graph after the lesson.

## 5. **Parental/Teacher Dashboard**
   - **Feature**: A separate login for parents to see:
     - "Time spent reading"
     - "Concepts struggled with" (where they hit Remedial mode)
   - **Why**: Shows distinct value for educators/parents.

## 6. **Voice Commands**
   - **Feature**: Navigate the app hands-free. "Next Slide", "Read this to me".
   - **Tech**: Web Speech API (`SpeechRecognition`).

## 7. **Downloadable Summary PDF**
   - **Feature**: At the end of the lesson, click "Print Notes".
   - **Tech**: `jspdf` to generate a clean, dyslexia-friendly PDF of what they learned.
