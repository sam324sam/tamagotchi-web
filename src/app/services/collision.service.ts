import { Injectable } from '@angular/core';
// model
import { Sprite } from '../models/sprites/sprites.model';

@Injectable({ providedIn: 'root' })
export class CollisionService {
  // Ahora considera la escala del sprite
  isPointInsideSprite(sprite: Sprite, x: number, y: number): boolean {
    const sx = sprite.x;
    const sy = sprite.y;

    const sw = sprite.width;
    const sh = sprite.height;

    const isInside = x >= sx && x <= sx + sw && y >= sy && y <= sy + sh;

    console.log('Click detection:', {
      mouseX: x.toFixed(2),
      mouseY: y.toFixed(2),
      spriteX: sx.toFixed(2),
      spriteY: sy.toFixed(2),
      spriteW: sw,
      spriteH: sh,
      isInside,
    });

    return isInside;
  }

  checkCollision(
    x: number,
    y: number,
    width: number,
    height: number,
    canvas: HTMLCanvasElement
  ): boolean {
    if (x < 0) return true; // izquierda
    if (y < 0) return true; // arriba
    if (x + width > canvas.width) return true; // derecha
    if (y + height > canvas.height) return true; // abajo
    return false; // no hay colision
  }
}
