-- Dealer applications now collect an email address so the applicant can get an
-- automatic confirmation. Nullable, so enquiries received before this change stay valid.

ALTER TABLE public.dealer_enquiries
  ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.dealer_enquiries
  DROP CONSTRAINT IF EXISTS dealer_email_fmt;
ALTER TABLE public.dealer_enquiries
  ADD CONSTRAINT dealer_email_fmt CHECK (
    email IS NULL
    OR (char_length(email) BETWEEN 5 AND 160 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  );
