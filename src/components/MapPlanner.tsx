import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus, Layers, CircleHelp } from "lucide-react";
import LocationAccessPopup from "@/components/LocationAccessPopup";

const apiUrl = "https://api-container-706781556411.us-central1.run.app";
//const apiUrl = "http://10.12.10.181:8080";

// This is a simplified implementation since we don't have actual map libraries
const MapPlanner: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [extraCrops, setExtraCrops] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    soil: false,
    weather: false,
    boundaries: true,
  });

  const [crop, setCrop] = useState(null);

  const handleLocationGranted = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleRequestLocation = () => {
    setShowLocationPopup(true);
  };

  useEffect(() => {
    // Check if we already have location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error or permission denied:", error);
          // Show popup to request location
          setShowLocationPopup(true);
        }
      );
    }
  }, []);

  // Mock loading a map
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  async function callOpenAI(userMessage) {
    try {
      const response = await fetch(`${apiUrl}/get-relevant-crops`, {
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
        setExtraCrops(botReply);
      } else {
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetch(`${apiUrl}/predict-crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: latitude,
          long: longitude,
        }),
      })
        .then((e) => e.json())
        .then((e) => {
          setCrop(e.predicted_crop);
          callOpenAI(e.predicted_crop);
        });
    }
  }, [latitude, longitude]);

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 text-primary" size={20} />
              Farm Planner
            </CardTitle>
            <CardDescription>
              Interactive GIS-based planning tool
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white text-primary hover:bg-primary hover:text-white"
            onClick={() => alert("Help features would go here")}
          >
            <CircleHelp size={16} className="mr-1" /> Help
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] relative bg-gray-200"
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading map data...
                </p>
              </div>
            </div>
          ) : (
            // Map placeholder with fake fields
            <div style={{ width: "100%", height: "100%" }}>
              {latitude !== null && longitude !== null ? (
                <iframe
                  width="100%"
                  height="100%"
                  scrolling="no"
                  src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${latitude},${longitude}+(My%20Business%20Name)&t=k&z=14&ie=UTF8&iwloc=B&output=embed`}
                ></iframe>
              ) : null}
            </div>
          )}

          {/* Layers panel */}
          {layersOpen && (
            <div className="absolute top-2 right-12 bg-white shadow-md rounded-md p-2 border border-gray-200 w-40">
              <h4 className="text-xs font-medium mb-2">Map Layers</h4>
              <div className="space-y-1">
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={activeLayers.satellite}
                    onChange={() => toggleLayer("satellite")}
                    className="mr-2"
                  />
                  Satellite Imagery
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={activeLayers.soil}
                    onChange={() => toggleLayer("soil")}
                    className="mr-2"
                  />
                  Soil Health
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={activeLayers.weather}
                    onChange={() => toggleLayer("weather")}
                    className="mr-2"
                  />
                  Weather Patterns
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={activeLayers.boundaries}
                    onChange={() => toggleLayer("boundaries")}
                    className="mr-2"
                  />
                  Field Boundaries
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center items-center bg-gray-50 p-3">
        <div className="text-center text-gray-600">
          <h1 className="text-xl mt-2">AI Based Analysis</h1>
          {crop !== null ? (
            <>
              <h3 className="text-2xl mt-2">
                Recommended Crop:{" "}
                <span className="font-semibold">
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </span>
              </h3>
              {extraCrops !== null ? (
                <h3 className="text-md mt-2">
                  More Recommendations:&nbsp;{extraCrops}
                </h3>
              ) : null}
            </>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapPlanner;
