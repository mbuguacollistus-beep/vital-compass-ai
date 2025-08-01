// Utility functions for formatting data

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatBloodPressure = (systolic?: number, diastolic?: number): string => {
  if (!systolic || !diastolic) return 'N/A';
  return `${systolic}/${diastolic} mmHg`;
};

export const formatTemperature = (temp?: number): string => {
  if (!temp) return 'N/A';
  return `${temp}°F`;
};

export const formatWeight = (weight?: number): string => {
  if (!weight) return 'N/A';
  return `${weight} lbs`;
};

export const formatHeight = (height?: number): string => {
  if (!height) return 'N/A';
  const feet = Math.floor(height / 12);
  const inches = height % 12;
  return `${feet}'${inches}"`;
};

export const formatHeartRate = (rate?: number): string => {
  if (!rate) return 'N/A';
  return `${rate} bpm`;
};

export const formatOxygenSaturation = (sat?: number): string => {
  if (!sat) return 'N/A';
  return `${sat}%`;
};

export const formatBloodSugar = (sugar?: number): string => {
  if (!sugar) return 'N/A';
  return `${sugar} mg/dL`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatUserRole = (role: string): string => {
  return role.replace('_', ' ').split(' ').map(capitalizeFirst).join(' ');
};

export const formatCalories = (calories?: number): string => {
  if (!calories) return 'N/A';
  return `${calories} cal`;
};