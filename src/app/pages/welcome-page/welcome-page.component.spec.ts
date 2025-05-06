import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome-page.component';
import { GameComponent } from '@/app/features/game/game.component';
import { NgxsModule } from '@ngxs/store';
import { GameState } from '@/app/core/state/game.state';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WelcomeComponent,
        GameComponent,
        NgxsModule.forRoot([GameState], {
          developmentMode: true,
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
