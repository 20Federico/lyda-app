import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksHome } from './tasks-home';

describe('TasksHome', () => {
  let component: TasksHome;
  let fixture: ComponentFixture<TasksHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksHome],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
