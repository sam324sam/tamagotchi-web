import { Injectable } from '@angular/core';
// model
import { Sprite } from '../models/sprites/sprites.model';

@Injectable({ providedIn: 'root' })
export class CollisionService {
  isPointInsideSprite(sprite: Sprite, x: number, y: number): boolean {
    const sx = sprite.x;
    const sy = sprite.y;

    const sw = sprite.width;
    const sh = sprite.height;

    return x >= sx && x <= sx + sw && y >= sy && y <= sy + sh;
  }
}
