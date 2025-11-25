-- Convertir campo estado de VARCHAR a Boolean en linea_facultad
-- Paso 1: Agregar columna temporal booleana
ALTER TABLE linea_facultad ADD COLUMN estado_temp BOOLEAN DEFAULT true;

-- Paso 2: Copiar valores convertidos (ACTIVO -> true, INACTIVO -> false)
UPDATE linea_facultad 
SET estado_temp = CASE 
    WHEN estado::text = 'ACTIVO' THEN true 
    WHEN estado::text = 'INACTIVO' THEN false 
    ELSE true 
END;

-- Paso 3: Eliminar columna antigua
ALTER TABLE linea_facultad DROP COLUMN estado;

-- Paso 4: Renombrar columna temporal
ALTER TABLE linea_facultad RENAME COLUMN estado_temp TO estado;

-- Resultado
SELECT 'Conversión completada' as status;
