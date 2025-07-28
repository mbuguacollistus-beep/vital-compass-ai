-- Fix security issues: Add missing RLS policies and fix function search paths

-- Add missing policies for healthcare_providers
CREATE POLICY "Healthcare providers can view own data" ON public.healthcare_providers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Healthcare providers can update own data" ON public.healthcare_providers
  FOR UPDATE USING (auth.uid() = user_id);

-- Add policies for care_network
CREATE POLICY "Patients can view their care network" ON public.care_network
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage their care network" ON public.care_network
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can view granted access" ON public.care_network
  FOR SELECT USING (auth.uid() = caregiver_id);

-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;