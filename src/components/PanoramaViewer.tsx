
import React, { useEffect, useRef, useState } from 'react';
import { Info, X, ZoomIn, ZoomOut, RotateCcw, Move, MoveHorizontal, MoveVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface Hotspot {
  id: string;
  position: { x: number; y: number };
  title: string;
  description: string;
  image?: string;
  link?: string;
}

interface PanoramaViewerProps {
  panoramaUrl: string;
  hotspots: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  panoramaUrl, 
  hotspots,
  onHotspotClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageReady, setImageReady] = useState(false);
  const [controlMode, setControlMode] = useState<'rotate' | 'move'>('rotate');
  const [rotationSpeed, setRotationSpeed] = useState(0.3);

  // Preload image
  useEffect(() => {
    setIsLoading(true);
    const image = new Image();
    image.src = panoramaUrl;
    image.onload = () => {
      setIsLoading(false);
      setImageReady(true);
      toast("Панорама загружена!", {
        description: "Используйте мышь для вращения и перемещения панорамы.",
        duration: 3000,
      });
    };
    image.onerror = () => {
      setIsLoading(false);
      toast.error("Ошибка загрузки панорамы", {
        description: "Пожалуйста, попробуйте обновить страницу.",
      });
    };

    // Reset position when loading a new panorama
    resetView();
  }, [panoramaUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = (e.clientX - startX) * rotationSpeed;
    const deltaY = (e.clientY - startY) * rotationSpeed;
    
    if (controlMode === 'rotate') {
      setRotationX((prevRotation) => prevRotation + deltaX);
      setRotationY((prevRotation) => {
        // Limit vertical rotation to prevent flipping
        const newRotation = prevRotation + deltaY;
        return Math.max(-65, Math.min(65, newRotation));
      });
    } else {
      // Move mode
      setPositionX(prev => prev + deltaX);
      setPositionY(prev => prev + deltaY);
    }
    
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const deltaX = (e.touches[0].clientX - startX) * rotationSpeed;
    const deltaY = (e.touches[0].clientY - startY) * rotationSpeed;
    
    if (controlMode === 'rotate') {
      setRotationX((prevRotation) => prevRotation + deltaX);
      setRotationY((prevRotation) => {
        const newRotation = prevRotation + deltaY;
        return Math.max(-65, Math.min(65, newRotation));
      });
    } else {
      // Move mode
      setPositionX(prev => prev + deltaX);
      setPositionY(prev => prev + deltaY);
    }
    
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHotspot(hotspot);
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(0.5, Math.min(3.5, prevZoom + delta));
      return newZoom;
    });
  };

  const zoomIn = () => {
    setZoomLevel(prevZoom => Math.min(3.5, prevZoom + 0.2));
  };

  const zoomOut = () => {
    setZoomLevel(prevZoom => Math.max(0.5, prevZoom - 0.2));
  };

  const resetView = () => {
    setRotationX(0);
    setRotationY(0);
    setPositionX(0);
    setPositionY(0);
    setZoomLevel(1);
    toast("Вид сброшен", {
      description: "Панорама возвращена в исходное положение.",
    });
  };

  const toggleControlMode = () => {
    setControlMode(prev => (prev === 'rotate' ? 'move' : 'rotate'));
    toast(`Режим ${controlMode === 'rotate' ? 'перемещения' : 'вращения'} активирован`, {
      description: controlMode === 'rotate' 
        ? "Теперь вы можете перемещать панораму"
        : "Теперь вы можете вращать панораму"
    });
  };

  const handleSpeedChange = (value: number[]) => {
    setRotationSpeed(value[0] / 100);
  };

  const closeHotspotInfo = () => {
    setActiveHotspot(null);
  };

  // Calculate 3D transform based on all parameters
  const transformStyle = {
    transform: `translate(${positionX}px, ${positionY}px) rotateY(${rotationX}deg) rotateX(${-rotationY}deg) scale(${zoomLevel})`,
  };

  return (
    <div className="relative w-full h-[500px] md:h-[70vh] overflow-hidden rounded-lg shadow-xl bg-black/20">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Загрузка панорамы...</p>
          </div>
        </div>
      )}
      
      <div
        ref={containerRef}
        className="w-full h-full perspective-1000 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className="w-full h-full transition-transform duration-100 transform-style-3d"
          style={transformStyle}
        >
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-center transform-style-3d" 
            style={{ 
              backgroundImage: imageReady ? `url(${panoramaUrl})` : 'none',
              opacity: imageReady ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-primary/70 hover:bg-primary/90 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
                style={{
                  left: `${hotspot.position.x}%`,
                  top: `${hotspot.position.y}%`,
                }}
                onClick={(e) => handleHotspotClick(hotspot, e)}
                aria-label={`Информация о "${hotspot.title}"`}
              >
                <Info size={16} className="text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls container */}
      <div className="absolute left-4 bottom-4 flex flex-col space-y-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg">
        {/* Mode toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleControlMode}
          className="flex items-center justify-center space-x-1"
          aria-label="Переключить режим"
        >
          {controlMode === 'rotate' ? (
            <>
              <RotateCcw className="h-4 w-4 mr-1" />
              <span>Вращение</span>
            </>
          ) : (
            <>
              <Move className="h-4 w-4 mr-1" />
              <span>Перемещение</span>
            </>
          )}
        </Button>
        
        {/* Zoom controls */}
        <div className="flex space-x-1">
          <Button
            variant="secondary"
            size="icon"
            onClick={zoomOut}
            className="bg-black/30 hover:bg-black/50"
            aria-label="Отдалить"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={zoomIn}
            className="bg-black/30 hover:bg-black/50"
            aria-label="Приблизить"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Reset view */}
        <Button
          variant="secondary"
          size="sm"
          onClick={resetView}
          className="bg-black/30 hover:bg-black/50"
          aria-label="Сбросить вид"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          <span>Сбросить</span>
        </Button>
        
        {/* Sensitivity slider */}
        <div className="pt-1 pb-0 px-2">
          <p className="text-white text-xs mb-1">Чувствительность</p>
          <Slider
            defaultValue={[30]}
            max={100}
            min={5}
            step={5}
            onValueChange={handleSpeedChange}
            className="w-32"
          />
        </div>
      </div>

      {/* Current mode indicator */}
      <div className="absolute bottom-4 right-4 glass px-3 py-2 rounded-full text-xs text-white">
        {controlMode === 'rotate' ? (
          <div className="flex items-center">
            <RotateCcw className="h-3 w-3 mr-1" />
            <span>Режим вращения</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Move className="h-3 w-3 mr-1" />
            <span>Режим перемещения</span>
          </div>
        )}
      </div>

      {/* Hotspot Information Panel */}
      {activeHotspot && (
        <div className="absolute right-4 top-4 max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/50 animate-fade-in z-20">
          <button
            onClick={closeHotspotInfo}
            className="absolute right-2 top-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
            aria-label="Закрыть"
          >
            <X size={16} />
          </button>
          
          <h3 className="text-lg font-medium mb-2">{activeHotspot.title}</h3>
          
          {activeHotspot.image && (
            <div className="mb-3 rounded-md overflow-hidden">
              <img
                src={activeHotspot.image}
                alt={activeHotspot.title}
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          )}
          
          <p className="text-sm text-foreground/80 mb-4">{activeHotspot.description}</p>
          
          {activeHotspot.link && (
            <a
              href={activeHotspot.link}
              className="text-sm text-primary font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Узнать больше
            </a>
          )}
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        .panorama-hotspot {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          cursor: pointer;
          box-shadow: 0 0 0 2px white;
          animation: pulse 2s infinite;
          z-index: 10;
          transition: all 0.2s ease;
        }
        
        .panorama-hotspot:hover {
          background-color: rgba(59, 130, 246, 0.9);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .panorama-info-card {
          position: absolute;
          max-width: 300px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeIn 0.3s ease-out;
          z-index: 20;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* For webkit browsers */
        .panorama-img {
          -webkit-user-drag: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
};

export default PanoramaViewer;
