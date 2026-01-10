-- Demo rental seed data
-- Usage:
--   psql "$SUPABASE_DB_URL" -v host1=<host_uuid> -v host2=<host_uuid> -f supabase/seeds/demo_rentals.sql
-- Get host UUIDs from Supabase Auth > Users (copy the `id` field). Use two different hosts for variety.

-- Ensure bucket exists (safe if already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

WITH listings AS (
  INSERT INTO public.listings
    (user_id, title, description, price, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, property_type, is_visible)
  VALUES
    (:'host1'::uuid, 'Modern 2BR Apartment - Sea View', 'Bright 2 bedroom with balcony, generator backup, lift access, secure parking.', 65000, 2, 2, 1100, 'Hodan District', 'Mogadishu', NULL, NULL, 'apartment', true),
    (:'host1'::uuid, 'Furnished Studio Near City Mall', 'Fully furnished studio with kitchenette and Wi‑Fi, ideal for single professional.', 38000, 0, 1, 450, 'Wadajir', 'Mogadishu', NULL, NULL, 'room', true),
    (:'host2'::uuid, '4BR Family House with Garden', 'Standalone house with garden and parking, 4 beds / 3 baths.', 120000, 4, 3, 2600, 'Hamar Weyne', 'Mogadishu', NULL, NULL, 'house', true),
    (:'host2'::uuid, 'Ground Floor Shop Space (60sqm)', 'Prime frontage suitable for mini-mart or pharmacy; high foot traffic.', 90000, 0, 1, 650, 'Karan', 'Mogadishu', NULL, NULL, 'commercial', true),
    (:'host1'::uuid, 'Serviced Office Desk - Shared', 'Coworking desk with meeting room access, power backup and fast internet.', 15000, 0, 1, 80, 'Daynile', 'Mogadishu', NULL, NULL, 'commercial', true),
    (:'host2'::uuid, 'Half Acre Plot - Lease', 'Leasable plot suitable for storage yard or workshop; secure area.', 25000, 0, 0, 21780, 'Kaxda', 'Mogadishu', NULL, NULL, 'hotel', true)
  RETURNING id, title
)
INSERT INTO public.listing_photos (listing_id, photo_url, is_primary)
SELECT l.id, CONCAT('https://picsum.photos/seed/', replace(lower(regexp_replace(l.title, '\\s+', '', 'g')), '(', ''), '/800/600'), true
FROM listings l;
