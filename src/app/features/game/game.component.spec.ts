import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { GameState } from '@/app/core/state/game.state';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GameComponent,
        ButtonModule,
        InputNumberModule,
        CommonModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([GameState], {
          developmentMode: true,
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Add tests for the game component

  // it('should initialize with correct default values', () => {
  //   expect(component.gameState().game.status).toBe(GameStatus.InProgress);
  //   expect(component.gameState().game.currentFrameIndex).toBe(0);
  //   expect(component.gameState().game.totalScore).toBe(0);
  //   expect(component.gameState().game.frames.length).toBe(10);
  //   expect(component.pinsControl.enabled).toBeTrue();
  // });

  // it('should handle manual roll input correctly', () => {
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   expect(component.gameState().lastRoll).toBe(5);
  //   expect(component.gameState().game.frames[0].rolls[0].pins).toBe(5);
  //   expect(component.pinsControl.value).toBeNull();
  // });

  // it('should not add manual roll when game is complete', () => {
  //   // Complete the game
  //   for (let i = 0; i < 12; i++) {
  //     component.pinsControl.setValue(10);
  //     component.addManualRoll();
  //   }

  //   // Force change detection to ensure effect runs
  //   fixture.detectChanges();

  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   expect(component.gameState().lastRoll).toBe(10);
  //   expect(component.pinsControl.disabled).toBeTrue();
  // });

  // it('should handle random rolls correctly', () => {
  //   component.addRandomRoll();

  //   expect(component.gameState().lastRoll).toBeDefined();
  //   expect(component.gameState().lastRoll).toBeGreaterThanOrEqual(0);
  //   expect(component.gameState().lastRoll).toBeLessThanOrEqual(10);
  // });

  // it('should calculate strike correctly', () => {
  //   // First roll strike
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();

  //   // Next two rolls
  //   component.pinsControl.setValue(3);
  //   component.addManualRoll();
  //   component.pinsControl.setValue(4);
  //   component.addManualRoll();

  //   expect(component.gameState().game.frames[0].type).toBe(FrameType.Strike);
  //   expect(component.gameState().game.frames[0].total).toBe(17); // 10 + 3 + 4
  // });

  // it('should calculate spare correctly', () => {
  //   // First frame - First roll
  //   component.pinsControl.setValue(7);
  //   component.addManualRoll();

  //   // First frame - Second roll - spare
  //   component.pinsControl.setValue(3);
  //   component.addManualRoll();

  //   // Second frame - First roll
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   // Second frame - Second roll
  //   component.pinsControl.setValue(2);
  //   component.addManualRoll();

  //   expect(component.gameState().game.frames[0].type).toBe(FrameType.Spare);
  //   expect(component.gameState().game.frames[0].total).toBe(15); // 7 + 3 + 5
  // });

  // it('should handle tenth frame correctly', () => {
  //   // Complete first 9 frames
  //   for (let i = 0; i < 9; i++) {
  //     component.pinsControl.setValue(10);
  //     component.addManualRoll();
  //   }

  //   // Tenth frame
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();

  //   expect(component.gameState().game.status).toBe(GameStatus.Completed);
  //   expect(component.gameState().game.totalScore).toBe(300);
  // });

  // it('should reset game correctly', () => {
  //   // Add some rolls
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();
  //   component.pinsControl.setValue(3);
  //   component.addManualRoll();

  //   // Reset game
  //   component.resetGame();

  //   expect(component.gameState().game.status).toBe(GameStatus.InProgress);
  //   expect(component.gameState().game.currentFrameIndex).toBe(0);
  //   expect(component.gameState().game.totalScore).toBe(0);
  //   expect(component.gameState().game.frames[0].rolls.length).toBe(0);
  //   expect(component.pinsControl.enabled).toBeTrue();
  // });

  // it('should update max pins correctly based on frame state', () => {
  //   // First roll
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   // Max pins should be reduced
  //   expect(component.getMaxPins()).toBe(5);

  //   // Second roll
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   // Move to next frame
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();

  //   // Max pins should be reset for new frame
  //   expect(component.getMaxPins()).toBe(10);
  // });

  // it('should handle consecutive strikes correctly', () => {
  //   // First frame - First strike
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();

  //   // Second frame - Second strike
  //   component.pinsControl.setValue(10);
  //   component.addManualRoll();

  //   // Third frame - Third roll
  //   component.pinsControl.setValue(5);
  //   component.addManualRoll();

  //   // Third frame - Fourth roll
  //   component.pinsControl.setValue(3);
  //   component.addManualRoll();

  //   expect(component.gameState().game.frames[0].total).toBe(25);
  //   expect(component.gameState().game.frames[1].total).toBe(43);
  // });
});
