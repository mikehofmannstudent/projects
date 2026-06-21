from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- TODO endpoints ---

@app.post("/todos")
def create_todo(title: str, db: Session = Depends(get_db)):
    todo = models.Todo(title=title)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.get("/todos")
def get_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).all()


@app.put("/todos/{todo_id}")
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).get(todo_id)
    todo.done = not todo.done
    db.commit()
    return todo


# --- HABITS endpoints ---

@app.post("/habits")
def create_habit(name: str, db: Session = Depends(get_db)):
    habit = models.Habit(name=name)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@app.get("/habits")
def get_habits(db: Session = Depends(get_db)):
    return db.query(models.Habit).all()