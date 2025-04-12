
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import { toast } from "sonner";

const Tour = () => {
  const isMobile = useIsMobile();

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
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Виртуальный тур</h1>
            
            {/* Panorama viewer */}
            <div className="rounded-xl overflow-hidden mb-4">
              <PanoramaViewer 
                panoramaUrl="/lovable-uploads/8c25670f-cdb8-4e0f-96a8-7f2d078b3227.png" 
                height={isMobile ? "70vh" : "80vh"}
                initialHfov={isMobile ? 90 : 100}
                autoRotate={false}
              />
            </div>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Tour;
