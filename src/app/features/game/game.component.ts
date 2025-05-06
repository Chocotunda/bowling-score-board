import {
  Component,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FrameType } from '@/app/core/enums/frame-type.enum';
import { GameStatus } from '@/app/core/enums/game-status.enum';
import {
  GameState as BowlingGameState,
  Game,
  Frame,
  Roll,
} from '@/app/core/interfaces/bowling.interface';
import { Store } from '@ngxs/store';
import {
  GameState as GameStoreState,
  UpdatePlayerGameState,
  UpdatePlayerRoll,
  StartGame,
  GameStateModel,
  ResetGame,
} from '@/app/core/state/game.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputNumberModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly MAX_PINS = 10;
  private readonly MAX_FRAMES = 10;
  private destroy$ = new Subject<void>();
  private playerIndex: number = -1;

  @Input() player!: { name: string; gameState: BowlingGameState };

  gameStoreState$: Observable<GameStateModel>;
  playerName$: Observable<string>;

  readonly FrameType = FrameType;
  readonly GameStatus = GameStatus;

  pinsControl = new FormControl<number | null>(null, {
    nonNullable: false,
  });

  readonly gameState = signal<BowlingGameState>({
    game: {
      frames: Array(this.MAX_FRAMES)
        .fill(null)
        .map((_, index) => ({
          rolls: [],
          score: 0,
          total: 0,
          type: FrameType.Open,
          isComplete: false,
          isTenthFrame: index === this.MAX_FRAMES - 1,
        })),
      currentFrameIndex: 0,
      currentRollIndex: 0,
      totalScore: 0,
      status: GameStatus.InProgress,
      isPerfectGame: false,
    },
    lastRoll: 0,
    lastFrameType: null,
  });

  readonly gameStatus = computed(() => {
    const state = this.gameState();
    return {
      currentFrame: state.game.frames[state.game.currentFrameIndex],
      isGameComplete: state.game.status === GameStatus.Completed,
      totalScore: state.game.totalScore,
      lastRoll: state.lastRoll,
      lastFrameType: state.lastFrameType,
      frames: state.game.frames,
    };
  });

  get currentFrame() {
    return this.gameStatus().currentFrame;
  }
  get isGameComplete() {
    return this.gameStatus().isGameComplete;
  }
  get totalScore() {
    return this.gameStatus().totalScore;
  }
  get lastRoll() {
    return this.gameStatus().lastRoll;
  }
  get lastFrameType() {
    return this.gameStatus().lastFrameType;
  }
  get frames() {
    return this.gameStatus().frames;
  }

  constructor(private store: Store) {
    this.gameStoreState$ = this.store
      .select(GameStoreState.getState)
      .pipe(takeUntil(this.destroy$));

    this.playerName$ = this.gameStoreState$.pipe(
      takeUntil(this.destroy$),
      map(() => this.player?.name || ''),
    );

    effect(() => {
      if (this.isGameComplete) {
        this.pinsControl.disable();
      } else {
        this.pinsControl.enable();
      }
    });
  }

  ngOnInit() {
    if (!this.player) {
      return;
    }

    if (this.player?.gameState) {
      this.gameState.set(this.player.gameState);
    }

    this.gameStoreState$
      .pipe(
        takeUntil(this.destroy$),
        map(state => {
          const index = state.players.findIndex(p => p.name === this.player?.name);
          return index;
        }),
      )
      .subscribe(index => {
        this.playerIndex = index;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetGame());
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMaxPins(): number {
    return this.getMaxPinsForFrame(this.currentFrame);
  }

  addManualRoll(): void {
    if (
      this.isGameComplete ||
      this.pinsControl.value === null ||
      this.pinsControl.value === undefined
    ) {
      return;
    }

    const pins = Math.min(Math.max(0, this.pinsControl.value), this.getMaxPins());
    this.addRoll(pins);
    this.pinsControl.reset();
  }

  addRandomRoll(): void {
    if (this.isGameComplete) {
      return;
    }

    const currentFrame = this.currentFrame;
    let pins: number;

    if (currentFrame.rolls.length === 0 || currentFrame.type === FrameType.Strike) {
      pins = Math.floor(Math.random() * (this.MAX_PINS + 1));
    } else {
      const remainingPins = this.MAX_PINS - currentFrame.rolls[0].pins;
      pins = Math.floor(Math.random() * (remainingPins + 1));
    }

    this.addRoll(pins);
  }

  resetGame(): void {
    const newGameState = {
      game: this.initializeGame(),
      lastRoll: 0,
      lastFrameType: null,
    };
    this.gameState.set(newGameState);
    this.store.dispatch(new StartGame());
  }

  private initializeGame(): Game {
    const frames: Frame[] = Array(this.MAX_FRAMES)
      .fill(null)
      .map((_, index) => ({
        rolls: [],
        score: 0,
        total: 0,
        type: FrameType.Open,
        isComplete: false,
        isTenthFrame: index === this.MAX_FRAMES - 1,
      }));

    return {
      frames,
      currentFrameIndex: 0,
      currentRollIndex: 0,
      totalScore: 0,
      status: GameStatus.InProgress,
      isPerfectGame: false,
    };
  }

  private isStrike(rolls: Roll[]): boolean {
    return rolls.length > 0 && rolls[0].pins === this.MAX_PINS;
  }

  private isSpare(rolls: Roll[]): boolean {
    return (
      rolls.length >= 2 &&
      rolls[0].pins + rolls[1].pins === this.MAX_PINS &&
      rolls[0].pins !== this.MAX_PINS
    );
  }

  private getFrameType(rolls: Roll[]): FrameType {
    if (this.isStrike(rolls)) return FrameType.Strike;
    if (this.isSpare(rolls)) return FrameType.Spare;
    return FrameType.Open;
  }

  private calculateFrameScore(frame: Frame, nextFrames: Frame[]): number {
    const baseScore = this.calculateBaseScore(frame);

    if (frame.type === FrameType.Strike) {
      return this.calculateStrikeScore(frame, nextFrames);
    } else if (frame.type === FrameType.Spare) {
      return this.calculateSpareScore(frame, nextFrames);
    }
    return baseScore;
  }

  private calculateBaseScore(frame: Frame): number {
    return frame.rolls.reduce((sum, roll) => sum + roll.pins, 0);
  }

  private calculateStrikeScore(frame: Frame, nextFrames: Frame[]): number {
    if (frame.isTenthFrame) {
      return this.calculateBaseScore(frame);
    }
    return this.MAX_PINS + this.getNextTwoRollsScore(nextFrames);
  }

  private calculateSpareScore(frame: Frame, nextFrames: Frame[]): number {
    if (frame.isTenthFrame) {
      return this.calculateBaseScore(frame);
    }
    return this.MAX_PINS + this.getNextRollScore(nextFrames);
  }

  private getNextTwoRollsScore(nextFrames: Frame[]): number {
    if (!this.hasNextFrames(nextFrames)) return 0;

    const nextFrame = nextFrames[0];
    let score = this.getFirstBonusRoll(nextFrame);

    if (this.isStrike(nextFrame.rolls)) {
      score += this.getSecondBonusRollForStrike(nextFrame, nextFrames);
    } else {
      score += this.getSecondBonusRollForNonStrike(nextFrame);
    }

    return score;
  }

  private getNextRollScore(nextFrames: Frame[]): number {
    if (!this.hasNextFrames(nextFrames)) return 0;
    return this.getFirstBonusRoll(nextFrames[0]);
  }

  private getFirstBonusRoll(frame: Frame): number {
    return frame.rolls[0]?.pins || 0;
  }

  private getSecondBonusRollForStrike(frame: Frame, frames: Frame[]): number {
    if (!frame.isTenthFrame && frames.length > 1) {
      return this.getFirstBonusRoll(frames[1]);
    } else if (frame.isTenthFrame && frame.rolls.length > 1) {
      return frame.rolls[1].pins;
    }
    return 0;
  }

  private getSecondBonusRollForNonStrike(frame: Frame): number {
    return frame.rolls[1]?.pins || 0;
  }

  private isFrameComplete(frame: Frame): boolean {
    if (frame.isTenthFrame) {
      if (frame.type === FrameType.Strike) {
        return frame.rolls.length === 3;
      } else if (frame.type === FrameType.Spare) {
        return frame.rolls.length === 3;
      }
      return frame.rolls.length === 2;
    }
    return frame.type === FrameType.Strike || frame.rolls.length === 2;
  }

  private canCalculateFrameScore(frame: Frame, nextFrames: Frame[]): boolean {
    if (!frame.isComplete) return false;

    if (frame.type === FrameType.Strike) {
      return this.canCalculateStrikeScore(frame, nextFrames);
    }

    if (frame.type === FrameType.Spare) {
      return this.canCalculateSpareScore(frame, nextFrames);
    }

    return true;
  }

  private canCalculateStrikeScore(frame: Frame, nextFrames: Frame[]): boolean {
    if (frame.isTenthFrame) {
      return this.isTenthFrameComplete(frame);
    }

    const nextFrame = nextFrames[0];
    if (!nextFrame?.rolls.length) return false;

    if (this.isStrike(nextFrame.rolls)) {
      return this.hasRequiredRollsForConsecutiveStrikes(nextFrame, nextFrames);
    }

    return nextFrame.rolls.length >= 2;
  }

  private canCalculateSpareScore(frame: Frame, nextFrames: Frame[]): boolean {
    if (frame.isTenthFrame) {
      return this.isTenthFrameComplete(frame);
    }
    return nextFrames[0]?.rolls.length >= 1;
  }

  private hasNextFrames(frames: Frame[]): boolean {
    return frames.length > 0;
  }

  private isTenthFrameComplete(frame: Frame): boolean {
    const requiredRolls = this.isStrike(frame.rolls) || this.isSpare(frame.rolls) ? 3 : 2;
    return frame.rolls.length === requiredRolls;
  }

  private hasRequiredRollsForConsecutiveStrikes(frame: Frame, frames: Frame[]): boolean {
    if (frame.isTenthFrame) {
      return frame.rolls.length >= 2;
    }
    return frames[1]?.rolls.length >= 1;
  }

  private getMaxPinsForFrame(frame: Frame): number {
    if (!frame.rolls.length) return this.MAX_PINS;

    if (!frame.isTenthFrame) {
      return this.MAX_PINS - frame.rolls[0].pins;
    }

    return this.getMaxPinsForTenthFrame(frame);
  }

  private getMaxPinsForTenthFrame(frame: Frame): number {
    if (this.isStrike(frame.rolls)) {
      if (frame.rolls.length === 1) return this.MAX_PINS;
      if (frame.rolls.length === 2) {
        return frame.rolls[1].pins === this.MAX_PINS
          ? this.MAX_PINS
          : this.MAX_PINS - frame.rolls[1].pins;
      }
    }

    if (this.isSpare(frame.rolls)) {
      return this.MAX_PINS;
    }

    return this.MAX_PINS - frame.rolls[0].pins;
  }

  private addRoll(pins: number): void {
    if (this.playerIndex === -1) {
      return;
    }

    const currentFrame = this.currentFrame;

    if (!this.isValidRoll(currentFrame, pins)) {
      return;
    }

    const roll: Roll = { pins };
    const updatedFrame: Frame = {
      ...currentFrame,
      rolls: [...currentFrame.rolls, roll],
    };

    updatedFrame.type = this.getFrameType(updatedFrame.rolls);
    updatedFrame.isComplete = this.isFrameComplete(updatedFrame);

    this.store.dispatch(
      new UpdatePlayerRoll(this.playerIndex, this.gameState().game.currentFrameIndex, roll),
    );

    this.updateGameState(updatedFrame, pins);
  }

  private isValidRoll(frame: Frame, pins: number): boolean {
    if (frame.rolls.length === 0) return true;

    if (!frame.isTenthFrame) {
      return frame.rolls[0].pins + pins <= this.MAX_PINS;
    }

    if (frame.type === FrameType.Strike) {
      if (frame.rolls.length === 1) return true;
      if (frame.rolls.length === 2) {
        return frame.rolls[1].pins !== this.MAX_PINS || pins <= this.MAX_PINS;
      }
    } else if (frame.type === FrameType.Spare) {
      return frame.rolls.length < 3;
    }

    return frame.rolls.length < 2;
  }

  private updateGameState(updatedFrame: Frame, pins: number): void {
    if (this.playerIndex === -1) {
      return;
    }

    const currentState = this.gameState();
    const frames = [...currentState.game.frames];
    frames[currentState.game.currentFrameIndex] = updatedFrame;

    if (updatedFrame.isComplete) {
      const updatedFrames: Frame[] = [];
      frames.forEach((frame, i) => {
        if (i <= currentState.game.currentFrameIndex) {
          const canCalculate = this.canCalculateFrameScore(frame, frames.slice(i + 1));
          const score = canCalculate ? this.calculateFrameScore(frame, frames.slice(i + 1)) : 0;
          const previousTotal = i > 0 ? updatedFrames[i - 1]?.total || 0 : 0;
          updatedFrames.push({
            ...frame,
            score,
            total: canCalculate ? previousTotal + score : 0,
          });
        } else {
          updatedFrames.push(frame);
        }
      });

      const totalScore = updatedFrames[currentState.game.currentFrameIndex].total || 0;

      const newGameState = {
        game: {
          ...currentState.game,
          frames: updatedFrames,
          totalScore,
          currentFrameIndex:
            currentState.game.currentFrameIndex < this.MAX_FRAMES - 1
              ? currentState.game.currentFrameIndex + 1
              : currentState.game.currentFrameIndex,
          currentRollIndex: 0,
          status:
            currentState.game.currentFrameIndex === this.MAX_FRAMES - 1
              ? GameStatus.Completed
              : currentState.game.status,
        },
        lastRoll: pins,
        lastFrameType: updatedFrame.type,
      };

      this.gameState.set(newGameState);
      this.store.dispatch(new UpdatePlayerGameState(this.playerIndex, newGameState));
    } else {
      const newGameState = {
        game: {
          ...currentState.game,
          frames,
          currentRollIndex: currentState.game.currentRollIndex + 1,
        },
        lastRoll: pins,
        lastFrameType: updatedFrame.type,
      };

      this.gameState.set(newGameState);
      this.store.dispatch(new UpdatePlayerGameState(this.playerIndex, newGameState));
    }
  }
}
