import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Watch, 
  Smartphone, 
  Activity, 
  Heart, 
  Zap, 
  Wifi, 
  WifiOff, 
  Plus, 
  Settings,
  Battery,
  Bluetooth,
  Scale,
  Thermometer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Device {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smart_scale' | 'blood_pressure' | 'glucose_monitor' | 'thermometer';
  brand: string;
  model: string;
  connected: boolean;
  battery?: number;
  lastSync: Date;
  data?: any;
}

interface HealthMetric {
  id: string;
  type: string;
  value: number | string;
  unit: string;
  timestamp: Date;
  deviceId: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

const deviceIcons = {
  smartwatch: Watch,
  fitness_tracker: Activity,
  smart_scale: Scale,
  blood_pressure: Heart,
  glucose_monitor: Zap,
  thermometer: Thermometer
};

export const SmartDeviceIntegration = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [recentMetrics, setRecentMetrics] = useState<HealthMetric[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mock connected devices
    const mockDevices: Device[] = [
      {
        id: '1',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        brand: 'Apple',
        model: 'Series 9',
        connected: true,
        battery: 78,
        lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        data: {
          heartRate: 72,
          steps: 8432,
          calories: 312,
          activeMins: 45
        }
      },
      {
        id: '2',
        name: 'Withings Body+ Scale',
        type: 'smart_scale',
        brand: 'Withings',
        model: 'Body+',
        connected: true,
        battery: 92,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        data: {
          weight: 75.2,
          bodyFat: 18.5,
          muscle: 34.2,
          bmi: 23.1
        }
      },
      {
        id: '3',
        name: 'Omron Blood Pressure Monitor',
        type: 'blood_pressure',
        brand: 'Omron',
        model: 'HEM-7120',
        connected: false,
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      }
    ];

    const mockMetrics: HealthMetric[] = [
      {
        id: '1',
        type: 'Heart Rate',
        value: 72,
        unit: 'bpm',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        deviceId: '1',
        quality: 'excellent'
      },
      {
        id: '2',
        type: 'Weight',
        value: 75.2,
        unit: 'kg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deviceId: '2',
        quality: 'good'
      },
      {
        id: '3',
        type: 'Steps',
        value: 8432,
        unit: 'steps',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        deviceId: '1',
        quality: 'excellent'
      }
    ];

    setDevices(mockDevices);
    setRecentMetrics(mockMetrics);
  }, []);

  const scanForDevices = () => {
    setIsScanning(true);
    // Simulate device scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Device Scan Complete",
        description: "Found 2 new devices nearby. Check available devices to connect.",
      });
    }, 3000);
  };

  const connectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: true, lastSync: new Date() }
        : device
    ));
    toast({
      title: "Device Connected",
      description: "Successfully connected to your device and synced latest data.",
    });
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false }
        : device
    ));
    toast({
      title: "Device Disconnected",
      description: "Device has been disconnected.",
      variant: "destructive"
    });
  };

  const syncDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date() }
        : device
    ));
    toast({
      title: "Sync Complete",
      description: "Latest health data has been synchronized.",
    });
  };

  const getTimeSinceSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-muted-foreground';
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getQualityBadgeVariant = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Device Integration</h2>
          <p className="text-muted-foreground">Connect and manage your health monitoring devices</p>
        </div>
        <Button onClick={scanForDevices} disabled={isScanning}>
          {isScanning ? (
            <Bluetooth className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isScanning ? 'Scanning...' : 'Scan for Devices'}
        </Button>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">My Devices</TabsTrigger>
          <TabsTrigger value="data">Real-time Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4">
            {devices.map((device) => {
              const DeviceIcon = deviceIcons[device.type];
              return (
                <Card key={device.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-muted">
                          <DeviceIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">{device.brand} {device.model}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {device.connected ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <Wifi className="h-3 w-3" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <WifiOff className="h-3 w-3" />
                                Disconnected
                              </Badge>
                            )}
                            {device.battery && (
                              <div className="flex items-center gap-1 text-sm">
                                <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                                <span className={getBatteryColor(device.battery)}>{device.battery}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">Last Sync</p>
                          <p className="text-xs text-muted-foreground">{getTimeSinceSync(device.lastSync)}</p>
                        </div>
                        {device.connected ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => syncDevice(device.id)}>
                              Sync Now
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => disconnectDevice(device.id)}>
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => connectDevice(device.id)}>
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.filter(d => d.connected && d.data).map((device) => (
              <Card key={device.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {React.createElement(deviceIcons[device.type], { className: "h-5 w-5" })}
                    {device.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {device.type === 'smartwatch' && device.data && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heart Rate</span>
                          <span className="font-semibold">{device.data.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Steps</span>
                          <span className="font-semibold">{device.data.steps.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Calories</span>
                          <span className="font-semibold">{device.data.calories}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Minutes</span>
                          <span className="font-semibold">{device.data.activeMins}</span>
                        </div>
                      </>
                    )}
                    {device.type === 'smart_scale' && device.data && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weight</span>
                          <span className="font-semibold">{device.data.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Body Fat</span>
                          <span className="font-semibold">{device.data.bodyFat}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Muscle Mass</span>
                          <span className="font-semibold">{device.data.muscle} kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">BMI</span>
                          <span className="font-semibold">{device.data.bmi}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Latest health data from your connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMetrics.map((metric) => {
                  const device = devices.find(d => d.id === metric.deviceId);
                  return (
                    <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-muted">
                          {React.createElement(deviceIcons[device?.type || 'smartwatch'], { className: "h-4 w-4" })}
                        </div>
                        <div>
                          <p className="font-medium">{metric.type}</p>
                          <p className="text-sm text-muted-foreground">{device?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{metric.value} {metric.unit}</span>
                          <Badge variant={getQualityBadgeVariant(metric.quality)}>
                            {metric.quality}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{getTimeSinceSync(metric.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Score</CardTitle>
                <CardDescription>Overall quality of your health data collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Heart Rate Monitoring</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Activity Tracking</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Weight Monitoring</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
                <CardDescription>Connection reliability and sync status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {React.createElement(deviceIcons[device.type], { className: "h-4 w-4" })}
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {device.connected ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};