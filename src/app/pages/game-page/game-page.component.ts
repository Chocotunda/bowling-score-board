import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from '@/app/features/game/game.component';
import { Store } from '@ngxs/store';
import { GameState as GameStoreState, GameStateModel } from '@/app/core/state/game.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { GameState as BowlingGameState } from '@/app/core/interfaces/bowling.interface';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  gameState$: Observable<GameStateModel>;
  players$: Observable<{ name: string; gameState: BowlingGameState }[]>;

  constructor(private store: Store) {
    this.gameState$ = this.store.select(GameStoreState.getState).pipe(
      takeUntil(this.destroy$),
      map(state => {
        return state;
      }),
    );

    this.players$ = this.gameState$.pipe(
      map(state => {
        const players = state.players.map(player => ({
          name: player.name,
          gameState: player.gameState,
        }));
        return players;
      }),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
