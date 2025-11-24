import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// Service
import { SpriteService } from '../../services/sprites.service';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pet-view',
  imports: [],
  templateUrl: './pet-view.html',
  styleUrl: './pet-view.scss',
})
export class PetView implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  canvas!: HTMLCanvasElement;

  constructor(
    private readonly spriteService: SpriteService,
    private readonly petService: PetService
  ) {
    petService.initPetService('assets/pet/pet.png');
  }

  onCanvasClickUp(event: MouseEvent) {
    this.spriteService.changesAnimationClick(event, 1);
    
  }

  onCanvasClickDown(event: MouseEvent) {
    this.spriteService.changesAnimationClick(event, 2);
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('home-canvas') as HTMLCanvasElement;
    // Asegurar que el canvas tenga el tamaño visual real del DOM
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.spriteService.init(this.canvas);
    // Ahora centrar sí funciona porque width/height son correctos
    // Ahora que init ha terminado, ya puedes centrar correctamente
    this.centerPet();

    this.spriteService.addSprite(this.petService.sprite);
    this.spriteService.start();
  }

  private centerPet() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const scale = this.spriteService.getScale();

    this.petService.sprite.x = (canvasWidth - this.petService.sprite.width * scale) / (2 * scale);
    this.petService.sprite.y = (canvasHeight - this.petService.sprite.height * scale) / (2 * scale);

    console.log(
      'Canvas:',
      canvasWidth,
      canvasHeight,
      'Pet:',
      this.petService.sprite.x,
      this.petService.sprite.y,
      'Scale:',
      scale
    );
  }
}
