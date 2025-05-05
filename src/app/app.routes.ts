import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GamePageComponent),
  },
];
