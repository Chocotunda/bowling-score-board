import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BowlingAnimationComponent } from './features/bowling-animation/bowling-animation.component';
import { LayoutComponent } from './features/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, BowlingAnimationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Bowling Scoreboard';
}
