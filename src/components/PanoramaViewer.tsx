
import React, { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);

  // This is a simplified panorama viewer that would normally use a library or API
  // For a production app, you would integrate with a panorama library

  useEffect(() => {
    const image = new Image();
    image.src = panoramaUrl;
    image.onload = () => {
      setIsLoading(false);
    };
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
    
    const deltaX = (e.clientX - startX) * 0.5;
    const deltaY = (e.clientY - startY) * 0.5;
    
    setRotationX((prevRotation) => prevRotation + deltaX);
    setRotationY((prevRotation) => {
      // Limit vertical rotation to prevent flipping
      const newRotation = prevRotation + deltaY;
      return Math.max(-45, Math.min(45, newRotation));
    });
    
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    }
  };

  const closeHotspotInfo = () => {
    setActiveHotspot(null);
  };

  // Calculate 3D transform based on mouse drag
  const transformStyle = {
    transform: `rotateY(${rotationX}deg) rotateX(${-rotationY}deg)`,
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
      >
        <div
          className="w-full h-full transition-transform duration-100 transform-style-3d"
          style={transformStyle}
        >
          <div className="absolute inset-0 bg-cover bg-no-repeat bg-center transform-style-3d" style={{ backgroundImage: `url(${panoramaUrl})` }}>
            {/* This would normally be rendered by a proper panorama library */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className="panorama-hotspot"
                style={{
                  left: `${hotspot.position.x}%`,
                  top: `${hotspot.position.y}%`,
                }}
                onClick={() => handleHotspotClick(hotspot)}
                aria-label={`Информация о "${hotspot.title}"`}
              >
                <Info size={16} className="text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotspot Information Panel */}
      {activeHotspot && (
        <div
          className="panorama-info-card right-4 top-4 max-w-md"
          data-visible={!!activeHotspot}
        >
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

      {/* Simple navigation hints */}
      <div className="absolute bottom-4 left-4 glass px-3 py-2 rounded-full text-xs">
        Перемещайте мышью для обзора панорамы
      </div>
    </div>
  );
};

export default PanoramaViewer;
