import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GamePageComponent),
  },
];
