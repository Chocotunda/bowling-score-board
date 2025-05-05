import { Component } from '@angular/core';
import { GameComponent } from '@/app/features/game/game.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  template: `
    <div class="game-page">
      <h1>Bowling Game</h1>
      <div class="game-container">
        <app-game [playerNumber]="1"></app-game>
        <app-game [playerNumber]="2"></app-game>
      </div>
    </div>
  `,
  styles: [
    `
      .game-page {
        padding: 2rem;
      }

      h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--primary-color);
      }

      .game-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
    `,
  ],
  imports: [GameComponent],
})
export class GamePageComponent {}
