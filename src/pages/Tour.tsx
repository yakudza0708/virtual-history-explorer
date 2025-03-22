import React, { useState, useEffect } from 'react';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

// Optimized panorama locations with minimal data
const panoramaLocations = [
  {
    id: 1,
    name: "Музей истории ЛЭТИ",
    coordinates: "59.9715, 30.3208",
    description: "Исторический музей университета, содержащий экспонаты, связанные с историей электротехники и развитием ЛЭТИ.",
    panoramaUrl: "/lovable-uploads/6ee8e2b6-a0a3-4c02-bb9e-5034b4777ff1.png",
    year: 1946,
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
        description: "Исторические фотографии и документы, отражающие развитие электротехнической науки.",
      },
      {
        id: "point-3",
        position: { x: 15, y: 35 },
        title: "Посетители музея",
        description: "Музей регулярно посещают студенты, преподаватели и гости университета.",
      },
      {
        id: "point-4",
        position: { x: 40, y: 62 },
        title: "Исторические приборы",
        description: "Витрины с историческими приборами и устройствами, разработанными учеными ЛЭТИ.",
      },
      {
        id: "point-5",
        position: { x: 65, y: 70 },
        title: "Научные достижения",
        description: "Экспозиция, посвященная научным достижениям выдающихся ученых университета.",
      }
    ]
  },
  // Keep other locations but with optimized data
  {
    id: 2,
    name: "Главный вход",
    coordinates: "59.9720, 30.3210",
    description: "Исторический вход в главное здание ЛЭТИ, построенное в начале XX века.",
    panoramaUrl: "https://images.unsplash.com/photo-1583163501239-9deb12502a1a?q=80&w=1000&auto=format&fit=crop",
    year: 1905,
    points: [
      {
        id: "point-1",
        position: { x: 20, y: 50 },
        title: "Архитектурные элементы",
        description: "Фасад здания выполнен в стиле модерн, характерном для начала XX века.",
      },
      {
        id: "point-2",
        position: { x: 80, y: 30 },
        title: "Мемориальная доска",
        description: "Доска в память о выдающихся учёных, работавших в ЛЭТИ.",
      }
    ]
  },
  {
    id: 3,
    name: "Лаборатория Попова",
    coordinates: "59.9722, 30.3205",
    description: "Реконструкция лаборатории А.С. Попова, изобретателя радио и преподавателя ЛЭТИ.",
    panoramaUrl: "https://images.unsplash.com/photo-1581093196277-9f608bb3b1a9?q=80&w=1000&auto=format&fit=crop",
    year: 1903,
    points: [
      {
        id: "point-1",
        position: { x: 50, y: 50 },
        title: "Радиоприемник Попова",
        description: "Первый в мире радиоприемник, созданный А.С. Поповым в 1895 году.",
      },
      {
        id: "point-2",
        position: { x: 20, y: 70 },
        title: "Рабочий стол",
        description: "Воссозданный рабочий стол ученого с оригинальными инструментами.",
      }
    ]
  }
];

const Tour = () => {
  const [activeLocationId, setActiveLocationId] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    // Show welcome toast only once
    const hasSeenTour = sessionStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      toast("Виртуальный тур запущен", {
        description: "Используйте мышь для осмотра панорамы",
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
        <main className="container mx-auto px-4 pt-20 pb-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Виртуальный тур по истории ЛЭТИ</h1>
            
            {/* Simplified location selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {panoramaLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocationId(location.id)}
                  className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm text-left transition-all ${
                    activeLocationId === location.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-muted-foreground">{location.year}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{location.coordinates}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Optimized panorama container */}
            <div className="rounded-xl overflow-hidden mb-6 bg-black/5">
              <div className="relative">
                <PanoramaViewer 
                  panoramaUrl={activeLocation.panoramaUrl} 
                  hotspots={activeLocation.points} 
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
                
                {/* Simplified info panel */}
                {showInfo && (
                  <div className="absolute left-4 bottom-4 max-w-xs p-3 bg-black/40 backdrop-blur-sm rounded-lg text-white">
                    <h3 className="text-base font-medium">{activeLocation.name} ({activeLocation.year})</h3>
                    <p className="text-xs mt-1">{activeLocation.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Simplified tabs */}
            <Tabs defaultValue="description" className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
                <TabsTrigger value="facts">Факты</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="text-sm">
                <h3 className="text-lg font-medium">{activeLocation.name}</h3>
                <p>{activeLocation.description}</p>
                {activeLocation.id === 1 && (
                  <p className="mt-2">Музей основан в 1946 году и является одним из старейших музеев истории науки и техники в России.</p>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="text-sm">
                <h3 className="text-lg font-medium">Историческая справка</h3>
                {activeLocation.id === 1 && (
                  <p>Музей официально открыт в 1946 году к 50-летию изобретения радио. В экспозиции представлены личные вещи, научные приборы и документы выдающихся ученых.</p>
                )}
                {activeLocation.id !== 1 && (
                  <p>В {activeLocation.year} году это место стало важной частью развивающегося электротехнического института.</p>
                )}
              </TabsContent>
              
              <TabsContent value="facts" className="text-sm">
                <h3 className="text-lg font-medium">Интересные факты</h3>
                {activeLocation.id === 1 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>В музее хранится одна из первых моделей грозоотметчика, изобретенного А.С. Поповым.</li>
                    <li>Среди экспонатов - копия первого в мире радиоприемника, созданного в 1895 году.</li>
                  </ul>
                )}
                {activeLocation.id !== 1 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>В этом месте было сделано несколько важных научных открытий.</li>
                    <li>Архитектура здания сочетает элементы модерна начала XX века.</li>
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Tour;
