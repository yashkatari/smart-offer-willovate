-- ==========================================
-- SMART OFFER SLOT BOOKING SYSTEM - DUMMY DATA SEED
-- ==========================================

-- 1. Insert a Business (We skip owner_id since we aren't using Auth just yet)
INSERT INTO public.businesses (id, name, type, owner_name, phone_number, email, city)
VALUES 
('b0e50f34-f3ab-41c3-a3d5-7649d282f1b4', 'Glow Spa', 'Spa', 'Sarah Jenkins', '+1 234 567 8900', 'contact@glowspa.com', 'London'),
('c1f61g45-g4bc-52d4-b4e6-8750e393g2c5', 'Iron Fitness Gym', 'Gym', 'Mike Chen', '+1 987 654 3210', 'hello@ironfitness.com', 'New York');

-- 2. Insert Active Offers
INSERT INTO public.offers (id, business_id, title, description, category, original_price, offer_price, start_date, end_date, capacity, status, image_url)
VALUES 
('e812d3b4-e4f6-4556-91e8-6bc41c2c4db2', 'b0e50f34-f3ab-41c3-a3d5-7649d282f1b4', 'Premium Full Body Massage', 'Relax and unwind with our award-winning full body massage. Limited time offer.', 'Wellness', 120.00, 60.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 10, 'Active', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'),
('f923e4c5-f5g7-5667-a2f9-7cd52d3d5ec3', 'c1f61g45-g4bc-52d4-b4e6-8750e393g2c5', '1 Month Trial Membership', 'Get full access to all gym facilities and group classes for one month.', 'Fitness', 80.00, 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 20, 'Active', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop');

-- 3. Insert Slots for those offers
INSERT INTO public.slots (id, offer_id, slot_date, start_time, end_time, capacity)
VALUES 
('f2a9d8c3-41f2-4113-a4c3-1d48c9f28d21', 'e812d3b4-e4f6-4556-91e8-6bc41c2c4db2', CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00', 2),
('g3b0e9d4-52g3-5224-b5d4-2e59d0g39e32', 'e812d3b4-e4f6-4556-91e8-6bc41c2c4db2', CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:00:00', 2),
('h4c1f0e5-63h4-6335-c6e5-3f60e1h40f43', 'f923e4c5-f5g7-5667-a2f9-7cd52d3d5ec3', CURRENT_DATE + INTERVAL '2 days', '08:00:00', '22:00:00', 20);

-- 4. Insert some dummy Bookings
INSERT INTO public.bookings (slot_id, offer_id, customer_name, phone_number, email, number_of_people, status)
VALUES 
('f2a9d8c3-41f2-4113-a4c3-1d48c9f28d21', 'e812d3b4-e4f6-4556-91e8-6bc41c2c4db2', 'Emma Watson', '+44 7700 900077', 'emma@example.com', 1, 'Confirmed'),
('h4c1f0e5-63h4-6335-c6e5-3f60e1h40f43', 'f923e4c5-f5g7-5667-a2f9-7cd52d3d5ec3', 'James Bond', '+44 7700 900007', 'james@mi6.co.uk', 1, 'Pending');

-- IMPORTANT: Update the slots booked count manually for the seed
UPDATE public.slots SET booked_count = 1 WHERE id = 'f2a9d8c3-41f2-4113-a4c3-1d48c9f28d21';
UPDATE public.slots SET booked_count = 1 WHERE id = 'h4c1f0e5-63h4-6335-c6e5-3f60e1h40f43';
