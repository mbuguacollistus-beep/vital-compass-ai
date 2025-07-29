-- Create food recommendations tables
CREATE TABLE public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'protein', 'vegetables', 'fruits', 'grains', 'dairy', 'fats'
  nutritional_info JSONB, -- calories, protein, carbs, fat, fiber, vitamins, etc.
  allergens TEXT[], -- common allergens
  health_benefits TEXT[],
  dietary_restrictions TEXT[], -- 'diabetic_friendly', 'heart_healthy', 'low_sodium', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.food_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'daily_meal', 'condition_specific', 'allergy_safe'
  recommended_foods JSONB NOT NULL, -- array of food items with portions
  reasoning TEXT, -- AI explanation for the recommendation
  dietary_goals TEXT[], -- 'weight_management', 'diabetes_control', 'heart_health'
  meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
  date_recommended DATE NOT NULL DEFAULT CURRENT_DATE,
  is_favorite BOOLEAN DEFAULT false,
  patient_rating INTEGER CHECK (patient_rating >= 1 AND patient_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.nutrition_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  food_consumed JSONB NOT NULL, -- what they actually ate
  meal_type TEXT NOT NULL,
  date_consumed DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_consumed INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for food_items (public read access)
CREATE POLICY "Food items are viewable by authenticated users" ON public.food_items
  FOR SELECT TO authenticated USING (true);

-- RLS policies for food_recommendations
CREATE POLICY "Patients can view their food recommendations" ON public.food_recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can update their food recommendations" ON public.food_recommendations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Healthcare providers can view patient recommendations" ON public.food_recommendations
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('doctor'::user_role, 'nurse'::user_role, 'hospital_admin'::user_role)
  );

-- RLS policies for nutrition_logs
CREATE POLICY "Patients can manage their nutrition logs" ON public.nutrition_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Healthcare providers can view nutrition logs" ON public.nutrition_logs
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('doctor'::user_role, 'nurse'::user_role, 'hospital_admin'::user_role)
  );

-- Add trigger for food_recommendations updated_at
CREATE TRIGGER update_food_recommendations_updated_at
  BEFORE UPDATE ON public.food_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample food items
INSERT INTO public.food_items (name, category, nutritional_info, allergens, health_benefits, dietary_restrictions) VALUES
('Salmon', 'protein', '{"calories": 206, "protein": 22, "fat": 12, "omega3": "high", "vitamin_d": "high"}', '{"fish"}', '{"heart_healthy", "brain_health", "anti_inflammatory"}', '{"heart_healthy", "diabetic_friendly"}'),
('Spinach', 'vegetables', '{"calories": 23, "protein": 3, "fiber": 2, "iron": "high", "vitamin_k": "high"}', '{}', '{"bone_health", "eye_health", "antioxidant"}', '{"heart_healthy", "diabetic_friendly", "low_sodium"}'),
('Quinoa', 'grains', '{"calories": 222, "protein": 8, "fiber": 5, "magnesium": "high", "complete_protein": true}', '{}', '{"protein_source", "gluten_free", "fiber_rich"}', '{"diabetic_friendly", "gluten_free"}'),
('Blueberries', 'fruits', '{"calories": 84, "fiber": 4, "vitamin_c": "high", "antioxidants": "very_high"}', '{}', '{"brain_health", "antioxidant", "anti_inflammatory"}', '{"heart_healthy", "diabetic_friendly"}'),
('Greek Yogurt', 'dairy', '{"calories": 100, "protein": 17, "calcium": "high", "probiotics": true}', '{"dairy"}', '{"bone_health", "digestive_health", "protein_source"}', '{"heart_healthy"}'),
('Avocado', 'fats', '{"calories": 234, "fiber": 10, "healthy_fats": "high", "potassium": "high"}', '{}', '{"heart_healthy", "anti_inflammatory", "nutrient_absorption"}', '{"heart_healthy", "diabetic_friendly"}'),
('Sweet Potato', 'vegetables', '{"calories": 112, "fiber": 4, "vitamin_a": "very_high", "potassium": "high"}', '{}', '{"eye_health", "immune_support", "anti_inflammatory"}', '{"diabetic_friendly", "heart_healthy"}'),
('Oats', 'grains', '{"calories": 154, "protein": 5, "fiber": 4, "beta_glucan": "high"}', '{}', '{"heart_healthy", "cholesterol_lowering", "blood_sugar_control"}', '{"heart_healthy", "diabetic_friendly"}');