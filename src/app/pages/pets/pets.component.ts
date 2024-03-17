import { Component, OnInit } from '@angular/core';
import { Pet } from '@models/pet';
import { PetService } from '@services/pet.service';
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

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}


@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [TableModule, ToastModule, ToolbarModule, ButtonModule, ConfirmDialogModule, InputNumberModule, DialogModule, FormsModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export default class PetsComponent implements OnInit{

    petDialog: boolean = false;

    pets!: Pet[];

    pet!: Pet;

    selectedPets!: Pet[] | null;

    submitted: boolean = false;

    statuses!: any[];

    exportColumns!: ExportColumn[];

    cols!: Column[];


    constructor(private petService: PetService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.pets = [
            {
              idMascota: 1,
              nombre: 'Fido',
              raza: 'Labrador',
              edad: 5,
              peso: 30,
              idMedicamento: 101,
              idCliente: 1001,
            },
            {
              idMascota: 2,
              nombre: 'Whiskers',
              raza: 'Siamese',
              edad: 3,
              peso: 10,
              idMedicamento: 102,
              idCliente: 1002,
            },
            // add more pets as needed
          ];
    }

    ngOnInit() {
        this.petService.getPets().subscribe((pets) => {
          this.pets = pets;
        })

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'idMascota', header: 'ID', customExportHeader: 'ID Mascota' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'edad', header: 'Edad' },
            { field: 'peso', header: 'Peso' },
            { field: 'idCliente', header: 'Dueño' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.pet = {
            idMascota : 0,
            nombre: '',
            raza: '',
            edad: 0,
            peso: 0,
            idMedicamento: 0,
            idCliente: 0,
          };
        this.submitted = false;
        this.petDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to proceed.',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
                this.pets = this.pets.filter((val) => !this.selectedPets?.includes(val));
                this.selectedPets = null;
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });        
    }

    editProduct(pet: Pet) {
        this.pet = { ...pet };
        this.petDialog = true;
    }

    deleteProduct(pet: Pet) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + pet.nombre + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.pets = this.pets.filter((val) => val.idMascota !== pet.idMascota);
                this.pet = {
                  idMascota : 0,
                  nombre: '',
                  raza: '',
                  edad: 0,
                  peso: 0,
                  idMedicamento: 0,
                  idCliente: 0,
                };
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.petDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.pet.nombre?.trim()) {
            if (this.pet.idMascota) {
                this.pets[this.findIndexById(this.pet.idMascota)] = this.pet;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.pet.idMascota = this.createId();
                // this.product.image = 'product-placeholder.svg';
                this.pets.push(this.pet);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.pets = [...this.pets];
            this.petDialog = false;
            this.pet = {
                idMascota : 0,
                nombre: '',
                raza: '',
                edad: 0,
                peso: 0,
                idMedicamento: 0,
                idCliente: 0,
              };
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.pets.length; i++) {
            if (this.pets[i].idMascota === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): number {
        let id = 0;
        var numbers = [0,1,2,3,4,5,6,7,8,9]
        for (var i = 0; i < 5; i++) {
            id += numbers[Math.floor(Math.random() * numbers.length)];
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';    
        }

        return '';
    }

    exportPdf() {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.pets);
                doc.save('pets.pdf');
            });
        });
    }
}