import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { GameState } from '../state/game.state';
import { map, take } from 'rxjs/operators';

export const gameGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(GameState.getState).pipe(
    take(1),
    map(state => {
      if (!state.players.length) {
        return router.createUrlTree(['/']);
      }
      return true;
    }),
  );
};
