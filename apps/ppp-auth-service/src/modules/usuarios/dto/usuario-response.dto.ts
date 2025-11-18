import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RolResponseDto {
  @ApiProperty({ 
    description: 'ID del rol', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombre del rol', 
    example: 'Administrador' 
  })
  nombre: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del rol', 
    example: 'Administrador del sistema con todos los permisos' 
  })
  descripcion?: string;

  @ApiProperty({ 
    description: 'Fecha de creación', 
    example: '2025-11-18T10:00:00.000Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de actualización', 
    example: '2025-11-18T10:00:00.000Z' 
  })
  updatedAt: Date;
}

export class UsuarioRolResponseDto {
  @ApiProperty({ 
    description: 'ID del usuario', 
    example: '660e8400-e29b-41d4-a716-446655440000' 
  })
  usuarioId: string;

  @ApiProperty({ 
    description: 'ID del rol', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  rolId: string;

  @ApiProperty({ 
    description: 'Datos del rol asignado',
    type: RolResponseDto
  })
  rol: RolResponseDto;
}

export class UsuarioResponseDto {
  @ApiProperty({ 
    description: 'ID del usuario', 
    example: '660e8400-e29b-41d4-a716-446655440000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombres del usuario', 
    example: 'Juan Carlos' 
  })
  nombres: string;

  @ApiProperty({ 
    description: 'Apellidos del usuario', 
    example: 'Pérez García' 
  })
  apellidos: string;

  @ApiProperty({ 
    description: 'Email del usuario', 
    example: 'juan.perez@upeu.edu.pe' 
  })
  email: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono del usuario', 
    example: '987654321' 
  })
  telefono?: string;

  @ApiProperty({ 
    description: 'Estado activo del usuario', 
    example: true 
  })
  activo: boolean;

  @ApiProperty({ 
    description: 'Roles asignados al usuario (relación many-to-many)',
    type: [UsuarioRolResponseDto],
    isArray: true
  })
  roles: UsuarioRolResponseDto[];

  @ApiProperty({ 
    description: 'Fecha de creación', 
    example: '2025-11-18T10:00:00.000Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de actualización', 
    example: '2025-11-18T10:00:00.000Z' 
  })
  updatedAt: Date;
}
