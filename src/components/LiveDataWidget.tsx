import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Droplets, Thermometer, ArrowDown, ArrowUp, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface MandiData {
  mandiName: string;
  crops: Array<{
    name: string;
    price: number;
    trend: "up" | "down";
    change: number;
  }>;
}

const defaultWeatherData: WeatherData = {
  location: "Location unavailable",
  temperature: 28,
  humidity: 45,
  rainfall: 0,
  forecast: [
    { day: "Today", temp: 28, condition: "Sunny" },
    { day: "Tomorrow", temp: 29, condition: "Partly Cloudy" },
    { day: "Wed", temp: 27, condition: "Cloudy" }
  ]
};

const defaultMandiData: MandiData = {
  mandiName: "Nearest Mandi",
  crops: [
    { name: "Wheat", price: 2150, trend: "up", change: 50 },
    { name: "Rice", price: 3200, trend: "down", change: 30 },
    { name: "Potato", price: 1200, trend: "up", change: 120 },
    { name: "Onion", price: 1800, trend: "down", change: 200 }
  ]
};

interface LiveDataWidgetProps {
  widgetType: 'weather' | 'mandi' | 'market';
  language?: 'english' | 'hindi' | 'kannada';
  data?: {
    states?: string[];
    crops?: string[];
  };
  latitude?: number | null;
  longitude?: number | null;
  onRequestLocation?: () => void;
}

