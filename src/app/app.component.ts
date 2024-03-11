import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { PrimeNGConfig } from 'primeng/api';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, AccordionModule, RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'YourPet App';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
