// sprite.service.ts
import { Injectable } from '@angular/core';
// modelo
import { Sprite } from '../models/sprites/sprites.model';

@Injectable({ providedIn: 'root' })
export class SpriteService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private sprites: Sprite[] = [];
  private animationId: number | null = null;
  private scaleSprite: number = 2;
  private readonly referenceWidth: number = 100;

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    // Desactivar suavizado para pixel art
    this.ctx.imageSmoothingEnabled = false;

    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.imageRendering = '-moz-crisp-edges';
    this.canvas.style.imageRendering = 'crisp-edges';

    // Ajustar tamaño inicial
    this.resizeCanvas();

    // Escuchar cambios de ventana para mantener responsive
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    if (!this.canvas) return;

    // Obtener tamaño del contenedor
    const rect = this.canvas.getBoundingClientRect();

    // enteros para evitar blur
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    // Establecer tamaño interno del canvas (sin DPR por ahora)
    this.canvas.width = width;
    this.canvas.height = height;

    // Aplicar estilos CSS para pixel-perfect se me acaban las ideas
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.imageRendering = 'pixelated';

    // Desactivar suavizado en el contexto
    this.ctx.imageSmoothingEnabled = false;

    // Calcular escala
    this.scaleSprite = width / this.referenceWidth;

    //console.log('Canvas:', width, 'x', height, '| Scale:', this.scaleSprite);
  }

  addSprite(sprite: any) {
    this.sprites.push(sprite);
  }

  start() {
    const loop = () => {
      this.update();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const sprite of this.sprites) {
      // avanzar animación
      this.updateAnimation(sprite);

      // obtener el frame actual
      const frame = sprite.animationSprite[sprite.currentAnimation].frameImg[sprite.currentFrame];

      // dibujar frame actual
      this.ctx.drawImage(
        frame,
        sprite.x * this.scaleSprite,
        sprite.y * this.scaleSprite,
        sprite.width * this.scaleSprite,
        sprite.height * this.scaleSprite
      );
    }
  }

  private updateAnimation(sprite: Sprite) {
    sprite.frameCounter++;

    if (sprite.frameCounter >= sprite.frameSpeed) {
      sprite.frameCounter = 0;

      sprite.currentFrame++;

      const totalFrames = sprite.animationSprite[sprite.currentAnimation].frameImg.length;

      if (sprite.currentFrame >= totalFrames) {
        sprite.currentFrame = 0; // loop
      }
    }
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  getScale() {
    return this.scaleSprite;
  }
}
