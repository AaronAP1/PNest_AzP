import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateDimensionTransversalDto {
  @IsString()
  pregunta: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
