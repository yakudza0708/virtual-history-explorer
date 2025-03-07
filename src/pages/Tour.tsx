
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AnimatedTransition from '../components/AnimatedTransition';
import PanoramaViewer from '../components/PanoramaViewer';
import Quiz from '../components/Quiz';

// Placeholder panorama URLs (should be replaced with actual panorama images)
const panoramas = [
  {
    id: 'main-building',
    name: 'Главный корпус',
    description: 'Историческое здание главного корпуса ЛЭТИ, построенное в начале XX века',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2000&auto=format&fit=crop',
    hotspots: [
      {
        id: 'main-entrance',
        position: { x: 35, y: 45 },
        title: 'Главный вход',
        description: 'Исторический вход в главный корпус ЛЭТИ, оформленный в классическом стиле начала XX века',
        image: 'https://images.unsplash.com/photo-1541760866956-4f042f89cd5c?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'memorial-plaque',
        position: { x: 65, y: 40 },
        title: 'Мемориальная доска',
        description: 'Мемориальная доска в честь выдающихся ученых, работавших в ЛЭТИ в разные годы',
        image: 'https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'historical-museum',
    name: 'Музей истории ЛЭТИ',
    description: 'Музей, содержащий экспонаты и артефакты, отражающие богатую историю университета',
    imageUrl: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?q=80&w=2000&auto=format&fit=crop',
    hotspots: [
      {
        id: 'first-exhibits',
        position: { x: 30, y: 50 },
        title: 'Первые экспонаты',
        description: 'Коллекция первых электротехнических приборов, использовавшихся для обучения студентов в конце XIX века',
        image: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'famous-graduates',
        position: { x: 70, y: 45 },
        title: 'Выдающиеся выпускники',
        description: 'Стенд, посвященный знаменитым выпускникам ЛЭТИ, внесшим значительный вклад в науку и технику',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'laboratory',
    name: 'Историческая лаборатория',
    description: 'Воссозданная историческая лаборатория начала XX века',
    imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2000&auto=format&fit=crop',
    hotspots: [
      {
        id: 'equipment',
        position: { x: 40, y: 55 },
        title: 'Оборудование',
        description: 'Историческое лабораторное оборудование, на котором проводились первые эксперименты в области электротехники',
        image: 'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'scientists-workspace',
        position: { x: 60, y: 40 },
        title: 'Рабочее место ученого',
        description: 'Воссозданное рабочее место известного ученого, работавшего в ЛЭТИ в начале XX века',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop'
      }
    ]
  }
];

// Sample quiz questions
const quizQuestions = [
  {
    id: 1,
    text: 'В каком году был основан Электротехнический институт?',
    options: [
      { id: 'a', text: '1886', isCorrect: true },
      { id: 'b', text: '1895', isCorrect: false },
      { id: 'c', text: '1900', isCorrect: false },
      { id: 'd', text: '1905', isCorrect: false }
    ],
    explanation: 'Учебное заведение было основано в 1886 году как Техническое училище почтово-телеграфного ведомства.'
  },
  {
    id: 2,
    text: 'Кто был первым директором Электротехнического института?',
    options: [
      { id: 'a', text: 'А.С. Попов', isCorrect: false },
      { id: 'b', text: 'Н.Г. Писаревский', isCorrect: true },
      { id: 'c', text: 'П.Д. Войнаровский', isCorrect: false },
      { id: 'd', text: 'М.А. Шателен', isCorrect: false }
    ],
    explanation: 'Первым директором института был Николай Григорьевич Писаревский, который руководил учебным заведением с 1886 по 1895 год.'
  },
  {
    id: 3,
    text: 'Какое изобретение продемонстрировал А.С. Попов 7 мая 1895 года?',
    options: [
      { id: 'a', text: 'Телефон', isCorrect: false },
      { id: 'b', text: 'Электрическую лампочку', isCorrect: false },
      { id: 'c', text: 'Радиоприёмник', isCorrect: true },
      { id: 'd', text: 'Телеграф', isCorrect: false }
    ],
    explanation: '7 мая 1895 года А.С. Попов продемонстрировал первый в мире радиоприёмник на заседании Русского физико-химического общества.'
  }
];

const Tour = () => {
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const currentPanorama = panoramas[currentPanoramaIndex];
  
  const goToPreviousPanorama = () => {
    setCurrentPanoramaIndex((prev) => 
      prev === 0 ? panoramas.length - 1 : prev - 1
    );
  };
  
  const goToNextPanorama = () => {
    setCurrentPanoramaIndex((prev) => 
      prev === panoramas.length - 1 ? 0 : prev + 1
    );
  };
  
  const goToPanorama = (index: number) => {
    setCurrentPanoramaIndex(index);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Вернуться на главную
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Виртуальный тур по ЛЭТИ</h1>
              <p className="text-muted-foreground max-w-3xl">
                Исследуйте исторические места ЛЭТИ через интерактивные панорамы. Кликайте на информационные точки, чтобы узнать больше.
              </p>
            </div>
            
            {/* Panorama Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {panoramas.map((panorama, index) => (
                <button
                  key={panorama.id}
                  onClick={() => goToPanorama(index)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPanoramaIndex === index
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground/80 hover:bg-secondary/80'
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {panorama.name}
                </button>
              ))}
            </div>
            
            {/* Current Panorama Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{currentPanorama.name}</h2>
              <p className="text-muted-foreground">{currentPanorama.description}</p>
            </div>
            
            {/* Panorama Viewer */}
            <div className="mb-8">
              <PanoramaViewer 
                panoramaUrl={currentPanorama.imageUrl}
                hotspots={currentPanorama.hotspots}
              />
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mb-12">
              <button
                onClick={goToPreviousPanorama}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Предыдущая локация
              </button>
              
              <button
                onClick={goToNextPanorama}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200"
              >
                Следующая локация
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
            
            {/* Quiz Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Проверьте свои знания</h2>
                <button
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200"
                >
                  {showQuiz ? 'Скрыть тест' : 'Показать тест'}
                </button>
              </div>
              
              {showQuiz && (
                <Quiz 
                  title="Тест по истории ЛЭТИ"
                  description="Проверьте, насколько хорошо вы знаете историю Электротехнического института"
                  questions={quizQuestions}
                />
              )}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="text-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary"></span>
                  ЛЭТИ Тур
                </div>
              </div>
              
              <div className="flex gap-6">
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors duration-200">
                  Главная
                </Link>
                <Link to="/tour" className="text-foreground/80 hover:text-primary transition-colors duration-200">
                  Виртуальный тур
                </Link>
                <Link to="/timeline" className="text-foreground/80 hover:text-primary transition-colors duration-200">
                  Хронология
                </Link>
                <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors duration-200">
                  О проекте
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedTransition>
  );
};

export default Tour;
