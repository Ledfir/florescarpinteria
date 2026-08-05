# Madera Luz — Catálogo web

## Arranque

1. Ejecuta `npm install` y después `npm run dev`.
2. Copia `.env.example` como `.env` y añade la URL y clave anónima de tu proyecto de Supabase.
3. En el SQL Editor de Supabase ejecuta el contenido de `supabase.sql`.
4. Crea el usuario administrador en **Authentication > Users** o habilita el proveedor de correo que prefieras.

El catálogo público funciona con piezas de ejemplo si Supabase aún no está configurado. Al configurarlo, los productos se leen desde la tabla `products`; el dashboard permite crear, editar y eliminar, y sube fotografías al bucket público `product-images`.

> Las políticas incluidas otorgan administración a cualquier usuario autenticado. Para una tienda con varios clientes, limita la política a una lista de administradores o a un rol específico antes de publicar.
"# florescarpinteria" 
