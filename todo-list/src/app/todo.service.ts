import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  important: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  private filterCompleted: boolean = false;
  private filterImportant: boolean = false;

  constructor() {
    this.fetchTask();
  }

  async fetchTask(): Promise<void> {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const data = await response.json();
      const todos = data.todos.map((todo: any) => ({
        ...todo,
        important: false,
      }));
      this.todosSubject.next(todos);
    } catch (error) {
      console.error('Error fetching Task:', error);
    }
  }

  // Add new Task
  async addTaskToApi(
    todo: string,
    completed: boolean,
    important: boolean,
    userId: number
  ): Promise<void> {
    try {
      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: todo,
          completed: completed,
          userId: userId,
        }),
      });

      const newTodo = await response.json();

      const currentTodos = this.todosSubject.getValue();
      this.todosSubject.next([
        { ...newTodo, important: important },
        ...currentTodos,
      ]);
    } catch (error) {
      console.error('Error adding task to Api:', error);
    }
  }

  // Update Complete Status
  async updateTaskStatus(
    todoId: number,
    completed: boolean,
    important: boolean,
    userId: number
  ): Promise<void> {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      const updatedTodo = await response.json();

      const todos = this.todosSubject
        .getValue()
        .map((todo) =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: updatedTodo.completed }
            : todo
        );

      this.todosSubject.next(todos);
    } catch (error) {
      console.error('Error updating task to Api:', error);
    }
  }

  addTask(todo: string, userId: number, important: boolean): void {
    const newTodo: Todo = {
      id: Date.now(),
      todo,
      completed: false,
      important,
    };
    const currentTodos = this.todosSubject.getValue();
    this.todosSubject.next([newTodo, ...currentTodos]);
  }

  setFilterCompleted(filterCompleted: boolean): void {
    this.filterCompleted = filterCompleted;
    this.updateView();
  }

  setFilterImportant(filterImportant: boolean): void {
    this.filterImportant = filterImportant;
    this.updateView();
  }

  //Refresh View List
  private updateView(): void {
    const todos = this.todosSubject.getValue();
    let filtered = todos;
    if (this.filterCompleted) {
      filtered = todos.filter((todo) => todo.completed);
    }
    if (this.filterImportant) {
      filtered = filtered.sort(
        (a, b) => Number(b.important) - Number(a.important)
      );
    }
    this.todosSubject.next(filtered);
  }
}
