-- Storage bucket for photos uploaded directly from phones (Gallery, Slander Wall, player profiles).
-- Public bucket so images can be displayed via a plain URL, consistent with every other
-- table in this project which already allows open anon read/write.
insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', true)
on conflict (id) do nothing;

create policy "public read trip-photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'trip-photos');

create policy "public upload trip-photos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'trip-photos');

create policy "public update trip-photos"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'trip-photos');

create policy "public delete trip-photos"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'trip-photos');
