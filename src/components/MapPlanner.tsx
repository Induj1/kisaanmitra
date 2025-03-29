
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus, Layers, CircleHelp } from 'lucide-react';

// This is a simplified implementation since we don't have actual map libraries
const MapPlanner: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    soil: false,
    weather: false,
    boundaries: true
  });

  // Mock loading a map
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 text-primary" size={20} />
              Farm Planner
            </CardTitle>
            <CardDescription>Interactive GIS-based planning tool</CardDescription>
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
                <p className="mt-4 text-sm text-gray-600">Loading map data...</p>
              </div>
            </div>
          ) : (
            // Map placeholder with fake fields
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src="https://developers.google.com/static/maps/documentation/javascript/images/sample-satellite-imagery" 
                alt="Sample Satellite Map" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/600x300?text=Satellite+Map";
                }}
              />
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 border-2 border-green-500 bg-green-500/20 rounded-md"></div>
                <div className="absolute top-1/2 right-1/4 w-1/5 h-1/5 border-2 border-yellow-500 bg-yellow-500/20 rounded-md"></div>
              </div>
            </div>
          )}

          {/* Map controls */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <Button size="icon" variant="secondary" className="bg-white shadow-md hover:bg-gray-100">
              <Plus size={16} />
            </Button>
            <Button size="icon" variant="secondary" className="bg-white shadow-md hover:bg-gray-100">
              <Minus size={16} />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className={`bg-white shadow-md hover:bg-gray-100 ${layersOpen ? 'bg-gray-200' : ''}`}
              onClick={() => setLayersOpen(!layersOpen)}
            >
              <Layers size={16} />
            </Button>
          </div>

          {/* Layers panel */}
          {layersOpen && (
            <div className="absolute top-2 right-12 bg-white shadow-md rounded-md p-2 border border-gray-200 w-40">
              <h4 className="text-xs font-medium mb-2">Map Layers</h4>
              <div className="space-y-1">
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.satellite} 
                    onChange={() => toggleLayer('satellite')}
                    className="mr-2"
                  />
                  Satellite Imagery
                </label>
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.soil} 
                    onChange={() => toggleLayer('soil')}
                    className="mr-2"
                  />
                  Soil Health
                </label>
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.weather} 
                    onChange={() => toggleLayer('weather')}
                    className="mr-2"
                  />
                  Weather Patterns
                </label>
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.boundaries} 
                    onChange={() => toggleLayer('boundaries')}
                    className="mr-2"
                  />
                  Field Boundaries
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-gray-50 p-3">
        <div className="text-xs text-gray-600">
          <p>Selected Area: <span className="font-semibold">2.5 hectares</span></p>
          <p>Recommended Crop: <span className="font-semibold">Wheat, Barley</span></p>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary-dark font-noto">
          योजना बनाएं
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapPlanner;
