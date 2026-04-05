import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSettingsComponent } from './chat-settings.component';

describe('ChatSettingsComponent', () => {
  let component: ChatSettingsComponent;
  let fixture: ComponentFixture<ChatSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
