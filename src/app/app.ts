import { Component, OnInit, signal } from '@angular/core';
import { PetView } from './views/pet-view/pet-view';
import { Header } from './component/header/header';

@Component({
  selector: 'app-root',
  imports: [PetView, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit{
  protected readonly title = signal('tamagotchi-web');

  ngOnInit() {
      this.loadGlobalStyles()
  }


  loadGlobalStyles() {
    this.loadFont();
    this.setDefaultCursor();
    this.setPointerCursor();
    this.setGrabCursor();
    this.setPixelBorders();
  }

  private loadFont() {
    const font = new FontFace(
      'upheavtt',
      'url("/assets/fonts/upheavtt.ttf")'
    );
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }

  private setDefaultCursor() {
    document.documentElement.style.cursor =
      'url("/assets/cursor/cursor.png") 16 16, auto';
  }

  private setPointerCursor() {
    const pointerElements = document.querySelectorAll(
      "button, a, [role='button'], select, option, input[type='button'], input[type='submit'], .clickable"
    );

    pointerElements.forEach(el => {
      (el as HTMLElement).style.cursor =
        'url("/assets/cursor/cursor-pointer.png") 16 16, pointer';
    });
  }

  private setGrabCursor() {
    const grabElements = document.querySelectorAll(
      ".draggable, [draggable='true']"
    );

    grabElements.forEach(el => {
      (el as HTMLElement).style.cursor =
        'url("/assets/cursor/cursor-grab.png") 16 16, grab';
    });
  }

  private setPixelBorders() {
    const pixelBoxes = document.querySelectorAll('.pixel-box');

    pixelBoxes.forEach(el => {
      (el as HTMLElement).style.border =
        '16px solid transparent';
      (el as HTMLElement).style.borderImage =
        'url("/assets/icon/UI/border.png") 16 fill round';
      (el as HTMLElement).style.imageRendering = 'pixelated';
    });
  }
}
