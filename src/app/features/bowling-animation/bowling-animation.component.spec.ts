import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlingAnimationComponent } from './bowling-animation.component';

describe('BowlingAnimationComponent', () => {
  let component: BowlingAnimationComponent;
  let fixture: ComponentFixture<BowlingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BowlingAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BowlingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
