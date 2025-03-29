
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  englishTitle?: string;
  description: string;
  englishDescription?: string;
  icon: LucideIcon;
  color: string;
  buttonText?: string;
  buttonHindi?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  englishTitle,
  description,
  englishDescription,
  icon: Icon,
  color,
  buttonText = "Learn More",
  buttonHindi,
  onClick = () => {}
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className={color}>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-white/90 text-primary">
            <Icon size={24} />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {englishTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-noto">{englishTitle}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <p className="text-foreground/80 text-sm mb-2">{description}</p>
        {englishDescription && (
          <p className="text-foreground/60 text-xs">{englishDescription}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          onClick={onClick}
        >
          {buttonText}
          {buttonHindi && (
            <span className="ml-1 text-sm font-noto">({buttonHindi})</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
