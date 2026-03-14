-- Create closed_dates table
CREATE TABLE public.closed_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.closed_dates ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view closed dates" ON public.closed_dates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage closed dates" ON public.closed_dates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
