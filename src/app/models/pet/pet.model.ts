import { Sprite } from '../sprites/sprites.model';
import { Stats } from './stats.model';
export interface Pet {
  id: number;
  sprite: Sprite;
  isGrab: boolean;
  blockMove: boolean;
  
  stats: Stats[];
}
