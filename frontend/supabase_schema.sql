-- ==========================================
-- SMART OFFER SLOT BOOKING SYSTEM - SCHEMA
-- Engine: PostgreSQL (Supabase)
-- ==========================================

-- 0. Clean Up Existing Objects (Allows you to run this script safely multiple times)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.slots CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;

DROP TYPE IF EXISTS business_type CASCADE;
DROP TYPE IF EXISTS offer_status CASCADE;
DROP TYPE IF EXISTS slot_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;

-- 1. Enums
CREATE TYPE business_type AS ENUM ('Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Gaming', 'Sports', 'Activity', 'Spa', 'Fitness', 'Events', 'Other');
CREATE TYPE offer_status AS ENUM ('Draft', 'Active', 'Paused', 'Expired', 'Cancelled');
CREATE TYPE slot_status AS ENUM ('Available', 'Full', 'Closed', 'Expired', 'Cancelled');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'Completed', 'No Show');

-- 2. Businesses Table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase Auth
    name VARCHAR(255) NOT NULL,
    type business_type NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    logo_url TEXT,
    opening_time TIME,
    closing_time TIME
);

-- 3. Offers Table
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    original_price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN original_price > 0 THEN ((original_price - offer_price) / original_price) * 100 
            ELSE 0 
        END
    ) STORED,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    capacity INTEGER NOT NULL DEFAULT 1,
    max_booking_per_customer INTEGER DEFAULT 1,
    terms_conditions TEXT,
    status offer_status DEFAULT 'Draft',
    image_url TEXT
);

-- 4. Offer Slots Table
CREATE TABLE public.slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER NOT NULL,
    booked_count INTEGER DEFAULT 0,
    available_count INTEGER GENERATED ALWAYS AS (capacity - booked_count) STORED,
    status slot_status DEFAULT 'Available'
);

-- 5. Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reference_number VARCHAR(20) UNIQUE NOT NULL DEFAULT ('B-' || upper(substr(md5(random()::text), 1, 8))),
    slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE RESTRICT,
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE RESTRICT,
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    number_of_people INTEGER NOT NULL DEFAULT 1,
    special_note TEXT,
    status booking_status DEFAULT 'Pending'
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Businesses: Public can read, only owners can update/delete
CREATE POLICY "Public can view businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Owners can manage their businesses" ON public.businesses FOR ALL USING (auth.uid() = owner_id);

-- Offers: Public can read Active offers, Owners can manage all their offers
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (status = 'Active');
CREATE POLICY "Owners can manage their offers" ON public.offers FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);

-- Slots: Public can view active slots, Owners can manage
CREATE POLICY "Public can view available slots" ON public.slots FOR SELECT USING (status IN ('Available', 'Full'));
CREATE POLICY "Owners can manage slots" ON public.slots FOR ALL USING (
    offer_id IN (SELECT id FROM public.offers WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
);

-- Bookings: Owners can see bookings for their slots, Customers can insert
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their bookings" ON public.bookings FOR SELECT USING (
    offer_id IN (SELECT id FROM public.offers WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
);
