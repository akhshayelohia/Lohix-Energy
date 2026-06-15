
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 104857600, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/quicktime'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

CREATE POLICY "Admins upload site-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

CREATE POLICY "Admins update site-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

CREATE POLICY "Admins delete site-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin());
