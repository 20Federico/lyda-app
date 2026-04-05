import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersHome } from './notes-home.component';

describe('RemindersHome', () => {
  let component: RemindersHome;
  let fixture: ComponentFixture<RemindersHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemindersHome],
    }).compileComponents();

    fixture = TestBed.createComponent(RemindersHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
