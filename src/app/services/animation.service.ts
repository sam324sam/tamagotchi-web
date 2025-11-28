import { Injectable } from '@angular/core';
// modelos
import { Sprite } from '../models/sprites/sprites.model';
// Servicios que usen los loops


@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private sprites: Sprite[] = [];

  addSprite(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  deleteSprite(sprite: Sprite) {
    this.sprites = this.sprites.filter((s) => s !== sprite);
  }

  update() {
    for (const sprite of this.sprites) {
      const anim = sprite.animationSprite[sprite.currentAnimation];
      if (!anim) continue;

      sprite.frameCounter++;

      if (sprite.frameCounter >= sprite.frameSpeed) {
        sprite.frameCounter = 0;

        sprite.currentFrame++;

        const totalFrames = anim.frameImg.length;

        if (sprite.currentFrame >= totalFrames) {
          if (anim.animationType === 'loop') {
            // Repetir la animacion
            sprite.currentFrame = 0;
          } else if (anim.animationType === 'once') {
            // Animación de una sola vez volver a idle
            sprite.currentAnimation = 'idle';
            sprite.currentFrame = 0;
          }
        }
      }
    }
  }

  getFrame(sprite: Sprite) {
    const animation = sprite.animationSprite[sprite.currentAnimation];
    return animation.frameImg[sprite.currentFrame];
  }

  // Duracion de la animacion en segundos
  getAnimationDuration(sprite: Sprite): number {
    const frames = sprite.animationSprite[sprite.currentAnimation].frameImg.length;
    // total de ticks
    return frames * sprite.frameSpeed; 
  }

  // Duracion de la animacion en frames
  getAnimationDurationFrames(sprite: Sprite, animationName: string): number {
    const anim = sprite.animationSprite[animationName];
    if (!anim) return 0;

    const totalFrames = anim.frameImg.length;
    const frameSpeed = sprite.frameSpeed;
    // frames
    return totalFrames * frameSpeed;
  }
}
