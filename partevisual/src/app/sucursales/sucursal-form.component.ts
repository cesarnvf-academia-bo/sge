import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './sucursal';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal-form.component.html',
  styleUrls: ['./sucursal-form.component.css'],
})
export class SucursalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sucursalService = inject(SucursalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sucursalForm: FormGroup;
  isEditMode = signal(false);
  sucursalId = signal<number | null>(null);

  constructor() {
    this.sucursalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', Validators.required],
      ciudad: [''],
      telefono: ['', Validators.maxLength(20)],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Record<string, unknown>) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.sucursalId.set(+params['id']);
        this.loadSucursal(+params['id']);
      }
    });
  }

  loadSucursal(id: number): void {
    this.sucursalService.getSucursal(id).subscribe({
      next: (data: Sucursal) => this.sucursalForm.patchValue(data),
      error: (err: unknown) => console.error('Error al cargar sucursal', err),
    });
  }

  guardar(): void {
    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    const sucursalData: Partial<Sucursal> = this.sucursalForm.value;

    if (this.isEditMode() && this.sucursalId()) {
      this.sucursalService.updateSucursal(this.sucursalId()!, sucursalData).subscribe({
        next: () => this.router.navigate(['/dashboard/sucursales']),
        error: (err: unknown) => console.error('Error al actualizar sucursal', err),
      });
    } else {
      this.sucursalService.createSucursal(sucursalData).subscribe({
        next: () => this.router.navigate(['/dashboard/sucursales']),
        error: (err: unknown) => console.error('Error al crear sucursal', err),
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/sucursales']);
  }
}