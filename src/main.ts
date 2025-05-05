import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { AppComponent } from './app/app.component';
import { GameState } from './app/core/state/game.state';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore([GameState], {
      developmentMode: true,
    }),
    withNgxsReduxDevtoolsPlugin(),
    withNgxsLoggerPlugin(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
}).catch(err => console.error(err));
