export class UsuarioResponseDto {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  activo: boolean;
  idRol: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UsuarioResponseDto>) {
    Object.assign(this, partial);
  }

  // No incluimos la contraseña por seguridad
}
