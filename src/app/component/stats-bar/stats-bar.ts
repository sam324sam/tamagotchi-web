import { Component } from '@angular/core';
// Sercicio
import { PetService } from '../../services/pet.service';
@Component({
  selector: 'app-stats-bar',
  imports: [],
  templateUrl: './stats-bar.html',
  styleUrl: './stats-bar.scss',
})
export class StatsBar {
  constructor(private readonly petService: PetService) {}

  getStats() {
    return this.petService.pet.stats;
  }

  roundStat(porcent: number) {
    return Math.round(porcent);
  }

  // los colores del background
  getColor(porcent: number): string {
    if (porcent > 70) return '#00ff00'; // verde
    if (porcent > 40) return '#ffff00'; // amarillo
    return '#ff0000'; // rojo
  }
}
