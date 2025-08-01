import { z } from "zod";

// Validation schemas for forms and data

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
  .optional();

export const vitalsSchema = z.object({
  systolic: z.number().min(70).max(250).optional(),
  diastolic: z.number().min(40).max(150).optional(),
  heartRate: z.number().min(30).max(220).optional(),
  temperature: z.number().min(95).max(110).optional(),
  weight: z.number().min(20).max(1000).optional(),
  height: z.number().min(36).max(96).optional(),
  bloodSugar: z.number().min(20).max(600).optional(),
  oxygenSaturation: z.number().min(70).max(100).optional()
});

export const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  timeOfDay: z.array(z.string()).min(1, "At least one time is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  instructions: z.string().optional(),
  prescribedBy: z.string().optional()
});

export const nutritionLogSchema = z.object({
  foodConsumed: z.array(z.object({
    name: z.string().min(1, "Food name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    calories: z.number().min(0).optional()
  })).min(1, "At least one food item is required"),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  caloriesConsumed: z.number().min(0).optional(),
  notes: z.string().optional()
});

export const wellbeingSchema = z.object({
  score: z.number().min(1).max(5),
  symptoms: z.string().optional(),
  notes: z.string().optional()
});

export const profileSchema = z.object({
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional()
});