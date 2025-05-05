import { Component } from '@angular/core';
import { GameComponent } from '@/app/features/game/game.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [GameComponent],
})
export class HomeComponent {}
