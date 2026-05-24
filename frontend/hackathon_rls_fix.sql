-- ==========================================
-- QUICK FIX FOR HACKATHON RLS ISSUES
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Allow anyone to create, update, or delete offers (Disables strict Auth checks for demo purposes)
DROP POLICY IF EXISTS "Owners can manage their offers" ON public.offers;
CREATE POLICY "Anyone can manage offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

-- Allow anyone to create, update, or delete businesses
DROP POLICY IF EXISTS "Owners can manage their businesses" ON public.businesses;
CREATE POLICY "Anyone can manage businesses" ON public.businesses FOR ALL USING (true) WITH CHECK (true);

-- Allow anyone to create, update, or delete slots
DROP POLICY IF EXISTS "Owners can manage slots" ON public.slots;
CREATE POLICY "Anyone can manage slots" ON public.slots FOR ALL USING (true) WITH CHECK (true);
