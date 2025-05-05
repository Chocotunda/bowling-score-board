import { Routes } from '@angular/router';
import { gameGuard } from './core/guards/game.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/welcome-page/welcome-page.component').then(m => m.WelcomeComponent),
  },
  {
    path: 'game',
    canActivate: [gameGuard],
    loadComponent: () =>
      import('./pages/game-page/game-page.component').then(m => m.GamePageComponent),
  },
];
