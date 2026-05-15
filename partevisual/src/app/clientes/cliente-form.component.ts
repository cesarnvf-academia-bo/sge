import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteForm: FormGroup;
  isEditMode = signal(false);
  clienteId = signal<number | null>(null);

  constructor() {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      ci: ['', [Validators.maxLength(20)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      direccion: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Record<string, unknown>) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.clienteId.set(+params['id']);
        this.loadCliente(+params['id']);
      }
    });
  }

  loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe({
      next: (data: Cliente) => this.clienteForm.patchValue(data),
      error: (err: unknown) => console.error('Error al cargar cliente', err),
    });
  }

  guardar(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const clienteData: Partial<Cliente> = this.clienteForm.value;

    if (this.isEditMode() && this.clienteId()) {
      this.clienteService.updateCliente(this.clienteId()!, clienteData).subscribe({
        next: () => this.router.navigate(['/dashboard/clientes']),
        error: (err: unknown) => console.error('Error al actualizar cliente', err),
      });
    } else {
      this.clienteService.createCliente(clienteData).subscribe({
        next: () => this.router.navigate(['/dashboard/clientes']),
        error: (err: unknown) => console.error('Error al crear cliente', err),
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/clientes']);
  }
}