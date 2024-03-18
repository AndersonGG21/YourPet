import { Component, OnInit } from '@angular/core';
import { Owner } from '@models/owner';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { OwnerService } from '@services/owner.service';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    InputNumberModule,
    DialogModule,
    FormsModule,
    UpperCasePipe],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.scss'
})
export default class OwnersComponent implements OnInit{
  
  ownerDialog: boolean = false;

  owners!: Owner[];

  owner!: Owner;

  selectedOwners!: Owner[] | null;

  exportColumns!: ExportColumn[];
  submitted: boolean = false;

  constructor(
    private ownerService: OwnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {};

  ngOnInit(): void {
    this.owners = [
      {
        idCliente: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@example.com',
        direccion: 'Calle 123',
        telefono: '1234567890',
        image: 'url-de-la-imagen-1',
        gender: 'male'
      },
      {
        idCliente: 2,
        nombre: 'Ana',
        apellido: 'Gómez',
        correo: 'ana.gomez@example.com',
        direccion: 'Avenida 456',
        telefono: '0987654321',
        image: 'url-de-la-imagen-2',
        gender: 'female'
      },
      {
        idCliente: 3,
        nombre: 'Pedro',
        apellido: 'Martínez',
        correo: 'pedro.martinez@example.com',
        direccion: 'Boulevard 789',
        telefono: '1122334455',
        image: 'url-de-la-imagen-3',
        gender: 'male'
      },
      {
        idCliente: 4,
        nombre: 'María',
        apellido: 'Rodríguez',
        correo: 'maria.rodriguez@example.com',
        direccion: 'Callejón 101112',
        telefono: '5566778899',
        image: 'url-de-la-imagen-4',
        gender: 'female'
      },
      {
        idCliente: 5,
        nombre: 'Carlos',
        apellido: 'González',
        correo: 'carlos.gonzalez@example.com',
        direccion: 'Paseo 131415',
        telefono: '9988776655',
        image: 'url-de-la-imagen-5',
        gender: 'male'
      }
    ];

    this.owners.forEach((owner) => {
      this.ownerService.getRandImage(owner.gender!).subscribe((data) => {        
        owner.image = data.results[0].picture.medium;
      });
    });
  }


  openNew() {
    this.owner = {
      idCliente: 0,
      nombre: '',
      apellido: '',
      correo: '',
      direccion: '',
      telefono: '',
    };
    this.submitted = false;
    this.ownerDialog = true;
  }

  editOwner(owner: Owner) {
    this.owner = { ...owner };
    this.ownerDialog = true;
  }

  deleteOwner(owner: Owner) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a ' + owner.nombre + '?',
      header: 'Confirmar',
      accept: () => {
        this.owners = this.owners.filter((val) => val.idCliente !== owner.idCliente);
        this.owner = {
          idCliente: 0,
          nombre: '',
          apellido: '',
          correo: '',
          direccion: '',
          telefono: '',
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Cliente Borrado',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: '',
          summary: 'Cancelado',
          detail: 'Operación Cancelada',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.ownerDialog = false;
    this.submitted = false;
  }

  saveOwner() {
    this.submitted = true;

    if (this.owner.nombre?.trim()) {
      if (this.owner.idCliente) {        
        this.owners[this.findIndexById(this.owner.idCliente)] = this.owner;        
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Mascota actualizada',
          life: 3000,
        });        
      } else {
        this.owner.idCliente = this.createId();              
        var aux = this.owner;        

        this.ownerService.getRandImage(aux.gender!).subscribe((data) => {          
          aux.image = data.results[0].picture.medium;                                        
          this.owners.push(aux);                    
          this.owners = [...this.owners];
        })          
        
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Cliente Creado',
          life: 3000,
        });        
      }

      this.owners = [...this.owners];
      this.ownerDialog = false;
      this.owner = {
        idCliente: 0,
        nombre: '',
        apellido: '',
        correo: '',
        direccion: '',
        telefono: '',
      };
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.owners.length; i++) {
      if (this.owners[i].idCliente === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    let id = 0;
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < 5; i++) {
      id += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return id;
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.owners);
        doc.save('pets.pdf');
      });
    });
  }


}
