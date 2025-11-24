import { AnimationSprite } from './animationSprite.model';

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  // imagen base opcional
  img: HTMLImageElement;
  animationSprite: AnimationSprite[];

  // índice de animación
  currentAnimation: number;
  // frame actual
  currentFrame: number;
  // velocidad
  frameSpeed: number;
  // contador interno
  frameCounter: number;

  // para el temporizador de cambiar a animacion idle
  timeoutId: number | null;
}
