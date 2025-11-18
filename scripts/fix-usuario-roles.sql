-- ============================================================
-- SCRIPT PARA CORREGIR ESTRUCTURA DE ROLES
-- ============================================================
-- Migra de sistema "un rol por usuario" a "múltiples roles"
-- EJECUTAR EN: DATABASE_URL_AUTH (ppp-auth-service)
-- ============================================================

\echo '======================================'
\echo 'PASO 1: Migrar datos existentes'
\echo '======================================'

-- Migrar roles actuales de usuario.id_rol a usuario_rel
-- (Solo si id_rol tiene datos)
INSERT INTO usuario_rel (usuarioId, rolId)
SELECT 
  u.id as usuarioId,
  u.id_rol as rolId
FROM usuario u
WHERE u.id_rol IS NOT NULL
  AND NOT EXISTS (
    -- Evitar duplicados si ya existen en usuario_rel
    SELECT 1 FROM usuario_rel ur 
    WHERE ur.usuarioId = u.id 
      AND ur.rolId = u.id_rol
  );

\echo 'Datos migrados a usuario_rel'
SELECT COUNT(*) as "Relaciones migradas" FROM usuario_rel;

\echo ''
\echo '======================================'
\echo 'PASO 2: Eliminar columna id_rol'
\echo '======================================'

-- Eliminar la columna id_rol de usuario
ALTER TABLE usuario DROP COLUMN IF EXISTS id_rol;

\echo '✅ Columna id_rol eliminada de tabla usuario'

\echo ''
\echo '======================================'
\echo 'PASO 3: Verificación'
\echo '======================================'

-- Verificar estructura final
SELECT 
  'Usuarios sin roles' as alerta,
  COUNT(*) as cantidad
FROM usuario u
WHERE NOT EXISTS (
  SELECT 1 FROM usuario_rel ur WHERE ur.usuarioId = u.id
);

-- Mostrar distribución de roles
SELECT 
  r.nombre as rol,
  COUNT(ur.usuarioId) as cantidad_usuarios
FROM rol r
LEFT JOIN usuario_rel ur ON r.id = ur.rolId
GROUP BY r.id, r.nombre
ORDER BY cantidad_usuarios DESC;

\echo ''
\echo '======================================'
\echo '✅ MIGRACIÓN COMPLETADA'
\echo '======================================'
\echo 'Ahora puedes asignar múltiples roles a cada usuario'
