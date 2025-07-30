-- Remove all sample food items (false data)
DELETE FROM food_items;

-- Update the handle_new_user function to create patient profiles and assign user roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer set search_path = ''
AS $$
DECLARE
  new_patient_id uuid;
BEGIN
  -- Insert into profiles table (existing functionality)
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Create patient record
  INSERT INTO public.patients (user_id)
  VALUES (NEW.id)
  RETURNING id INTO new_patient_id;
  
  -- Assign patient role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  RETURN NEW;
END;
$$;

-- Enable RLS policies for patient INSERT operations
CREATE POLICY "Authenticated users can create patient profiles" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS policies for user_roles INSERT operations  
CREATE POLICY "Authenticated users can create their own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);