-- Create disease surveillance table for tracking outbreaks
CREATE TABLE public.disease_surveillance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  reported_symptoms TEXT[] NOT NULL,
  severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5) NOT NULL,
  location_data JSONB,
  disease_suspected TEXT,
  confirmed_diagnosis TEXT,
  outbreak_alert_level INTEGER DEFAULT 0,
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'investigated', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disease_surveillance ENABLE ROW LEVEL SECURITY;

-- Temporary policy using email domain check for Nix owners
CREATE POLICY "Nix owners can view all surveillance data"
ON public.disease_surveillance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email LIKE '%@nixhealth.com'
  )
);

-- Nix owners can manage surveillance data
CREATE POLICY "Nix owners can manage surveillance data"
ON public.disease_surveillance
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email LIKE '%@nixhealth.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email LIKE '%@nixhealth.com'
  )
);

-- Healthcare providers can insert surveillance data from patient symptoms
CREATE POLICY "Healthcare providers can report surveillance data"
ON public.disease_surveillance
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['doctor'::user_role, 'nurse'::user_role, 'hospital_admin'::user_role]));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_disease_surveillance_updated_at
BEFORE UPDATE ON public.disease_surveillance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create data export log table for tracking government/NGO data sharing
CREATE TABLE public.data_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exported_by UUID NOT NULL REFERENCES auth.users(id),
  export_type TEXT NOT NULL CHECK (export_type IN ('government', 'ngo', 'research')),
  recipient_organization TEXT NOT NULL,
  data_period_start DATE NOT NULL,
  data_period_end DATE NOT NULL,
  records_count INTEGER NOT NULL,
  export_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on export logs
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

-- Only Nix owners can manage export logs
CREATE POLICY "Nix owners can manage export logs"
ON public.data_exports
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email LIKE '%@nixhealth.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email LIKE '%@nixhealth.com'
  )
);