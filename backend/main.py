from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.learning_disability import router as LearningRouter

app = FastAPI(
    title="ImagineCup backend",
    description="Backend API for Learning Disability, Visual & Hearing Pipelines",
    version="1.0.0"
)

# Enable CORS so your Next.js frontend can call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # in production make this more strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register router
app.include_router(
    LearningRouter,
    prefix="/learning-disability",
    tags=["Learning Disability"]
)

@app.get("/")
def root():
    return {"message": "Backend running successfully 🚀"}
