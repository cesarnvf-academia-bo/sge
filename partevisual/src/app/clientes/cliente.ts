export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  ci?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_registro?: Date;
}