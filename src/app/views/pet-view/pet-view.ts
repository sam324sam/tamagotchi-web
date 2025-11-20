import { AfterViewInit, Component } from '@angular/core';

// Service
import { SpriteService } from '../../services/sprites.service';
// modelos
import { Sprite } from '../../models/sprites/sprites.model';
import { AnimationSprite } from '../../models/sprites/AnimationSprite';
@Component({
  selector: 'app-pet-view',
  imports: [],
  templateUrl: './pet-view.html',
  styleUrl: './pet-view.scss',
})
export class PetView implements AfterViewInit {
  animations = [
    {
      name: 'idle',
      baseUrl: 'assets/pet/AnimationStanby/',
      frames: 30
    }
  ];
  canvas!: HTMLCanvasElement;
  myPet: Sprite = {
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
  };

  constructor(private readonly spriteService: SpriteService) {

    // Imagen por defecto
    this.myPet.img.src = 'assets/pet/pet.png';

    // Cargar animaciones
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
        frameImg: frames
      };

      this.myPet.animationSprite.push(animation);
    }
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('home-canvas') as HTMLCanvasElement;
    this.spriteService.init(this.canvas);
    console.log(this.canvas);
    this.spriteService.addSprite(this.myPet);
    this.spriteService.start();
  }
}
