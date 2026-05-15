import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
})
export class ClienteListComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  clientes = signal<Cliente[]>([]);

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => this.clientes.set(data),
      error: (err: unknown) => console.error('Error al carregar clients', err),
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/dashboard/clientes/nuevo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/dashboard/clientes/editar', id]);
  }

  deleteCliente(id: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.clientes.update((items) => items.filter((c) => c.id !== id));
        },
        error: (err: unknown) => console.error('Error al eliminar cliente', err),
      });
    }
  }
}