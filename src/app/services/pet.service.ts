import { Injectable, signal } from '@angular/core';
import { Pet } from '../models/pet/pet.model';
import { AnimationSet } from '../models/sprites/animation-set.model';
import { Stats } from '../models/pet/stats.model';
import { Color } from '../models/sprites/color.model';

import { CollisionService } from './collision.service';
import { SpriteService } from './sprites.service';
import { AnimationService } from './animation.service';
import { DataService } from './data.service';
import { PetIaService } from './pet-ia.service';

@Injectable({ providedIn: 'root' })
export class PetService {
  colors: Color[] = [];
  pet: Pet = {} as Pet;

  statsChanged = signal<Stats[]>([]);
  animations: AnimationSet[] = [];
  activeIa = true;

  private pressTimer: any = null;
  private readonly LONG_PRESS = 250;

  private pointerOffsetX = 0;
  private pointerOffsetY = 0;

  private readonly BASE_WIDTH = 200;
  private readonly BASE_HEIGHT = 200;

  constructor(
    private readonly collisionService: CollisionService,
    private readonly spriteService: SpriteService,
    private readonly animationService: AnimationService,
    private readonly dataService: DataService,
    private readonly petIaService: PetIaService
  ) {}

  update(delta: number) {
    if (this.activeIa) {
      this.petIaService.update(
        this.pet,
        (dir) => this.getAnimationDuration(dir),
        (dir) => this.setAnimation(dir),
        (dx, dy) => this.movePet(dx, dy),
        (dx, dy) => this.sumMinusStat(dx, dy)
      );
    }
    this.updateStats(delta);
  }

  movePet(dx: number, dy: number) {
    this.pet.sprite.x += dx;
    this.pet.sprite.y += dy;
  }

  initPetService() {
    this.pet = this.dataService.getPet();
    this.colors = this.dataService.getColors();

    this.animations = this.dataService.getAnimations(this.pet.id);
    this.animationService.loadAnimations(this.pet, this.animations);
    this.loadAnimations();
  }

  private loadAnimations() {
    for (const anim of this.animations) {
      const frames: HTMLImageElement[] = [];

      for (let i = 0; i < anim.frames; i++) {
        const img = new Image();
        img.src = `${anim.baseUrl}pixil-frame-${i}.png`;
        frames.push(img);
      }

      this.pet.sprite.animationSprite[anim.name] = {
        frameImg: frames,
        animationType: anim.animationType,
      };
    }
  }

  // pocision del canvas
  getMousePos(evt: MouseEvent) {
    const canvas = this.spriteService.getCanvas();
    const rect = canvas.getBoundingClientRect();

    // Convertir de CSS a canvas logico (200×200)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  handlePressDown(event: MouseEvent) {
    if (!this.isPetPressed(event)) return;

    this.clearPressTimer();

    this.pressTimer = setTimeout(() => {
      this.pet.isGrab = true;

      const mouse = this.getMousePos(event);

      // Pasar a coordenadas logicas
      const logicalX = mouse.x / this.spriteService.spriteScale;
      const logicalY = mouse.y / this.spriteService.spriteScale;

      this.pointerOffsetX = logicalX - this.pet.sprite.x;
      this.pointerOffsetY = logicalY - this.pet.sprite.y;

      this.pet.sprite.currentAnimation = 'grab';
      this.pet.sprite.currentFrame = 0;
    }, this.LONG_PRESS);
  }

  handlePressUp(event: MouseEvent) {
    this.clearPressTimer();
    this.pet.isGrab = false;

    if (!this.isPetPressed(event)) return;

    if (!this.pet.blockMove) {
      this.pet.sprite.currentAnimation = 'tutsitutsi';
      this.pet.sprite.currentFrame = 0;
      this.pet.blockMove = true;

      this.sumMinusStat('happiness', 5);

      setTimeout(() => {
        this.pet.blockMove = false;
      }, this.animationService.getAnimationDuration(this.pet.sprite));
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.pet.isGrab) return;

    const mouse = this.getMousePos(event);

    // Coordenadas logicas
    const logicalX = mouse.x / this.spriteService.spriteScale;
    const logicalY = mouse.y / this.spriteService.spriteScale;

    const newX = logicalX - this.pointerOffsetX;
    const newY = logicalY - this.pointerOffsetY;

    const maxX = this.BASE_WIDTH - this.pet.sprite.width;
    const maxY = this.BASE_HEIGHT - this.pet.sprite.height;

    this.pet.sprite.x = Math.max(0, Math.min(newX, maxX));
    this.pet.sprite.y = Math.max(0, Math.min(newY, maxY));
  }

  // Cuando se preciona la mascota
  isPetPressed(event: MouseEvent): boolean {
    const mouse = this.getMousePos(event);

    // Ahora ambos estan en el espacio logico 200×200
    const sprite = this.pet.sprite;
    const scaledWidth = sprite.width * this.spriteService.spriteScale;
    const scaledHeight = sprite.height * this.spriteService.spriteScale;

    return (
      mouse.x >= sprite.x &&
      mouse.x <= sprite.x + scaledWidth &&
      mouse.y >= sprite.y &&
      mouse.y <= sprite.y + scaledHeight
    );
  }

  clearPressTimer() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  setAnimation(name: string) {
    if (!this.pet.sprite.animationSprite[name]) return;
    if (this.pet.sprite.currentAnimation === name) return;

    this.pet.sprite.currentAnimation = name;
    this.pet.sprite.currentFrame = 0;
    this.pet.sprite.frameCounter = 0;
  }

  getAnimationDuration(animationName: string): number {
    return this.animationService.getAnimationDurationFrames(this.pet.sprite, animationName);
  }

  private updateStats(delta: number) {
    if (this.pet.cheats.godMode) return;

    const dt = delta / 1000;

    for (const stat of this.pet.stats) {
      if (stat.active) {
        stat.porcent = Math.max(0, stat.porcent - stat.decay * dt);
      }
    }

    this.statsChanged.set([...this.pet.stats]);
  }

  sumMinusStat(statName: string, value: number) {
    if (this.pet.cheats.godMode) return;

    const stat = this.pet.stats.find((s) => s.name === statName);
    if (stat) {
      stat.porcent = Math.min(100, stat.porcent + value);
    }
  }
}
