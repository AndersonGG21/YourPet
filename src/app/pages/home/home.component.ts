import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit{
  
  ngOnInit(): void {
    const listItem = document.querySelectorAll('.home-header li');
    const menuBackdrop = document.querySelector('#menu-backdrop') as HTMLDivElement;

    listItem.forEach((item) => {
      item.addEventListener('mouseenter', ({ target} : any) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        menuBackdrop.style.setProperty("--left", `${left}px`);
        menuBackdrop.style.setProperty("--top", `${top}px`);
        menuBackdrop.style.setProperty("--width", `${width}px`);
        menuBackdrop.style.setProperty("--heigth", `${height}px`);
        menuBackdrop.style.visibility = 'visible';
        menuBackdrop.style.opacity = '1';
      })

      item.addEventListener('mouseleave', () => {
        menuBackdrop.style.visibility = 'hidden';
        menuBackdrop.style.opacity = '0';
      })
    })
  }

  
}
