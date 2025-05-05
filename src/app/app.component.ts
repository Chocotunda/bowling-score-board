import { Component } from '@angular/core';
import { LayoutComponent } from './features/layout/layout.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Bowling Scoreboard';
}
