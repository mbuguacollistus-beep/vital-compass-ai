import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatientData {
  medical_conditions: string[];
  allergies: string[];
  current_medications: string[];
  age?: number;
  gender?: string;
  recent_wellbeing?: number;
}

interface FoodItem {
  name: string;
  category: string;
  nutritional_info: any;
  allergens: string[];
  health_benefits: string[];
  dietary_restrictions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { 
      patient_id, 
      meal_type = 'lunch', 
      dietary_goals = [],
      recommendation_type = 'daily_meal' 
    } = await req.json();

    console.log('Generating food recommendations for patient:', patient_id);

    // Get patient data
    const { data: patient, error: patientError } = await supabaseClient
      .from('patients')
      .select('medical_conditions, allergies, current_medications')
      .eq('id', patient_id)
      .single();

    if (patientError) {
      console.error('Error fetching patient:', patientError);
      throw new Error('Patient not found');
    }

    // Get patient profile for additional info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('date_of_birth, gender')
      .eq('user_id', (await supabaseClient.auth.getUser()).data.user?.id)
      .single();

    // Get recent wellbeing data
    const { data: recentWellbeing } = await supabaseClient
      .from('wellbeing_entries')
      .select('score, symptoms')
      .eq('patient_id', patient_id)
      .order('date_recorded', { ascending: false })
      .limit(5);

    // Get available food items
    const { data: foodItems, error: foodError } = await supabaseClient
      .from('food_items')
      .select('*');

    if (foodError) {
      console.error('Error fetching food items:', foodError);
      throw new Error('Failed to fetch food database');
    }

    const patientAge = profile?.date_of_birth 
      ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      : null;

    const avgWellbeing = recentWellbeing?.length 
      ? recentWellbeing.reduce((sum, entry) => sum + entry.score, 0) / recentWellbeing.length
      : null;

    const recentSymptoms = recentWellbeing
      ?.filter(entry => entry.symptoms)
      .map(entry => entry.symptoms)
      .join(', ') || '';

    // Create AI prompt for food recommendations
    const prompt = `As a nutritionist AI, analyze this patient's health data and recommend foods for ${meal_type}.

Patient Health Profile:
- Medical Conditions: ${patient.medical_conditions?.join(', ') || 'None'}
- Allergies: ${patient.allergies?.join(', ') || 'None'}
- Current Medications: ${patient.current_medications?.join(', ') || 'None'}
- Age: ${patientAge || 'Unknown'}
- Gender: ${profile?.gender || 'Unknown'}
- Recent Well-being Average: ${avgWellbeing ? `${avgWellbeing.toFixed(1)}/10` : 'No data'}
- Recent Symptoms: ${recentSymptoms || 'None reported'}
- Dietary Goals: ${dietary_goals.join(', ') || 'General health'}

Available Foods Database:
${foodItems.map(food => `${food.name} (${food.category}): ${JSON.stringify(food.nutritional_info)}, Benefits: ${food.health_benefits?.join(', ')}, Allergens: ${food.allergens?.join(', ')}`).join('\n')}

Please recommend 3-5 specific foods from the available database for this ${meal_type}. Consider:
1. Patient's medical conditions and how foods can help
2. Avoid any allergens
3. Consider medication interactions
4. Match dietary goals
5. Address any recent symptoms

Return a JSON response with:
{
  "recommended_foods": [
    {
      "food_name": "exact name from database",
      "portion_size": "recommended serving",
      "benefits": "why this food helps this patient"
    }
  ],
  "reasoning": "detailed explanation of why these foods were chosen for this patient",
  "dietary_tips": "additional advice specific to patient's conditions"
}`;

    console.log('Sending request to OpenAI for food recommendations');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a certified nutritionist AI specializing in personalized dietary recommendations based on medical conditions, allergies, and health goals. Always provide safe, evidence-based advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text());
      throw new Error('Failed to generate recommendations');
    }

    const aiResult = await openAIResponse.json();
    const recommendation = JSON.parse(aiResult.choices[0].message.content);

    console.log('AI recommendation generated:', recommendation);

    // Save recommendation to database
    const { data: savedRecommendation, error: saveError } = await supabaseClient
      .from('food_recommendations')
      .insert({
        patient_id,
        recommendation_type,
        recommended_foods: recommendation.recommended_foods,
        reasoning: recommendation.reasoning,
        dietary_goals,
        meal_type,
        date_recommended: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving recommendation:', saveError);
      throw new Error('Failed to save recommendation');
    }

    console.log('Recommendation saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        recommendation: {
          ...savedRecommendation,
          dietary_tips: recommendation.dietary_tips
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in food-recommendations function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});