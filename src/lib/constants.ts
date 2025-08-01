// Application constants

export const APP_NAME = "Nix AI Healthcare";
export const APP_DESCRIPTION = "Intelligent Health Management";

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor', 
  NURSE: 'nurse',
  HOSPITAL_ADMIN: 'hospital_admin',
  CAREGIVER: 'caregiver'
} as const;

export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch', 
  DINNER: 'dinner',
  SNACK: 'snack'
} as const;

export const HEALTH_GOALS = {
  WEIGHT_LOSS: 'weight_loss',
  WEIGHT_GAIN: 'weight_gain',
  MAINTAIN_WEIGHT: 'maintain_weight',
  BUILD_MUSCLE: 'build_muscle',
  IMPROVE_CARDIOVASCULAR: 'improve_cardiovascular',
  MANAGE_DIABETES: 'manage_diabetes',
  LOWER_CHOLESTEROL: 'lower_cholesterol',
  IMPROVE_MENTAL_HEALTH: 'improve_mental_health'
} as const;

export const VISIT_TYPES = {
  ROUTINE_CHECKUP: 'routine_checkup',
  SPECIALIST_CONSULTATION: 'specialist_consultation',
  EMERGENCY: 'emergency',
  FOLLOW_UP: 'follow_up',
  DIAGNOSTIC: 'diagnostic',
  THERAPY: 'therapy'
} as const;

export const WELLBEING_SCORES = {
  EXCELLENT: 5,
  VERY_GOOD: 4,
  GOOD: 3,
  FAIR: 2,
  POOR: 1
} as const;