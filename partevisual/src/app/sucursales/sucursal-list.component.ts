import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './sucursal';

@Component({
  selector: 'app-sucursal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sucursal-list.component.html',
  styleUrls: ['./sucursal-list.component.css'],
})
export class SucursalListComponent implements OnInit {
  private sucursalService = inject(SucursalService);
  private router = inject(Router);

  sucursales = signal<Sucursal[]>([]);

  ngOnInit(): void {
    this.loadSucursales();
  }

  loadSucursales(): void {
    this.sucursalService.getSucursales().subscribe({
      next: (data: Sucursal[]) => this.sucursales.set(data),
      error: (err: unknown) => console.error('Error al cargar sucursales', err),
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/dashboard/sucursales/nuevo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/dashboard/sucursales/editar', id]);
  }

  deleteSucursal(id: number): void {
    if (confirm('¿Está seguro de eliminar esta sucursal?')) {
      this.sucursalService.deleteSucursal(id).subscribe({
        next: () => {
          this.sucursales.update((items) => items.filter((s) => s.id !== id));
        },
        error: (err: unknown) => console.error('Error al eliminar sucursal', err),
      });
    }
  }
}