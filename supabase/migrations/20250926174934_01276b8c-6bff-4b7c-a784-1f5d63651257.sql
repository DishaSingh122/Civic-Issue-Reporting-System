-- Add a public tracking code to complaints and a safe public RPC for tracking
-- 1) Add tracking_code column with default and uniqueness
ALTER TABLE public.complaints
  ADD COLUMN IF NOT EXISTS tracking_code text;

-- Backfill existing rows using first 8 chars of id
UPDATE public.complaints
SET tracking_code = substring(id::text, 1, 8)
WHERE tracking_code IS NULL;

-- Set NOT NULL and default for future inserts
ALTER TABLE public.complaints
  ALTER COLUMN tracking_code SET NOT NULL,
  ALTER COLUMN tracking_code SET DEFAULT substring(gen_random_uuid()::text, 1, 8);

-- Ensure uniqueness
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'complaints_tracking_code_key'
  ) THEN
    CREATE UNIQUE INDEX complaints_tracking_code_key ON public.complaints(tracking_code);
  END IF;
END $$;

-- 2) Create a SECURITY DEFINER function to fetch limited complaint details by tracking code
CREATE OR REPLACE FUNCTION public.get_complaint_public(p_code text)
RETURNS TABLE (
  id uuid,
  tracking_code text,
  title text,
  description text,
  category complaint_category,
  priority complaint_priority,
  status complaint_status,
  location_address text,
  photos text[],
  videos text[],
  created_at timestamptz,
  updated_at timestamptz
) AS $$
  SELECT c.id, c.tracking_code, c.title, c.description, c.category, c.priority, c.status,
         c.location_address, c.photos, c.videos, c.created_at, c.updated_at
  FROM public.complaints c
  WHERE c.tracking_code = p_code
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- 3) Allow anonymous and authenticated users to execute the function
GRANT EXECUTE ON FUNCTION public.get_complaint_public(text) TO anon, authenticated;