import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
			path: 'home',
			loadComponent: ()=> import('./pages/home/home.component') 
    },
    { 
        path: 'pets',
        loadComponent: ()=> import('./pages/pets/pets.component') 
    },
    { 
        path: 'home',
        loadComponent: ()=> import('./pages/owners/owners.component') 
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
