-- Ejecuta este script en Supabase > SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null,
  material text not null,
  description text,
  image_url text,
  images jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.products add column if not exists images jsonb default '[]';
-- Si la columna quedo creada como texto (guardando el array como string JSON), corrige el tipo:
alter table public.products alter column images type jsonb using (
  case when images is null or images::text = '' then '[]'::jsonb else images::text::jsonb end
);

alter table public.products enable row level security;
create policy "El catálogo es público" on public.products for select using (true);
create policy "Usuarios autenticados administran productos" on public.products for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
create policy "Lectura pública de imágenes" on storage.objects for select using (bucket_id = 'product-images');
create policy "Usuarios autenticados suben imágenes" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "Usuarios autenticados actualizan imágenes" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "Usuarios autenticados borran imágenes" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
