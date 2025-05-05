import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AddPlayers, StartGame } from '../../core/state/game.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  imports: [
    RouterModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
  ],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  playerForm!: FormGroup;
  playerCountOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} Player${i > 0 ? 's' : ''}`,
    value: i + 1,
  }));
  selectedPlayerCount = 1;

  players$: Observable<{ name: string }[]>;

  get players(): FormArray {
    return this.playerForm.get('players') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
  ) {
    this.players$ = this.store.select(state => state.game.players).pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      playerCount: [1, Validators.required],
      players: this.fb.array([this.createPlayerFormGroup()]),
    });

    this.playerForm
      .get('playerCount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.onPlayerCountChange(count);
      });
  }

  createPlayerFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onPlayerCountChange(count: number): void {
    const currentCount = this.players.length;
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.players.push(this.createPlayerFormGroup());
      }
    } else if (count < currentCount) {
      while (this.players.length > count) {
        this.players.removeAt(this.players.length - 1);
      }
    }
  }

  startGame(): void {
    if (this.playerForm.valid) {
      const allPlayerNames = this.players.controls.map(control => control.get('name')?.value);

      this.store
        .dispatch(new AddPlayers(allPlayerNames))
        .pipe(
          switchMap(() => this.store.dispatch(new StartGame())),
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: () => this.router.navigate(['/game']),
          error: error => console.error('Error starting game:', error),
        });
    } else {
      this.playerForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
