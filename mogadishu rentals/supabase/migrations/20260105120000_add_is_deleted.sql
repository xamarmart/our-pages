-- Add soft-delete flag to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Ensure existing rows are marked not deleted
UPDATE public.listings SET is_deleted = COALESCE(is_deleted, false);
