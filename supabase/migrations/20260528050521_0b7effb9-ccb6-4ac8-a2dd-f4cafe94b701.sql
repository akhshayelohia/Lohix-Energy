
-- 1. Remove open admin bootstrap
DROP TRIGGER IF EXISTS on_auth_user_created_admin_bootstrap ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_admin_bootstrap();

-- 2. Stop realtime leak: remove tables from supabase_realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.warranty_submissions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.dealer_enquiries;

-- 3. Tighten INSERT policies and add CHECK constraints
ALTER TABLE public.warranty_submissions
  ADD CONSTRAINT warranty_full_name_len CHECK (char_length(full_name) BETWEEN 2 AND 80),
  ADD CONSTRAINT warranty_email_fmt CHECK (char_length(email) BETWEEN 5 AND 160 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT warranty_phone_fmt CHECK (phone ~ '^[+0-9\s-]{7,20}$'),
  ADD CONSTRAINT warranty_serial_fmt CHECK (serial ~ '^[A-Za-z0-9-]{4,32}$'),
  ADD CONSTRAINT warranty_dealer_len CHECK (char_length(dealer) BETWEEN 2 AND 80),
  ADD CONSTRAINT warranty_city_len CHECK (char_length(city) BETWEEN 2 AND 60),
  ADD CONSTRAINT warranty_state_len CHECK (char_length(state) BETWEEN 2 AND 40),
  ADD CONSTRAINT warranty_vehicle_len CHECK (char_length(vehicle_type) BETWEEN 1 AND 40);

ALTER TABLE public.dealer_enquiries
  ADD CONSTRAINT dealer_name_len CHECK (char_length(name) BETWEEN 2 AND 80),
  ADD CONSTRAINT dealer_phone_fmt CHECK (phone ~ '^[+0-9\s-]{7,20}$'),
  ADD CONSTRAINT dealer_city_len CHECK (char_length(city) BETWEEN 2 AND 60);

DROP POLICY IF EXISTS "Anyone can submit warranty" ON public.warranty_submissions;
CREATE POLICY "Anyone can submit warranty" ON public.warranty_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 80
    AND char_length(email) BETWEEN 5 AND 160
    AND char_length(phone) BETWEEN 7 AND 20
    AND char_length(serial) BETWEEN 4 AND 32
    AND char_length(city) BETWEEN 2 AND 60
    AND char_length(dealer) BETWEEN 2 AND 80
  );

DROP POLICY IF EXISTS "Anyone can submit dealer enquiry" ON public.dealer_enquiries;
CREATE POLICY "Anyone can submit dealer enquiry" ON public.dealer_enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 80
    AND char_length(phone) BETWEEN 7 AND 20
    AND char_length(city) BETWEEN 2 AND 60
  );

-- 4. Storage: drop broad public SELECT (public bucket files are still served via /object/public/* without needing this policy)
DROP POLICY IF EXISTS "Public read site-media" ON storage.objects;
CREATE POLICY "Admins list site-media" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin());

-- 5. Lock down SECURITY DEFINER helpers from anon (authenticated still needs EXECUTE for RLS)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
