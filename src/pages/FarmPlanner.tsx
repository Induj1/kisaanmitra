import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  CloudRain,
  Sprout,
  PlaneTakeoff,
  Calculator,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveDataWidget from "@/components/LiveDataWidget";
import MapPlanner from "@/components/MapPlanner";
import { supabase } from "@/integrations/supabase/client";

const apiUrl = "https://api-container-706781556411.us-central1.run.app";
//const apiUrl = "http://10.12.10.181:8080";

const FarmPlanner = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationAccess, setLocationAccess] = useState<boolean>(false);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [irrigationBudget, setIrrigationBudget] = useState<string>("");
  const [fertilizerBudget, setFertilizerBudget] = useState<string>("");
  const [pesticideBudget, setPesticideBudget] = useState<string>("");
  const [budgetStep, setBudgetStep] = useState<boolean>(false);
  const [planReady, setPlanReady] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [cropOptions, setCropOptions] = useState([
    { value: "wheat", label: "गेहूं (Wheat)" },
    { value: "rice", label: "चावल (Rice)" },
    { value: "maize", label: "मक्का (Maize)" },
    { value: "cotton", label: "कपास (Cotton)" },
    { value: "sugarcane", label: "गन्ना (Sugarcane)" },
  ]);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const [land, setLand] = useState(0);
  const [aiRec, setAiRec] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Check if location access is already granted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationAccess(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationAccess(false);
        }
      );
    }
  }, []);

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationAccess(true);
          setIsLoading(false);

          toast({
            title: "स्थान प्राप्त किया गया",
            description:
              "आपके स्थान के आधार पर मौसम और मंडी जानकारी अपडेट की गई है",
          });
        },
        (error) => {
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "स्थान प्राप्त करने में विफल",
            description:
              "कृपया स्थान की अनुमति प्रदान करें और पुनः प्रयास करें",
          });
        }
      );
    }
  };

  async function callOpenAI(userMessage) {
    try {
      const response = await fetch(`${apiUrl}/get-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: "english",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botReply = data.choices[0].message.content;
        setAiRec(botReply);
      } else {
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  const generateRecommendation = () => {
    if (!selectedCrop) {
      toast({
        variant: "destructive",
        title: "फसल चुनें",
        description: "कृपया अपनी फसल का चयन करें",
      });
      return;
    }

    callOpenAI(`Crop: ${selectedCrop}, Land Size in Acres: ${land}`);
    setBudgetStep(true);
  };

  const generatePlan = () => {
    setIsLoading(true);

    // Mock AI recommendation based on inputs
    setTimeout(() => {
      const irrigationBudgetNum = parseInt(irrigationBudget) || 0;
      const fertilizerBudgetNum = parseInt(fertilizerBudget) || 0;
      const pesticideBudgetNum = parseInt(pesticideBudget) || 0;

      // Simple recommendation logic (in a real app, this would come from an AI model)
      const recommendation = {
        crop: selectedCrop,
        irrigation: {
          type:
            irrigationBudgetNum > 5000
              ? "ड्रिप सिंचाई (Drip Irrigation)"
              : "स्प्रिंकलर सिंचाई (Sprinkler System)",
          estimatedCost: irrigationBudgetNum * 0.8,
          waterSavings: irrigationBudgetNum > 5000 ? "60%" : "40%",
        },
        fertilizer: {
          recommendation:
            fertilizerBudgetNum > 3000
              ? "जैविक खाद और NPK मिश्रण (Organic manure with NPK mix)"
              : "यूरिया और डीएपी (Urea and DAP mix)",
          estimatedCost: fertilizerBudgetNum * 0.9,
          coverage: `${Math.floor(fertilizerBudgetNum / 500)} एकड़`,
        },
        pesticides: {
          recommendation:
            pesticideBudgetNum > 2000
              ? "जैविक कीटनाशक (Organic pesticides)"
              : "रासायनिक कीटनाशक (Chemical pesticides)",
          estimatedCost: pesticideBudgetNum * 0.75,
          applicationFrequency: "हर 15-20 दिनों में (Every 15-20 days)",
        },
        totalCost:
          irrigationBudgetNum * 0.8 +
          fertilizerBudgetNum * 0.9 +
          pesticideBudgetNum * 0.75,
        expectedYield: `${
          Math.floor(Math.random() * 5) + 10
        } क्विंटल प्रति एकड़`,
        roi: `${Math.floor(Math.random() * 30) + 60}%`,
      };

      setAiRecommendation(recommendation);
      setPlanReady(true);
      setIsLoading(false);
    }, 2000);
  };

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle("high-contrast");
  };

  console.log(aiRec);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isHighContrast ? "high-contrast" : ""
      }`}
    >
      <Header toggleContrast={toggleContrast} isHighContrast={isHighContrast} />

      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column - Farm Planner */}
            <div className="md:col-span-8 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/10 pb-2">
                  <CardTitle className="flex items-center">
                    <Sprout className="mr-2 text-primary" size={24} />
                    फार्म प्लानर (Farm Planner)
                  </CardTitle>
                  <CardDescription>
                    अपनी फसल और बजट के आधार पर अनुशंसाएँ प्राप्त करें (Get
                    recommendations based on your crop and budget)
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  {!locationAccess ? (
                    <div className="text-center py-6">
                      <MapPin className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-3">
                        स्थान की अनुमति प्रदान करें
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        बेहतर फसल अनुशंसाओं के लिए हमें आपके स्थान तक पहुंच की
                        आवश्यकता है
                        <br />
                        (We need access to your location for better crop
                        recommendations)
                      </p>
                      <Button
                        onClick={requestLocationAccess}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            प्रतीक्षा करें...
                          </>
                        ) : (
                          <>स्थान साझा करें (Share Location)</>
                        )}
                      </Button>
                    </div>
                  ) : !budgetStep ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          1. Select Crop
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          अपने क्षेत्र के लिए उपयुक्त फसल का चयन करें
                        </p>
                        <Select
                          value={selectedCrop}
                          onValueChange={setSelectedCrop}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropOptions.map((crop) => (
                              <SelectItem key={crop.value} value={crop.value}>
                                {crop.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          2. Enter Land Size
                        </h3>
                        <Input
                          type="number"
                          placeholder="Land Size in acres"
                          value={land}
                          onChange={(e) => setLand(parseInt(e.target.value))}
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          className="w-full"
                          onClick={generateRecommendation}
                          disabled={
                            !selectedCrop ||
                            isLoading ||
                            isNaN(land) ||
                            land <= 0
                          }
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              प्रतीक्षा करें...
                            </>
                          ) : (
                            <>
                              अगला कदम (Next Step){" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p style={{ whiteSpace: "pre-wrap" }}>{aiRec}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map Planner */}
              <MapPlanner />
            </div>

            {/* Right Column - Weather and Market Data */}
            <div className="md:col-span-4 space-y-4">
              <LiveDataWidget widgetType="weather" />
              <LiveDataWidget widgetType="mandi" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmPlanner;
