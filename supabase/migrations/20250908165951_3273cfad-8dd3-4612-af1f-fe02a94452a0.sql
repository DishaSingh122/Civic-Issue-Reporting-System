-- Create enum for complaint status
CREATE TYPE public.complaint_status AS ENUM ('received', 'in_progress', 'resolved');

-- Create enum for complaint priority
CREATE TYPE public.complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create enum for complaint category
CREATE TYPE public.complaint_category AS ENUM ('infrastructure', 'sanitation', 'utilities', 'transportation', 'safety', 'environment', 'other');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  priority complaint_priority DEFAULT 'medium',
  status complaint_status DEFAULT 'received',
  location_address TEXT,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  photos TEXT[], -- Array of photo URLs
  videos TEXT[], -- Array of video URLs
  assigned_staff_id UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Staff can view all profiles
CREATE POLICY "Staff can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  )
);

-- Complaints policies for citizens
CREATE POLICY "Citizens can view their own complaints" 
ON public.complaints FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Citizens can create complaints" 
ON public.complaints FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Citizens can update their own complaints" 
ON public.complaints FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND status = 'received'
);

-- Complaints policies for staff
CREATE POLICY "Staff can view all complaints" 
ON public.complaints FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can update complaints" 
ON public.complaints FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaint-media', 'complaint-media', true);

-- Storage policies for complaint media
CREATE POLICY "Authenticated users can upload complaint media" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'complaint-media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view complaint media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'complaint-media');

CREATE POLICY "Users can update their own uploads" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'complaint-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'complaint-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance
CREATE INDEX idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_category ON public.complaints(category);
CREATE INDEX idx_complaints_created_at ON public.complaints(created_at);
CREATE INDEX idx_profiles_role ON public.profiles(role);