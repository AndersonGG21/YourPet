import { Component } from '@angular/core';
import { Medicine } from '@models/medicine';
import { MedicineService } from '@services/medicine.service';
import { ConfirmationService, MessageService } from 'primeng/api';
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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    InputNumberModule,
    DialogModule,
    FormsModule,
    UpperCasePipe],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.scss'
})
export default class MedicinesComponent {

  medicineDialog: boolean = false;

  medicines!: Medicine[];

  medicine!: Medicine;

  selectedMedicines!: Medicine[] | null;

  exportColumns!: ExportColumn[];
  submitted: boolean = false;
  cols!: Column[];

  constructor(
    private medicineService: MedicineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {};

  ngOnInit(): void {
    this.medicines = [
      {
        idMedicamento: 1,
        nombre: 'Medicamento 1',
        descripcion: 'Descripción del medicamento 1',
        dosis: 100
      },
      {
        idMedicamento: 2,
        nombre: 'Medicamento 2',
        descripcion: 'Descripción del medicamento 2',
        dosis: 200
      },
      {
        idMedicamento: 3,
        nombre: 'Medicamento 3',
        descripcion: 'Descripción del medicamento 3',
        dosis: 300
      },
      {
        idMedicamento: 4,
        nombre: 'Medicamento 4',
        descripcion: 'Descripción del medicamento 4',
        dosis: 400
      },
      {
        idMedicamento: 5,
        nombre: 'Medicamento 5',
        descripcion: 'Descripción del medicamento 5',
        dosis: 500
      }
    ];

    this.cols = [
      { field: 'idMedicamento', header: 'ID', customExportHeader: 'ID Medicamento' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },      
      { field: 'dosis', header: 'Dosis' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }


  openNew() {
    this.medicine = {
      idMedicamento: 0,
      nombre: '',
      descripcion: '',
      dosis: 0
    };
    this.submitted = false;
    this.medicineDialog = true;
  }

  editMedicine(medicine: Medicine) {
    this.medicine = { ...medicine };
    this.medicineDialog = true;
  }

  deleteMedicine(medicine: Medicine) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a ' + medicine.nombre + '?',
      header: 'Confirmar',
      accept: () => {
        this.medicines = this.medicines.filter((val) => val.idMedicamento !== medicine.idMedicamento);
        this.medicine = {
          idMedicamento: 0,
          nombre: '',
          descripcion: '',
          dosis: 0
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Medicamento Borrado',
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
    this.medicineDialog = false;
    this.submitted = false;
  }

  saveMedicine() {
    this.submitted = true;

    if (this.medicine.nombre?.trim()) {
      if (this.medicine.idMedicamento) {        
        this.medicines[this.findIndexById(this.medicine.idMedicamento)] = this.medicine;        
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Medicamento actualizado',
          life: 3000,
        });        
      } else {
        this.medicine.idMedicamento = this.createId();              
        
        this.medicines.push(this.medicine);                    
        
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Medicamento Creado',
          life: 3000,
        });        
      }

      this.medicines = [...this.medicines];
      this.medicineDialog = false;
      this.medicine = {
        idMedicamento: 0,
        nombre: '',
        descripcion: '',
        dosis: 0
      };
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.medicines.length; i++) {
      if (this.medicines[i].idMedicamento === id) {
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
        (doc as any).autoTable(this.exportColumns, this.medicines);
        doc.save('medicines.pdf');
      });
    });
  }
}
