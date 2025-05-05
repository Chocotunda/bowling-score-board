import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  GameState as BowlingGameState,
  Frame,
  Roll,
} from '@/app/core/interfaces/bowling.interface';
import { FrameType } from '@/app/core/enums/frame-type.enum';
import { GameStatus } from '@/app/core/enums/game-status.enum';

export interface Player {
  name: string;
  gameState: BowlingGameState;
}

export interface GameStateModel {
  players: Player[];
  currentPlayerIndex: number;
  gameStarted: boolean;
}

export class AddPlayer {
  static readonly type = '[Game] Add Player';
  constructor(public name: string) {}
}

export class AddPlayers {
  static readonly type = '[Game] Add Players';
  constructor(public names: string[]) {}
}

export class RemovePlayer {
  static readonly type = '[Game] Remove Player';
  constructor(public index: number) {}
}

export class StartGame {
  static readonly type = '[Game] Start Game';
}

export class UpdatePlayerGameState {
  static readonly type = '[Game] Update Player Game State';
  constructor(
    public playerIndex: number,
    public gameState: BowlingGameState,
  ) {}
}

export class UpdatePlayerFrame {
  static readonly type = '[Game] Update Player Frame';
  constructor(
    public playerIndex: number,
    public frameIndex: number,
    public frame: Frame,
  ) {}
}

export class UpdatePlayerRoll {
  static readonly type = '[Game] Update Player Roll';
  constructor(
    public playerIndex: number,
    public frameIndex: number,
    public roll: Roll,
  ) {}
}

export class ResetGame {
  static readonly type = '[Game] Reset Game';
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
  },
})
@Injectable()
export class GameState {
  @Selector()
  static getState(state: GameStateModel): GameStateModel {
    return state;
  }

  @Selector()
  static getCurrentPlayer(state: GameStateModel): Player | null {
    return state.players[state.currentPlayerIndex] || null;
  }

  @Selector()
  static getCurrentPlayerGameState(state: GameStateModel): BowlingGameState | null {
    return state.players[state.currentPlayerIndex]?.gameState || null;
  }

  private initializeGameState(): BowlingGameState {
    const frames: Frame[] = Array(10)
      .fill(null)
      .map((_, index) => ({
        rolls: [],
        score: 0,
        total: 0,
        type: FrameType.Open,
        isComplete: false,
        isTenthFrame: index === 9,
      }));

    return {
      game: {
        frames,
        currentFrameIndex: 0,
        currentRollIndex: 0,
        totalScore: 0,
        status: GameStatus.InProgress,
        isPerfectGame: false,
      },
      lastRoll: 0,
      lastFrameType: null,
    };
  }

  @Action(AddPlayer)
  addPlayer(ctx: StateContext<GameStateModel>, action: AddPlayer) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      players: [
        ...state.players,
        {
          name: action.name,
          gameState: this.initializeGameState(),
        },
      ],
    });
  }

  @Action(AddPlayers)
  addPlayers(ctx: StateContext<GameStateModel>, action: AddPlayers) {
    const state = ctx.getState();
    const newPlayers = action.names.map(name => ({
      name,
      gameState: this.initializeGameState(),
    }));

    ctx.setState({
      ...state,
      players: [...state.players, ...newPlayers],
    });
  }

  @Action(RemovePlayer)
  removePlayer(ctx: StateContext<GameStateModel>, action: RemovePlayer) {
    const state = ctx.getState();
    const players = [...state.players];
    players.splice(action.index, 1);

    ctx.setState({
      ...state,
      players,
    });
  }

  @Action(StartGame)
  startGame(ctx: StateContext<GameStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      gameStarted: true,
      currentPlayerIndex: 0,
    });
  }

  @Action(UpdatePlayerGameState)
  updatePlayerGameState(ctx: StateContext<GameStateModel>, action: UpdatePlayerGameState) {
    const state = ctx.getState();
    const players = [...state.players];
    players[action.playerIndex] = {
      ...players[action.playerIndex],
      gameState: action.gameState,
    };

    ctx.setState({
      ...state,
      players,
    });
  }

  @Action(UpdatePlayerFrame)
  updatePlayerFrame(ctx: StateContext<GameStateModel>, action: UpdatePlayerFrame) {
    const state = ctx.getState();
    const players = [...state.players];
    const player = { ...players[action.playerIndex] };
    const gameState = { ...player.gameState };
    const game = { ...gameState.game };
    const frames = [...game.frames];

    frames[action.frameIndex] = action.frame;
    game.frames = frames;
    gameState.game = game;
    player.gameState = gameState;
    players[action.playerIndex] = player;

    ctx.setState({
      ...state,
      players,
    });
  }

  @Action(UpdatePlayerRoll)
  updatePlayerRoll(ctx: StateContext<GameStateModel>, action: UpdatePlayerRoll) {
    const state = ctx.getState();

    if (action.playerIndex < 0 || action.playerIndex >= state.players.length) {
      console.error('Invalid player index:', action.playerIndex);
      return;
    }

    const players = [...state.players];
    const player = { ...players[action.playerIndex] };
    const gameState = { ...player.gameState };
    const game = { ...gameState.game };
    const frames = [...game.frames];
    const frame = { ...frames[action.frameIndex] };
    const rolls = [...frame.rolls, action.roll];

    frame.rolls = rolls;
    frames[action.frameIndex] = frame;
    game.frames = frames;
    gameState.game = game;
    player.gameState = gameState;
    players[action.playerIndex] = player;

    ctx.setState({
      ...state,
      players,
    });
  }

  @Action(ResetGame)
  resetGame(ctx: StateContext<GameStateModel>) {
    ctx.setState({
      players: [],
      currentPlayerIndex: 0,
      gameStarted: false,
    });
  }
}
