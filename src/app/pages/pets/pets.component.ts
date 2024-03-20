import { Component, OnInit, inject } from '@angular/core';
import { Pet, breeds } from '@models/pet';
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
import { UpperCasePipe } from '@angular/common';
import { Owner } from '@models/owner';
import { OwnerService } from '@services/owner.service';
import { MedicineService } from '@services/medicine.service';
import { Medicine } from '@models/medicine';


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
  imports: [
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    InputNumberModule,
    DialogModule,
    FormsModule,
    UpperCasePipe
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss',
})
export default class PetsComponent implements OnInit {
  petDialog: boolean = false;

  pets: Pet[] = [];

  pet!: Pet;

  selectedPets!: Pet[] | null;

  submitted: boolean = false;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  petImage!: string;
  
  breedsList : string[] = [];

  owners : Owner[] = []; 
  medicines: Medicine[] = [];

  ownerService = inject(OwnerService);
  medicinesService = inject(MedicineService);

  constructor(
    private petService: PetService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {    
  }

  ngOnInit() {
    this.petService.getPets().subscribe((pets) => {
      this.pets = pets;

      this.pets.forEach((pet) => {
        this.petService.getRandImage(pet.raza).subscribe((data) => {
          pet.image = data.message;
        });
      });
    });

    this.cols = [
      { field: 'idMascota', header: 'ID', customExportHeader: 'ID Mascota' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'edad', header: 'Edad' },
      { field: 'peso', header: 'Peso' },
      { field: 'idCliente', header: 'Dueño' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.ownerService.getOwners().subscribe((owners) => {
      this.owners = owners;
    });

    this.medicinesService.getMedicines().subscribe((medicines) => {
      this.medicines = medicines;
    });


    this.breedsList = breeds;
  }

  openNew() {
    this.pet = {
      idMascota: 0,
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

  editPet(pet: Pet) {
    this.pet = { ...pet };
    this.petDialog = true;
  }

  deletePet(pet: Pet) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a ' + pet.nombre + '?',
      header: 'Confirmar',
      accept: () => {
        this.pets = this.pets.filter((val) => val.idMascota !== pet.idMascota);
        this.pet = {
          idMascota: 0,
          nombre: '',
          raza: '',
          edad: 0,
          peso: 0,
          idMedicamento: 0,
          idCliente: 0,
        };

        this.petService.deletePet(pet.idMascota).subscribe((data) => {
          console.log("Mascota Borrada");
        })
        
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Mascota Borrada',
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
    this.petDialog = false;
    this.submitted = false;
  }

  savePet() {
    this.submitted = true;

    if (this.pet.nombre?.trim()) {
      if (this.pet.idMascota) {
        this.pets[this.findIndexById(this.pet.idMascota)] = this.pet;

        this.petService.updatePet(this.pet.idMascota,this.pet).subscribe((data) => {
          console.log("Mascota Actualizada");
        })

        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Mascota actualizada',
          life: 3000,
        });
      } else {
        this.pet.idMascota = this.createId();
        var aux = this.pet;

        this.petService.savePet(this.pet).subscribe((data) => {
          console.log("Mascota Creada");
        })

        this.petService.getRandImage(this.pet.raza).subscribe((data) => {          
          aux.image = data.message;
          this.pets.push(aux);                    
          this.pets = [...this.pets];
        })          

        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Mascota Creada',
          life: 3000,
        });

      }

      this.pets = [...this.pets];
      this.petDialog = false;
      this.pet = {
        idMascota: 0,
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
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < 5; i++) {
      id += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return id;
  }

  getOwnerNameById(id: number) : string {
    let ownerName = "";
    this.owners.forEach((owner) => {
      if(owner.idCliente == id) {
        ownerName = owner.nombre;
      }
    });
    return ownerName;
  }

  getMedNameById(id: number) : string {
    let medName = "";
    this.medicines.forEach((med) => {
      if(med.idMedicamento == id) {
        medName = med.nombre;
      }
    });
    return medName;
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

  seePet(pet : Pet) {
    console.log(pet.raza);
  }
}
