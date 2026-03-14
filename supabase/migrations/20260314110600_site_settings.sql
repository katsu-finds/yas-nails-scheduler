-- Create site_settings table
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY,
  booking_prompt TEXT NOT NULL DEFAULT 'Follow the steps below to reserve your slot.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.site_settings (id, booking_prompt)
VALUES ('default', 'Follow the steps below to reserve your slot.')
ON CONFLICT (id) DO NOTHING;
