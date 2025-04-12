
import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from "sonner";
import 'pannellum/build/pannellum.css';

// Import Pannellum
declare const window: Window & {
  pannellum: any;
};

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
  hotspots?: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
  autoRotate?: boolean;
  initialHfov?: number;  // Initial horizontal field of view (zoom level)
  height?: string;      // Container height
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  panoramaUrl, 
  hotspots = [],
  onHotspotClick,
  autoRotate = true,
  initialHfov = 100,
  height = "500px"
}) => {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewer, setViewer] = useState<any>(null);
  const hasInitialized = useRef(false);

  // Clear initialization flag when panorama URL changes
  useEffect(() => {
    if (panoramaUrl) {
      hasInitialized.current = false;
    }
  }, [panoramaUrl]);

  // Set up Pannellum with optimized configuration
  useEffect(() => {
    // Early return if conditions aren't met
    if (!panoramaRef.current || !window.pannellum || hasInitialized.current || !panoramaUrl) return;
    
    hasInitialized.current = true;
    setIsLoading(true);

    // Convert hotspots to Pannellum format
    const pannellumHotspots = hotspots.map(hotspot => ({
      id: hotspot.id,
      pitch: (hotspot.position.y - 50) * 0.9,
      yaw: (hotspot.position.x - 50) * 3.6,
      type: "info",
      text: hotspot.title,
      originalHotspot: hotspot
    }));

    try {
      // Initialize Pannellum with optimal performance settings
      const pannellumViewer = window.pannellum.viewer(panoramaRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad: true,
        autoRotate: autoRotate ? -1 : 0,
        compass: false,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        hotSpots: pannellumHotspots,
        hfov: initialHfov,
        minHfov: 50,
        maxHfov: 120,
        friction: 0.15,
        mouseZoom: true,
        touchPanEnabled: true,
        draggable: true,
        disableKeyboardCtrl: false,
        dynamic: false,
        sceneFadeDuration: 300,
        onLoad: () => {
          setIsLoading(false);
          toast.success("Панорама загружена", {
            duration: 1500,
          });
        },
        onError: (err: string) => {
          console.error("Pannellum error:", err);
          setIsLoading(false);
          toast.error("Ошибка загрузки панорамы", {
            description: "Проверьте URL изображения",
          });
        }
      });

      // Handle hotspot clicks
      if (hotspots.length > 0) {
        pannellumViewer.on('click', (event: MouseEvent) => {
          const clickedHotspot = pannellumViewer.getHotspotById(pannellumViewer.mouseEventToCoords(event));
          if (clickedHotspot && clickedHotspot.originalHotspot) {
            setActiveHotspot(clickedHotspot.originalHotspot);
            if (onHotspotClick) {
              onHotspotClick(clickedHotspot.originalHotspot);
            }
          }
        });
      }

      setViewer(pannellumViewer);

      // Clean up on unmount
      return () => {
        if (pannellumViewer) {
          pannellumViewer.destroy();
        }
      };
    } catch (error) {
      console.error("Failed to initialize panorama:", error);
      setIsLoading(false);
      toast.error("Ошибка инициализации панорамы");
    }
  }, [panoramaUrl, hotspots, onHotspotClick, autoRotate, initialHfov]);

  const closeHotspotInfo = () => {
    setActiveHotspot(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-black/5" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div ref={panoramaRef} className="w-full h-full" />

      {/* Hotspot Information Panel */}
      {activeHotspot && (
        <div className="absolute right-4 top-4 max-w-xs bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-md z-20">
          <button
            onClick={closeHotspotInfo}
            className="absolute right-2 top-2 text-foreground/80 hover:text-foreground"
            aria-label="Закрыть"
          >
            <X size={14} />
          </button>
          
          <h3 className="text-base font-medium mb-1">{activeHotspot.title}</h3>
          
          {activeHotspot.image && (
            <img
              src={activeHotspot.image}
              alt={activeHotspot.title}
              className="w-full h-auto object-cover mb-2 rounded"
              loading="lazy"
            />
          )}
          
          <p className="text-xs text-foreground/80 mb-2">{activeHotspot.description}</p>
          
          {activeHotspot.link && (
            <a
              href={activeHotspot.link}
              className="text-xs text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Подробнее
            </a>
          )}
        </div>
      )}

      <style>
        {`
        .pnlm-container { background-color: transparent !important; }
        .pnlm-hotspot { height: 20px; width: 20px; border-radius: 10px; }
        .pnlm-hotspot-base.info { background-color: rgba(58, 68, 255, 0.7); border: 1px solid #fff; }
        .pnlm-hotspot:hover { background-color: rgba(58, 68, 255, 1); }
        `}
      </style>
    </div>
  );
};

export default PanoramaViewer;
