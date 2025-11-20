import { AnimationSprite } from './AnimationSprite';

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;

  img: HTMLImageElement; // imagen base opcional
  animationSprite: AnimationSprite[];

  currentAnimation: number; // índice de animación
  currentFrame: number;     // frame actual
  frameSpeed: number;       // velocidad
  frameCounter: number;     // contador interno
}