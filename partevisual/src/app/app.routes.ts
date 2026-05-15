import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ClienteListComponent } from './clientes/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form.component';
import { SucursalListComponent } from './sucursales/sucursal-list.component';
import { SucursalFormComponent } from './sucursales/sucursal-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', component: ClienteListComponent },
      { path: 'clientes/nuevo', component: ClienteFormComponent },
      { path: 'clientes/editar/:id', component: ClienteFormComponent },
      { path: 'sucursales', component: SucursalListComponent },
      { path: 'sucursales/nuevo', component: SucursalFormComponent },
      { path: 'sucursales/editar/:id', component: SucursalFormComponent },
    ],
  },
];
