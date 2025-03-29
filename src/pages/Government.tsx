
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GovernmentScheme from '@/components/GovernmentScheme';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Government = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const schemes = [
    {
      title: "PM-KISAN",
      description: "प्रधानमंत्री किसान सम्मान निधि योजना",
      englishDescription: "Prime Minister's Farmer's Respect Fund Scheme",
      benefits: "₹6,000 per year direct income support",
      eligibility: "All small and marginal farmers",
      logo: "/placeholder.svg",
      link: "https://pmkisan.gov.in/"
    },
    {
      title: "PMFBY",
      description: "प्रधानमंत्री फसल बीमा योजना",
      englishDescription: "Prime Minister's Crop Insurance Scheme",
      benefits: "Insurance coverage for crop damage due to natural calamities",
      eligibility: "All farmers growing notified crops",
      logo: "/placeholder.svg",
      link: "https://pmfby.gov.in/"
    },
    {
      title: "KCC",
      description: "किसान क्रेडिट कार्ड",
      englishDescription: "Farmer Credit Card",
      benefits: "Short-term credit support at minimal interest",
      eligibility: "All farmers and agricultural laborers",
      logo: "/placeholder.svg",
      link: "https://www.nabard.org/content.aspx?id=582"
    },
    {
      title: "PKVY",
      description: "परम्परागत कृषि विकास योजना",
      englishDescription: "Traditional Farming Development Scheme",
      benefits: "Support for organic farming practices",
      eligibility: "Farmers willing to adopt organic farming",
      logo: "/placeholder.svg",
      link: "https://pgsindia-ncof.gov.in/pkvy/Index.aspx"
    },
    {
      title: "RKVY",
      description: "राष्ट्रीय कृषि विकास योजना",
      englishDescription: "National Agricultural Development Scheme",
      benefits: "Infrastructure development and modern farming technology",
      eligibility: "State governments for farmer groups",
      logo: "/placeholder.svg",
      link: "https://rkvy.nic.in/"
    },
    {
      title: "AGMARKNET",
      description: "कृषि विपणन सूचना नेटवर्क",
      englishDescription: "Agricultural Marketing Information Network",
      benefits: "Real-time agricultural commodity prices from mandis",
      eligibility: "All farmers with internet access",
      logo: "/placeholder.svg",
      link: "https://agmarknet.gov.in/"
    }
  ];

  const filteredSchemes = schemes.filter(scheme => 
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.englishDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header toggleContrast={toggleContrast} isHighContrast={isHighContrast} />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              सरकारी योजनाएँ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Discover government schemes to help your farming business thrive
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="खोजें (Search schemes)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme, index) => (
              <GovernmentScheme
                key={index}
                title={scheme.title}
                description={scheme.description}
                englishDescription={scheme.englishDescription}
                benefits={scheme.benefits}
                eligibility={scheme.eligibility}
                logo={scheme.logo}
                link={scheme.link}
              />
            ))}
          </div>
          
          {filteredSchemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                कोई योजना नहीं मिली। कृपया अपनी खोज बदलें।
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                No schemes found. Please try a different search.
              </p>
            </div>
          )}

 
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Government;
