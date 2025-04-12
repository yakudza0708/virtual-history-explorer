
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import { toast } from "sonner";

// Single panorama location with minimal data
const panoramaData = {
  id: 1,
  name: "Музей истории ЛЭТИ",
  year: 1946,
  panoramaUrl: "/lovable-uploads/8c25670f-cdb8-4e0f-96a8-7f2d078b3227.png",
  points: [
    {
      id: "point-1",
      position: { x: 25, y: 50 },
      title: "Экспозиция 'ЛЭТИ'",
      description: "Центральная экспозиция музея с логотипом университета.",
    },
    {
      id: "point-2",
      position: { x: 76, y: 45 },
      title: "Стенды с историческими документами",
      description: "Исторические фотографии и документы.",
    },
    {
      id: "point-3",
      position: { x: 50, y: 60 },
      title: "Центральная инсталляция",
      description: "Геометрическая конструкция в центре зала, символизирующая достижения в науке.",
    }
  ]
};

const Tour = () => {
  const isMobile = useIsMobile();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Show welcome toast only once
    const hasSeenTour = sessionStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      toast("Виртуальный тур запущен", {
        description: "Используйте мышь или свайпы для управления панорамой",
        duration: 3000,
      });
      sessionStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <main className="container mx-auto px-4 pt-16 pb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Виртуальный тур по истории ЛЭТИ</h1>
            
            {/* Panorama viewer */}
            <div className="rounded-xl overflow-hidden mb-4">
              <PanoramaViewer 
                panoramaUrl={panoramaData.panoramaUrl} 
                hotspots={panoramaData.points}
                height={isMobile ? "70vh" : "80vh"}
                initialHfov={isMobile ? 90 : 100}
              />
            </div>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Tour;
