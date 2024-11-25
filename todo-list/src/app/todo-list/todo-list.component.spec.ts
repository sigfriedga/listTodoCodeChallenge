import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../todo.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', [
      'fetchTask',
      'addTaskToApi',
      'updateTaskStatus',
      'setFilterImportant',
    ]);

    mockTodoService.todos$ = new BehaviorSubject([
      { id: 1, todo: 'Task 1', completed: false, important: false },
      { id: 2, todo: 'Task 2', completed: true, important: true },
    ]).asObservable();

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain tasks', () => {
    const todoListElement = fixture.nativeElement.querySelector('#todoList');
    expect(todoListElement.children.length).toBeGreaterThan(0);
  });

  it('should add new task', async () => {
    mockTodoService.addTaskToApi.and.returnValue(Promise.resolve());
    await component.addTask('New Task');
    expect(mockTodoService.addTaskToApi).toHaveBeenCalledWith(
      'New Task',
      false,
      false,
      component.userId
    );
  });

  it('should filter and sort tasks by importance', () => {
    component.filterImportant = false;

    component.importantFilter();
    expect(component.filterImportant).toBeTrue();
    expect(mockTodoService.setFilterImportant).toHaveBeenCalledWith(true);

    component.importantFilter();
    expect(component.filterImportant).toBeFalse();
    expect(mockTodoService.setFilterImportant).toHaveBeenCalledWith(false);
  });
});
