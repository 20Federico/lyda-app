import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsHome } from './settings-home';

describe('SettingsHome', () => {
  let component: SettingsHome;
  let fixture: ComponentFixture<SettingsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsHome],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
