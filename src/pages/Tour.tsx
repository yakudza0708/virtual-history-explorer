
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

// Simplified panorama locations with minimal data
const panoramaLocations = [
  {
    id: 1,
    name: "Музей истории ЛЭТИ",
    year: 1946,
    description: "Исторический музей университета, содержащий экспонаты, связанные с историей электротехники и развитием ЛЭТИ.",
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
  },
  {
    id: 2,
    name: "Главный вход",
    year: 1905,
    description: "Исторический вход в главное здание ЛЭТИ, построенное в начале XX века.",
    panoramaUrl: "https://images.unsplash.com/photo-1583163501239-9deb12502a1a?q=80&w=1600&auto=format&fit=crop",
    points: [
      {
        id: "point-1",
        position: { x: 20, y: 50 },
        title: "Архитектурные элементы",
        description: "Фасад здания в стиле модерн.",
      }
    ]
  },
  {
    id: 3,
    name: "Лаборатория Попова",
    year: 1903,
    description: "Реконструкция лаборатории А.С. Попова, изобретателя радио и преподавателя ЛЭТИ.",
    panoramaUrl: "https://images.unsplash.com/photo-1581093196277-9f608bb3b1a9?q=80&w=1600&auto=format&fit=crop",
    points: [
      {
        id: "point-1",
        position: { x: 50, y: 50 },
        title: "Радиоприемник Попова",
        description: "Первый в мире радиоприемник, созданный А.С. Поповым в 1895 году.",
      }
    ]
  }
];

const Tour = () => {
  const isMobile = useIsMobile();
  const [activeLocationId, setActiveLocationId] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

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

  const activeLocation = panoramaLocations.find(location => location.id === activeLocationId) || panoramaLocations[0];

  const handleNextLocation = () => {
    const currentIndex = panoramaLocations.findIndex(location => location.id === activeLocationId);
    const nextIndex = (currentIndex + 1) % panoramaLocations.length;
    setActiveLocationId(panoramaLocations[nextIndex].id);
  };

  const handlePrevLocation = () => {
    const currentIndex = panoramaLocations.findIndex(location => location.id === activeLocationId);
    const prevIndex = currentIndex === 0 ? panoramaLocations.length - 1 : currentIndex - 1;
    setActiveLocationId(panoramaLocations[prevIndex].id);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <main className="container mx-auto px-4 pt-16 pb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Виртуальный тур по истории ЛЭТИ</h1>
            
            {/* Location selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {panoramaLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocationId(location.id)}
                  className={`p-2 rounded-lg text-left transition-all ${
                    activeLocationId === location.id ? 'bg-primary/10 ring-1 ring-primary' : 'bg-white/5'
                  }`}
                >
                  <span className="font-medium">{location.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({location.year})</span>
                </button>
              ))}
            </div>
            
            {/* Panorama viewer */}
            <div className="rounded-xl overflow-hidden mb-4">
              <div className="relative">
                <PanoramaViewer 
                  panoramaUrl={activeLocation.panoramaUrl} 
                  hotspots={activeLocation.points}
                  height={isMobile ? "400px" : "60vh"}
                  initialHfov={isMobile ? 90 : 100}
                />
                
                {/* Navigation controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handlePrevLocation}
                    className="bg-black/30 hover:bg-black/50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleNextLocation}
                    className="bg-black/30 hover:bg-black/50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                    className="bg-black/30 hover:bg-black/50"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Info panel */}
                {showInfo && (
                  <div className="absolute left-4 bottom-4 max-w-xs p-3 bg-black/40 backdrop-blur-sm rounded-lg text-white">
                    <h3 className="text-base font-medium">{activeLocation.name} ({activeLocation.year})</h3>
                    <p className="text-xs mt-1">{activeLocation.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Simplified tabs */}
            <Tabs defaultValue="description" className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <TabsList className="w-full mb-4 grid grid-cols-3">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
                <TabsTrigger value="facts">Факты</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="text-sm space-y-2">
                <h3 className="text-lg font-medium">{activeLocation.name}</h3>
                <p>{activeLocation.description}</p>
              </TabsContent>
              
              <TabsContent value="history" className="text-sm space-y-2">
                <h3 className="text-lg font-medium">Историческая справка</h3>
                <p>В {activeLocation.year} году это место стало важной частью электротехнического института.</p>
              </TabsContent>
              
              <TabsContent value="facts" className="text-sm space-y-2">
                <h3 className="text-lg font-medium">Интересные факты</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Здесь было сделано несколько важных научных открытий.</li>
                  <li>Это место посещали многие известные ученые своего времени.</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Tour;
