
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, MapPin, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Sample panorama locations for the tour
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
        description: "Центральная экспозиция музея с логотипом университета. Здесь представлены основные вехи истории ЛЭТИ с момента его основания.",
      },
      {
        id: "point-2",
        position: { x: 76, y: 45 },
        title: "Стенды с историческими документами",
        description: "На стенах размещены исторические фотографии, документы и схемы, отражающие развитие электротехнической науки в России и вклад ученых ЛЭТИ.",
      },
      {
        id: "point-3",
        position: { x: 15, y: 35 },
        title: "Посетители музея",
        description: "Музей регулярно посещают студенты, преподаватели и гости университета, интересующиеся историей науки и техники.",
      },
      {
        id: "point-4",
        position: { x: 40, y: 62 },
        title: "Исторические приборы",
        description: "В центре зала расположены витрины с историческими приборами и устройствами, разработанными учеными и инженерами ЛЭТИ на протяжении более чем столетней истории вуза.",
      },
      {
        id: "point-5",
        position: { x: 65, y: 70 },
        title: "Научные достижения",
        description: "Специальная экспозиция, посвященная научным достижениям выдающихся ученых университета в области радиотехники, электроники и информационных технологий.",
      }
    ]
  },
  {
    id: 2,
    name: "Главный вход",
    coordinates: "59.9720, 30.3210",
    description: "Исторический вход в главное здание ЛЭТИ, построенное в начале XX века.",
    panoramaUrl: "https://images.unsplash.com/photo-1583163501239-9deb12502a1a?q=80&w=2000&auto=format&fit=crop",
    year: 1905,
    points: [
      {
        id: "point-1",
        position: { x: 0.2, y: 0.5 },
        title: "Архитектурные элементы",
        description: "Фасад здания выполнен в стиле модерн, характерном для начала XX века.",
      },
      {
        id: "point-2",
        position: { x: 0.8, y: 0.3 },
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
    panoramaUrl: "https://images.unsplash.com/photo-1581093196277-9f608bb3b1a9?q=80&w=2000&auto=format&fit=crop",
    year: 1903,
    points: [
      {
        id: "point-1",
        position: { x: 0.5, y: 0.5 },
        title: "Радиоприемник Попова",
        description: "Первый в мире радиоприемник, созданный А.С. Поповым в 1895 году.",
      },
      {
        id: "point-2",
        position: { x: 0.2, y: 0.7 },
        title: "Рабочий стол",
        description: "Воссозданный рабочий стол ученого с оригинальными инструментами.",
      }
    ]
  }
];

const Tour = () => {
  const [activeLocationId, setActiveLocationId] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome toast when component mounts
    toast({
      title: "Виртуальный тур запущен",
      description: "Используйте мышь для изменения угла обзора. Нажимайте на интерактивные точки для получения информации.",
      duration: 5000,
    });
  }, [toast]);

  const activeLocation = panoramaLocations.find(location => location.id === activeLocationId) || panoramaLocations[0];

  const handleNextLocation = () => {
    const currentIndex = panoramaLocations.findIndex(location => location.id === activeLocationId);
    const nextIndex = (currentIndex + 1) % panoramaLocations.length;
    setActiveLocationId(panoramaLocations[nextIndex].id);
    setShowInfo(true);
  };

  const handlePrevLocation = () => {
    const currentIndex = panoramaLocations.findIndex(location => location.id === activeLocationId);
    const prevIndex = currentIndex === 0 ? panoramaLocations.length - 1 : currentIndex - 1;
    setActiveLocationId(panoramaLocations[prevIndex].id);
    setShowInfo(true);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Виртуальный тур по истории ЛЭТИ</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {panoramaLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => {
                    setActiveLocationId(location.id);
                    setShowInfo(true);
                  }}
                  className={`glass p-4 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    activeLocationId === location.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-sm text-muted-foreground">{location.year} г.</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{location.coordinates}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{location.description}</p>
                </button>
              ))}
            </div>
            
            <div className="glass rounded-xl overflow-hidden mb-8">
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
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleNextLocation}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Location information panel */}
                {showInfo && (
                  <div className="absolute left-4 bottom-4 max-w-md p-4 bg-black/40 backdrop-blur-md rounded-lg text-white animate-fade-in">
                    <h3 className="text-lg font-medium mb-1">{activeLocation.name} ({activeLocation.year})</h3>
                    <p className="text-sm mb-2">{activeLocation.description}</p>
                    <div className="text-xs flex items-center text-white/80">
                      <Camera className="h-3 w-3 mr-1" />
                      <span>Перемещайте мышь для осмотра. Нажимайте на точки для получения информации.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="description" className="glass rounded-xl p-6">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
                <TabsTrigger value="facts">Интересные факты</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <h3 className="text-xl font-medium">{activeLocation.name}</h3>
                <p>{activeLocation.description}</p>
                {activeLocation.id === 1 && (
                  <>
                    <p>Музей истории ЛЭТИ основан в 1946 году и является одним из старейших музеев истории науки и техники в России. В экспозиции представлены уникальные экспонаты, связанные с развитием электротехники, радиотехники и электроники.</p>
                    <p>Среди наиболее ценных экспонатов - оригинальные приборы из лаборатории А.С. Попова, первого декана электротехнического факультета и изобретателя радио.</p>
                  </>
                )}
                {activeLocation.id !== 1 && (
                  <p>Локация была важной частью университета с {activeLocation.year} года. Многие исторические события связаны с этим местом, включая важные научные открытия и образовательную деятельность.</p>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <h3 className="text-xl font-medium">Историческая справка</h3>
                {activeLocation.id === 1 && (
                  <>
                    <p>Музей официально открыт в 1946 году к 50-летию изобретения радио. За годы своего существования музей накопил богатую коллекцию исторических материалов и артефактов, связанных с историей ЛЭТИ и развитием электротехники в России.</p>
                    <p>В экспозиции представлены личные вещи, научные приборы и документы выдающихся ученых, работавших в ЛЭТИ, включая А.С. Попова, П.Д. Войнаровского, И.Г. Фреймана, А.А. Смурова и многих других.</p>
                    <p>Во время блокады Ленинграда многие уникальные экспонаты были сохранены благодаря героическим усилиям сотрудников университета. После войны музей был восстановлен и значительно расширен.</p>
                  </>
                )}
                {activeLocation.id !== 1 && (
                  <p>В {activeLocation.year} году это место стало важной частью развивающегося электротехнического института. За прошедшие годы здесь работали многие выдающиеся ученые и преподаватели.</p>
                )}
              </TabsContent>
              
              <TabsContent value="facts" className="space-y-4">
                <h3 className="text-xl font-medium">Интересные факты</h3>
                {activeLocation.id === 1 && (
                  <ul className="list-disc list-inside space-y-2">
                    <li>В музее хранится одна из первых в мире моделей грозоотметчика, изобретенного А.С. Поповым.</li>
                    <li>Среди экспонатов музея - копия первого в мире радиоприемника, созданного Поповым в 1895 году.</li>
                    <li>Оформление музея было разработано известными ленинградскими художниками и архитекторами послевоенного периода.</li>
                    <li>В центре зала размещена схема "ЛЭТИ" - символическое изображение истории университета и его важнейших достижений.</li>
                    <li>Музей регулярно обновляет экспозицию, включая в нее новые материалы о современных достижениях университета и его выпускников.</li>
                  </ul>
                )}
                {activeLocation.id !== 1 && (
                  <ul className="list-disc list-inside space-y-2">
                    <li>В этом месте было сделано несколько важных научных открытий в области электротехники.</li>
                    <li>Знаменитые выпускники ЛЭТИ часто посещали эту локацию во время своего обучения.</li>
                    <li>Архитектура здания сочетает в себе элементы модерна начала XX века с функциональностью технического учебного заведения.</li>
                    <li>За годы существования внутреннее пространство несколько раз перестраивалось под новые научные и образовательные задачи.</li>
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
