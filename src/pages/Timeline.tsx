
import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AnimatedTransition from '../components/AnimatedTransition';
import TimelineComponent from '../components/TimelineComponent';

// Sample timeline events
const timelineEvents = [
  {
    id: 1,
    year: 1886,
    title: "Основание учебного заведения",
    description: "Основано Техническое училище почтово-телеграфного ведомства по указу императора Александра III. Это было первое в Европе высшее учебное заведение электротехнического профиля.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    year: 1891,
    title: "Преобразование в Электротехнический институт",
    description: "Техническое училище преобразовано в Электротехнический институт.",
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    year: 1895,
    title: "Изобретение радио А.С. Поповым",
    description: "Профессор института Александр Степанович Попов демонстрирует первый в мире радиоприёмник на заседании Русского физико-химического общества 7 мая 1895 года.",
    image: "https://images.unsplash.com/photo-1546531130-0157b3ac3a60?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    year: 1899,
    title: "Первый выпуск инженеров-электриков",
    description: "Институт осуществляет первый выпуск инженеров-электриков, получивших полноценное высшее образование в области электротехники.",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    year: 1905,
    title: "Переезд в новое здание",
    description: "Институт переезжает в новое специально построенное здание на улице Профессора Попова (тогда называлась Аптекарский проспект).",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    year: 1918,
    title: "Национализация института",
    description: "После Октябрьской революции институт был национализирован и реорганизован.",
    image: "https://images.unsplash.com/photo-1531070992164-a9d0a5a9e03c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    year: 1924,
    title: "Присвоение имени В.И. Ульянова (Ленина)",
    description: "Институту присвоено имя В.И. Ульянова (Ленина).",
    image: "https://images.unsplash.com/photo-1575848642618-6e77e90a3348?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    year: 1941,
    title: "Великая Отечественная война",
    description: "Во время блокады Ленинграда многие студенты и сотрудники института ушли на фронт, другие продолжали работать в осажденном городе.",
    image: "https://images.unsplash.com/photo-1570891838019-32037d6566e5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    year: 1960,
    title: "Развитие новых направлений",
    description: "Институт активно развивает новые направления в области электроники, автоматики и вычислительной техники.",
    image: "https://images.unsplash.com/photo-1517420879788-88ae3a855a8f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 10,
    year: 1992,
    title: "Переименование в СПбГЭТУ 'ЛЭТИ'",
    description: "После распада СССР институт получает статус государственного университета и переименован в Санкт-Петербургский государственный электротехнический университет 'ЛЭТИ'.",
    image: "https://images.unsplash.com/photo-1573495612877-17ce96bfe202?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 11,
    year: 2020,
    title: "Современное развитие",
    description: "Университет продолжает активное развитие, внедряет новые образовательные программы и проводит инновационные исследования.",
    image: "https://images.unsplash.com/photo-1588239034647-25783cbbebc0?q=80&w=800&auto=format&fit=crop"
  }
];

// Additional content for each event
const additionalContent = {
  1: {
    details: "Техническое училище почтово-телеграфного ведомства было создано по инициативе директора Телеграфного департамента Н.К. Славинского. Первым директором училища стал Н.Г. Писаревский. Первоначально обучение длилось 4 года.",
    facts: [
      "Первый набор состоял всего из 16 студентов",
      "Училище размещалось в здании Главного почтамта",
      "В программу обучения входили как теоретические, так и практические занятия"
    ]
  },
  3: {
    details: "7 мая 1895 года на заседании Русского физико-химического общества Александр Степанович Попов продемонстрировал первый в мире радиоприёмник. Это изобретение стало результатом его работы в стенах Электротехнического института, где он преподавал физику и электротехнику.",
    facts: [
      "День 7 мая стал профессиональным праздником всех радиотехников",
      "Первый радиоприёмник Попова представлял собой когерер (трубку с металлическими опилками)",
      "В 1896 году Попов осуществил первую в России радиопередачу на расстояние 250 метров"
    ]
  },
  5: {
    details: "В 1903 году началось строительство специального комплекса зданий для Электротехнического института на Аптекарском проспекте. Проект был разработан архитектором А.Н. Векшинским. Торжественное открытие нового здания состоялось в 1905 году.",
    facts: [
      "Главное здание было построено в стиле модерн",
      "На территории института были созданы современные по тем временам лаборатории",
      "В новом здании был установлен первый в России рентгеновский аппарат"
    ]
  }
};

interface HistoricalEvent {
  id: number;
  year: number;
  title: string;
  description: string;
  image?: string;
}

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(timelineEvents[0]);
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  
  const handleEventSelect = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setShowAdditionalContent(false);
  };
  
  const toggleAdditionalContent = () => {
    setShowAdditionalContent(!showAdditionalContent);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-12">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Вернуться на главную
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Хронология истории ЛЭТИ</h1>
              <p className="text-muted-foreground max-w-3xl">
                Исследуйте ключевые моменты в истории Электротехнического института от основания до наших дней
              </p>
            </div>
            
            {/* Timeline Component */}
            <TimelineComponent 
              events={timelineEvents}
              onEventSelect={handleEventSelect}
            />
            
            {/* Additional Content */}
            {selectedEvent && additionalContent[selectedEvent.id as keyof typeof additionalContent] && (
              <div className="mt-8">
                <button
                  onClick={toggleAdditionalContent}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 mb-4"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {showAdditionalContent ? 'Скрыть дополнительную информацию' : 'Показать дополнительную информацию'}
                </button>
                
                {showAdditionalContent && (
                  <div className="glass p-6 rounded-xl animate-fade-in">
                    <h3 className="text-xl font-bold mb-4">Дополнительная информация</h3>
                    <p className="mb-4">
                      {additionalContent[selectedEvent.id as keyof typeof additionalContent].details}
                    </p>
                    
                    <h4 className="text-lg font-semibold mb-2">Интересные факты:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {additionalContent[selectedEvent.id as keyof typeof additionalContent].facts.map((fact, index) => (
                        <li key={index} className="text-muted-foreground">{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        
        {/* Related Links */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Исследуйте больше</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/tour" className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <h3 className="text-xl font-bold mb-2">Виртуальный тур</h3>
                <p className="text-muted-foreground mb-4">
                  Исследуйте исторические места ЛЭТИ через интерактивные панорамы
                </p>
                <div className="inline-flex items-center text-primary">
                  Начать тур
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </div>
              </Link>
              
              <Link to="/about" className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <h3 className="text-xl font-bold mb-2">О проекте</h3>
                <p className="text-muted-foreground mb-4">
                  Узнайте больше о проекте виртуального тура по истории ЛЭТИ
                </p>
                <div className="inline-flex items-center text-primary">
                  Подробнее
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </div>
              </Link>
              
              <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <h3 className="text-xl font-bold mb-2">Официальный сайт ЛЭТИ</h3>
                <p className="text-muted-foreground mb-4">
                  Посетите официальный сайт Санкт-Петербургского государственного электротехнического университета
                </p>
                <a 
                  href="https://etu.ru" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary"
                >
                  Перейти на сайт
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
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

export default Timeline;
