
-- Warranty submissions
CREATE TABLE public.warranty_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  serial TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  dealer TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.warranty_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit warranty" ON public.warranty_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view warranty" ON public.warranty_submissions
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete warranty" ON public.warranty_submissions
  FOR DELETE TO authenticated USING (public.is_admin());

-- Dealer enquiries
CREATE TABLE public.dealer_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dealer_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit dealer enquiry" ON public.dealer_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view dealer enquiries" ON public.dealer_enquiries
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete dealer enquiries" ON public.dealer_enquiries
  FOR DELETE TO authenticated USING (public.is_admin());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.warranty_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dealer_enquiries;
ALTER TABLE public.warranty_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.dealer_enquiries REPLICA IDENTITY FULL;

CREATE INDEX idx_warranty_created ON public.warranty_submissions(created_at DESC);
CREATE INDEX idx_dealer_created ON public.dealer_enquiries(created_at DESC);
