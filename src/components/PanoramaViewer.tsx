
import React, { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import 'pannellum/build/pannellum.css';

// We need to import Pannellum using this approach to avoid TypeScript errors
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
  hotspots: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  panoramaUrl, 
  hotspots,
  onHotspotClick
}) => {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewer, setViewer] = useState<any>(null);

  // Set up Pannellum when the component mounts
  useEffect(() => {
    if (!panoramaRef.current || !window.pannellum) return;
    
    setIsLoading(true);

    // Convert our hotspots to Pannellum format
    const pannellumHotspots = hotspots.map(hotspot => ({
      id: hotspot.id,
      pitch: (hotspot.position.y - 50) * 0.9, // Convert from percentage to pitch (-45 to 45 degrees)
      yaw: (hotspot.position.x - 50) * 3.6,   // Convert from percentage to yaw (-180 to 180 degrees)
      type: "info",
      text: hotspot.title,
      originalHotspot: hotspot // Store the original hotspot to use when clicked
    }));

    // Initialize Pannellum viewer
    const pannellumViewer = window.pannellum.viewer(panoramaRef.current, {
      type: 'equirectangular',
      panorama: panoramaUrl,
      autoLoad: true,
      autoRotate: -2, // Slow auto-rotation
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      hotSpots: pannellumHotspots,
      hfov: 100, // Horizontal field of view in degrees
      minHfov: 50,
      maxHfov: 120,
      pitch: 0,
      yaw: 0,
      draggable: true,
      mouseZoom: true,
      keyboardZoom: true,
      showControls: true,
      friction: 0.15, // Lower value provides smoother rotation
      onLoad: () => {
        setIsLoading(false);
        toast("Панорама загружена!", {
          description: "Используйте мышь для вращения и перемещения панорамы.",
          duration: 3000,
        });
      },
      onError: (err: string) => {
        setIsLoading(false);
        toast.error("Ошибка загрузки панорамы", {
          description: err || "Пожалуйста, попробуйте обновить страницу.",
        });
      }
    });

    // Handle hotspot clicks
    pannellumViewer.on('click', (event: MouseEvent) => {
      const clickedHotspot = pannellumViewer.getHotspotById(pannellumViewer.mouseEventToCoords(event));
      if (clickedHotspot && clickedHotspot.originalHotspot) {
        setActiveHotspot(clickedHotspot.originalHotspot);
        if (onHotspotClick) {
          onHotspotClick(clickedHotspot.originalHotspot);
        }
      }
    });

    setViewer(pannellumViewer);

    // Clean up on unmount
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [panoramaUrl, hotspots, onHotspotClick]);

  const closeHotspotInfo = () => {
    setActiveHotspot(null);
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
        ref={panoramaRef} 
        className="w-full h-full"
      />

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

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          
          /* Override some Pannellum styles for better integration */
          .pnlm-container {
            background-color: #000 !important;
          }
          
          .pnlm-hotspot {
            height: 26px;
            width: 26px;
            border-radius: 13px;
          }
          
          .pnlm-hotspot-base.info {
            background-color: rgba(58, 68, 255, 0.8);
            border: 2px solid #fff;
          }
          
          .pnlm-hotspot:hover {
            background-color: rgba(58, 68, 255, 1);
          }
        `}
      </style>
    </div>
  );
};

export default PanoramaViewer;
