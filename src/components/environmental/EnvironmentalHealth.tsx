import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye, 
  Leaf,
  MapPin,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface EnvironmentalData {
  airQuality: {
    aqi: number;
    level: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
    pm25: number;
    pm10: number;
    ozone: number;
    no2: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    uvIndex: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
  };
  pollen: {
    total: number;
    tree: number;
    grass: number;
    weed: number;
    level: 'Low' | 'Moderate' | 'High' | 'Very High';
  };
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
}

interface HealthCorrelation {
  date: string;
  aqi: number;
  symptoms: number;
  heartRate: number;
  sleepQuality: number;
}

interface HealthAlert {
  id: string;
  type: 'air_quality' | 'pollen' | 'uv' | 'temperature';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  recommendation: string;
  timestamp: Date;
}

export const EnvironmentalHealth = () => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [correlationData, setCorrelationData] = useState<HealthCorrelation[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock environmental data - in real app, this would come from APIs like OpenWeatherMap, AirVisual, etc.
    setTimeout(() => {
      const mockData: EnvironmentalData = {
        airQuality: {
          aqi: 65,
          level: 'Moderate',
          pm25: 25.4,
          pm10: 45.2,
          ozone: 0.08,
          no2: 32.1
        },
        weather: {
          temperature: 24,
          humidity: 68,
          uvIndex: 6,
          windSpeed: 12,
          pressure: 1013.2,
          visibility: 10.2
        },
        pollen: {
          total: 4.2,
          tree: 2.1,
          grass: 1.8,
          weed: 0.3,
          level: 'Moderate'
        },
        location: {
          city: 'Lagos',
          country: 'Nigeria',
          coordinates: [6.5244, 3.3792]
        }
      };

      const mockCorrelation: HealthCorrelation[] = [
        { date: '2024-01-01', aqi: 45, symptoms: 2, heartRate: 72, sleepQuality: 8 },
        { date: '2024-01-02', aqi: 62, symptoms: 3, heartRate: 75, sleepQuality: 7 },
        { date: '2024-01-03', aqi: 78, symptoms: 5, heartRate: 82, sleepQuality: 6 },
        { date: '2024-01-04', aqi: 55, symptoms: 2, heartRate: 74, sleepQuality: 8 },
        { date: '2024-01-05', aqi: 41, symptoms: 1, heartRate: 70, sleepQuality: 9 },
        { date: '2024-01-06', aqi: 88, symptoms: 6, heartRate: 85, sleepQuality: 5 },
        { date: '2024-01-07', aqi: 65, symptoms: 3, heartRate: 76, sleepQuality: 7 }
      ];

      const mockAlerts: HealthAlert[] = [
        {
          id: '1',
          type: 'air_quality',
          severity: 'medium',
          title: 'Moderate Air Quality Alert',
          message: 'Air quality is moderate in your area. Sensitive individuals should consider limiting outdoor activities.',
          recommendation: 'If you have respiratory conditions, consider wearing a mask when outdoors and keep windows closed.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'uv',
          severity: 'high',
          title: 'High UV Index Warning',
          message: 'UV index is 6 (High). Protective measures are recommended.',
          recommendation: 'Use SPF 30+ sunscreen, wear protective clothing, and seek shade during peak hours (10am-4pm).',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ];

      setEnvironmentalData(mockData);
      setCorrelationData(mockCorrelation);
      setHealthAlerts(mockAlerts);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    if (aqi <= 200) return 'text-red-600 bg-red-100';
    if (aqi <= 300) return 'text-purple-600 bg-purple-100';
    return 'text-red-800 bg-red-200';
  };

  const getUVIndexColor = (uv: number) => {
    if (uv <= 2) return 'text-green-600 bg-green-100';
    if (uv <= 5) return 'text-yellow-600 bg-yellow-100';
    if (uv <= 7) return 'text-orange-600 bg-orange-100';
    if (uv <= 10) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getPollenColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Cloud className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
            <p>Loading environmental data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!environmentalData) return null;

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Environmental Health</h2>
            <p className="text-muted-foreground">
              {environmentalData.location.city}, {environmentalData.location.country}
            </p>
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <div className="space-y-2">
          {healthAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-sm font-medium">{alert.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Conditions</TabsTrigger>
          <TabsTrigger value="correlations">Health Correlations</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {/* Air Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Air Quality Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{environmentalData.airQuality.aqi}</p>
                    <Badge className={getAQIColor(environmentalData.airQuality.aqi)}>
                      {environmentalData.airQuality.level}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Progress value={(environmentalData.airQuality.aqi / 200) * 100} className="w-32 mb-2" />
                    <p className="text-xs text-muted-foreground">AQI Scale: 0-200</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">PM2.5</p>
                    <p className="font-semibold">{environmentalData.airQuality.pm25} μg/m³</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">PM10</p>
                    <p className="font-semibold">{environmentalData.airQuality.pm10} μg/m³</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Ozone</p>
                    <p className="font-semibold">{environmentalData.airQuality.ozone} ppm</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">NO₂</p>
                    <p className="font-semibold">{environmentalData.airQuality.no2} ppb</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Weather Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Temperature</span>
                      <span className="font-semibold ml-auto">{environmentalData.weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Humidity</span>
                      <span className="font-semibold ml-auto">{environmentalData.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Visibility</span>
                      <span className="font-semibold ml-auto">{environmentalData.weather.visibility} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Wind Speed</span>
                      <span className="font-semibold ml-auto">{environmentalData.weather.windSpeed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">UV Index</span>
                      <Badge className={getUVIndexColor(environmentalData.weather.uvIndex)}>
                        {environmentalData.weather.uvIndex} - {environmentalData.weather.uvIndex <= 2 ? 'Low' : 
                         environmentalData.weather.uvIndex <= 5 ? 'Moderate' : 
                         environmentalData.weather.uvIndex <= 7 ? 'High' : 'Very High'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pollen Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Pollen Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Level</span>
                    <Badge className={getPollenColor(environmentalData.pollen.level)}>
                      {environmentalData.pollen.level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tree Pollen</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(environmentalData.pollen.tree / 5) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{environmentalData.pollen.tree}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Grass Pollen</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(environmentalData.pollen.grass / 5) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{environmentalData.pollen.grass}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weed Pollen</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(environmentalData.pollen.weed / 5) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{environmentalData.pollen.weed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Impact Correlations</CardTitle>
              <CardDescription>
                How environmental factors correlate with your health metrics over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2} name="Air Quality Index" />
                    <Line type="monotone" dataKey="symptoms" stroke="#ef4444" strokeWidth={2} name="Symptom Severity" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sleep Quality vs Air Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sleepQuality" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Sleep Quality (1-10)" />
                    <Line type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2} name="Air Quality Index" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                AI-Generated Health Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your health data and environmental conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Positive Correlation Detected</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your sleep quality improves significantly when air quality is good (AQI &lt; 50). 
                        Consider using an air purifier in your bedroom during high pollution days.
                      </p>
                      <Badge variant="outline">High Confidence (92%)</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Heart Rate Sensitivity</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your resting heart rate increases by an average of 8 BPM when AQI exceeds 80. 
                        Consider limiting outdoor exercise during moderate to unhealthy air quality days.
                      </p>
                      <Badge variant="outline">Medium Confidence (78%)</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Pollen Sensitivity Alert</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your symptom reports increase when tree pollen levels exceed 2.0. 
                        Today's levels are moderate - consider taking preventive allergy medication.
                      </p>
                      <Badge variant="outline">High Confidence (89%)</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Sun className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">UV Protection Reminder</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Current UV index is 6 (High). Based on your skin type and outdoor activity patterns, 
                        apply SPF 30+ sunscreen and reapply every 2 hours if spending time outdoors.
                      </p>
                      <Badge variant="outline">Recommendation</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};