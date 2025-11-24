import { Injectable } from '@angular/core';
// modelos
import { Sprite } from '../models/sprites/sprites.model';
import { Pet } from '../models/pet/pet.model';
import { AnimationSprite } from '../models/sprites/animationSprite.model';
@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly animations = [
    {
      name: 'idle',
      baseUrl: 'assets/pet/AnimationStanby/',
      frames: 30,
    },
    {
      name: 'tutsitutsi',
      baseUrl: 'assets/pet/tutsitutsi/',
      frames: 20,
    },
    {
      name: 'grab',
      baseUrl: 'assets/pet/Grab/',
      frames: 11,
    },
  ];

  sprite: Sprite = {
    img: new Image(),
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    animationSprite: [],

    currentAnimation: 0,
    currentFrame: 0,
    frameSpeed: 10,
    frameCounter: 0,

    timeoutId: null,
  };
  
  pet: Pet = {
    sprite: this.sprite
  };

  initPetService(petImg: string) {
    this.sprite.img.src = petImg;
    this.loadAnimations();
  }

  // para las animaciones que se asiugnn arriba
  private loadAnimations() {
    for (const anim of this.animations) {
      const frames: HTMLImageElement[] = [];

      for (let i = 0; i < anim.frames; i++) {
        const frameImg = new Image();
        frameImg.src = `${anim.baseUrl}pixil-frame-${i}.png`;
        frames.push(frameImg);
      }

      const animation: AnimationSprite = {
        name: anim.name,
        frameImg: frames,
      };

      this.pet.sprite.animationSprite.push(animation);
    }
  }

  
}
