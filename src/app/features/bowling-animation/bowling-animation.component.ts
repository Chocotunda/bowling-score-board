import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface Pin {
  fallen: boolean;
}

@Component({
  selector: 'app-bowling-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bowling-animation.component.html',
  styleUrls: ['./bowling-animation.component.scss'],
})
export class BowlingAnimationComponent implements AfterViewInit {
  pins: Pin[] = Array(10).fill({ fallen: false });
  isRolling = false;

  ngAfterViewInit() {
    this.animate();
  }

  animate() {
    const ball = document.querySelector('#d2_found_state_gobowling #ball');
    const pins = document.querySelectorAll('#d2_found_state_gobowling #pin [id^=pin]');

    const tl = gsap.timeline();

    tl.set(ball, { transformOrigin: '50% 50%' })
      .to(
        ball,
        {
          duration: 1.8,
          rotation: 1080,
          xPercent: 580,
          ease: 'back.inOut',
        },
        0,
      )
      .to(
        pins,
        {
          duration: 2,
          transformOrigin: '50% 100%',
          rotation: i => [80, 40, -10, 0, 100, 0, -20, 40, -40, 0][i],
          scale: i => (i % 2 === 0 ? 1.5 : 1.2),
          stagger: {
            from: 'center',
            amount: 0.3,
          },
        },
        1.05,
      );
  }
}
