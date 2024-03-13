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
    
  }

  
}
