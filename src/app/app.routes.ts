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
        path: 'owners',
        loadComponent: ()=> import('./pages/owners/owners.component') 
    },
    { 
        path: 'medicines',
        loadComponent: ()=> import('./pages/medicines/medicines.component') 
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
