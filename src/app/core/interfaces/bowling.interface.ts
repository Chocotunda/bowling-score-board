import { FrameType } from '@/app/core/enums/frame-type.enum';
import { GameStatus } from '@/app/core/enums/game-status.enum';

export interface Roll {
  pins: number;
  isBonus?: boolean;
}

export interface Frame {
  rolls: Roll[];
  score: number;
  total: number;
  type: FrameType;
  isComplete: boolean;
  isTenthFrame: boolean;
}

export interface Game {
  frames: Frame[];
  currentFrameIndex: number;
  currentRollIndex: number;
  totalScore: number;
  status: GameStatus;
  isPerfectGame: boolean;
}

export interface GameState {
  game: Game;
  lastRoll: number;
  lastFrameType: FrameType | null;
}
