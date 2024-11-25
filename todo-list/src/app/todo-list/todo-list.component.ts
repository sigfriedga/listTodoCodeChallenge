import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  important: boolean;
}

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit, AfterViewInit {
  todos$: Observable<Todo[]>;
  filteredTodos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  count: number = 0;
  filterCompleted: string = 'all';
  sortBy: string = 'important';
  filterImportant: boolean = false;
  userId: number = 104;

  constructor(private todoService: TodoService) {
    this.todos$ = this.todoService.todos$;
  }

  ngOnInit(): void {
    //Request to receive data
    this.todoService.fetchTask();
    this.updateCount();

    //Recover last task status
    this.todos$.subscribe((todos) => {
      this.filteredTodos$.next(todos);
    });
  }

  //Add Task to Api
  addTask(todoText: string): void {
    if (todoText.trim()) {
      this.todoService
        .addTaskToApi(todoText, false, false, this.userId)
        .then(() => {
          console.log(`Added task: ${todoText}`);
          this.updateCount();
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    }
  }

  // Update Important Value
  updateImportant(todo: Todo): void {
    todo.important = !todo.important;

    this.todoService
      .updateTaskStatus(todo.id, todo.completed, todo.important, this.userId)
      .then(() => {
        console.log(`Updated status for the task: ${todo.todo}`);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  }

  //Update Complete value
  updateComplete(todo: Todo): void {
    this.todoService
      .updateTaskStatus(todo.id, todo.completed, todo.important, this.userId)
      .then(() => {
        console.log(`Updated status for the task: ${todo.todo}`);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  }

  //Filter by Important
  importantFilter(): void {
    this.filterImportant = !this.filterImportant;
    this.todoService.setFilterImportant(this.filterImportant);
  }

  selectFilter(event: Event): void {
    const filterValue = (event.target as HTMLSelectElement).value;
    this.filterCompleted = filterValue;

    // Filter completed task or show all tasks
    if (filterValue === 'completed') {
      this.todos$.subscribe((todos) => {
        this.filteredTodos$.next(
          todos.filter((todo) => todo.completed === true)
        );
      });
    } else {
      // Show All Task
      this.todos$.subscribe((todos) => {
        this.filteredTodos$.next(todos);
      });
    }
  }

  //Update the number of tasks
  updateCount(): void {
    this.todos$.subscribe((todos) => (this.count = todos.length));
  }

  ngAfterViewInit(): void {
    console.log('this.todoService.fetchTodos();');
  }
}