const LiveDataWidget: React.FC<LiveDataWidgetProps> = ({ 
  widgetType = 'weather',
  language = 'english',
  data,
  latitude,
  longitude,
  onRequestLocation
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData);
  const [mandiData, setMandiData] = useState<MandiData>(defaultMandiData);
  
  useEffect(() => {
    setIsLoading(true);
    
    const fetchTimer = setTimeout(() => {
      let storedLat = localStorage.getItem('userLatitude');
      let storedLng = localStorage.getItem('userLongitude');
      
      if ((latitude && longitude) || (storedLat && storedLng)) {
        const lat = latitude || parseFloat(storedLat || '0');
        const lng = longitude || parseFloat(storedLng || '0');
        
        console.log("Fetching with coords:", lat, lng);
        
        if (latitude && longitude) {
          localStorage.setItem('userLatitude', latitude.toString());
          localStorage.setItem('userLongitude', longitude.toString());
        }
        
        fetchWeatherByLocation(lat, lng);
        fetchNearbyMandi(lat, lng);
      } else {
        console.log("No location available, using defaults");
        setWeatherData(defaultWeatherData);
        setMandiData(defaultMandiData);
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(fetchTimer);
  }, [latitude, longitude]);
  
  const fetchWeatherByLocation = async (lat: number, lng: number) => {
    try {
      const locationName = await simulateReverseGeocode(lat, lng);
      
      const temperature = Math.round(15 + Math.random() * 25);
      const humidity = Math.round(30 + Math.random() * 60);
      const rainfall = Math.random() > 0.7 ? Math.round(Math.random() * 50) : 0;
      
      const forecast = [
        { 
          day: "Today", 
          temp: temperature, 
          condition: rainfall > 0 ? "Rainy" : (Math.random() > 0.5 ? "Sunny" : "Cloudy") 
        },
        { 
          day: "Tomorrow", 
          temp: temperature + Math.round(Math.random() * 4 - 2),
          condition: Math.random() > 0.5 ? "Sunny" : "Cloudy"
        },
        { 
          day: "Wed", 
          temp: temperature + Math.round(Math.random() * 6 - 3),
          condition: Math.random() > 0.7 ? "Cloudy" : "Sunny"
        }
      ];
      
      setWeatherData({
        location: locationName,
        temperature,
        humidity,
        rainfall,
        forecast
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(defaultWeatherData);
      setIsLoading(false);
    }
  };
  
  const fetchNearbyMandi = async (lat: number, lng: number) => {
    try {
      const locationName = await simulateReverseGeocode(lat, lng);
      const mandiName = `${locationName.split(',')[0]} Mandi`;
      
      const crops = [
        { 
          name: "Wheat", 
          price: 2000 + Math.round(Math.random() * 400), 
          trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down", 
          change: Math.round(Math.random() * 150)
        },
        { 
          name: "Rice", 
          price: 3000 + Math.round(Math.random() * 500), 
          trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down", 
          change: Math.round(Math.random() * 100)
        },
        { 
          name: "Potato", 
          price: 1000 + Math.round(Math.random() * 500), 
          trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down", 
          change: Math.round(Math.random() * 200)
        },
        { 
          name: "Onion", 
          price: 1500 + Math.round(Math.random() * 800), 
          trend: Math.random() > 0.5 ? "up" : "down" as "up" | "down", 
          change: Math.round(Math.random() * 300)
        }
      ];
      
      setMandiData({
        mandiName,
        crops
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching mandi data:", error);
      setMandiData(defaultMandiData);
      setIsLoading(false);
    }
  };
  
  const simulateReverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const locations = [
      "Mumbai, Maharashtra",
      "Delhi, NCR",
      "Bangalore, Karnataka",
      "Chennai, Tamil Nadu",
      "Kolkata, West Bengal",
      "Hyderabad, Telangana",
      "Pune, Maharashtra",
      "Ahmedabad, Gujarat",
      "Jaipur, Rajasthan",
      "Lucknow, Uttar Pradesh"
    ];
    
    const locationIndex = Math.abs(Math.floor((lat * 10) % locations.length));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `Your Location (${locations[locationIndex]})`;
  };

  const renderLocationPrompt = () => (
    <div className="flex flex-col items-center justify-center py-6">
      <MapPin className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        {language === 'english' 
          ? 'Location access is needed to show accurate weather and market data.' 
          : language === 'hindi' 
            ? 'सटीक मौसम और बाजार डेटा दिखाने के लिए स्थान तक पहुंच की आवश्यकता है।' 
            : 'ನಿಖರವಾದ ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಡೇಟಾವನ್ನು ತೋರಿಸಲು ಸ್ಥಳ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ.'}
      </p>
      <Button onClick={onRequestLocation} className="gap-2">
        <MapPin size={16} />
        {language === 'english' 
          ? 'Share Location' 
          : language === 'hindi' 
            ? 'स्थान साझा करें' 
            : 'ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'}
      </Button>
    </div>
  );

  const renderWeatherWidget = () => (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Weather Updates</span>
          <Sun className="text-yellow-500" size={20} />
        </CardTitle>
        <CardDescription>
          {weatherData.location} • Updated <span className="font-semibold">10 min</span> ago
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : !latitude || !longitude ? (
          renderLocationPrompt()
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-gray-500 text-xs">Temperature</p>
                <div className="flex items-center justify-center">
                  <Thermometer size={16} className="text-red-500 mr-1" />
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Humidity</p>
                <div className="flex items-center justify-center">
                  <Droplets size={16} className="text-blue-500 mr-1" />
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Rainfall</p>
                <div className="flex items-center justify-center">
                  <Cloud size={16} className="text-blue-400 mr-1" />
                  <p className="text-2xl font-bold">{weatherData.rainfall} mm</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">3-Day Forecast</h4>
              <div className="flex justify-between text-center">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className={`${index < weatherData.forecast.length - 1 ? 'border-r pr-2' : ''}`}>
                    <p className="text-xs text-gray-500">{day.day}</p>
                    <p className="text-sm font-semibold">{day.temp}°C</p>
                    <p className="text-xs">{day.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 text-xs text-gray-500 justify-center">
        <span className="font-noto">Source: भारत मौसम विज्ञान विभाग (IMD)</span>
      </CardFooter>
    </Card>
  );

  const renderMandiWidget = () => (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Mandi Prices</span>
          <span className="text-sm font-normal text-primary-dark">₹</span>
        </CardTitle>
        <CardDescription>
          {mandiData.mandiName} • Updated <span className="font-semibold">2 hours</span> ago
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ) : !latitude || !longitude ? (
          renderLocationPrompt()
        ) : (
          <div className="space-y-3">
            {mandiData.crops.map((crop, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b last:border-b-0">
                <span className="font-medium">{crop.name}</span>
                <div className="flex items-center">
                  <span className="font-bold mr-2">₹{crop.price}/q</span>
                  <div className={`flex items-center ${crop.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {crop.trend === 'up' ? (
                      <ArrowUp size={14} className="mr-1" />
                    ) : (
                      <ArrowDown size={14} className="mr-1" />
                    )}
                    <span className="text-xs">₹{crop.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 text-xs text-gray-500 justify-center">
        <span className="font-noto">Source: कृषि बाजार मूल्य निगरानी (Agrimarket)</span>
      </CardFooter>
    </Card>
  );

  return widgetType === 'weather' ? renderWeatherWidget() : renderMandiWidget();
};

export default LiveDataWidget;
