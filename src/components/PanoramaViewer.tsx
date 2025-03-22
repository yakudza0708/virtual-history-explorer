
import React, { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
  const hasInitialized = useRef(false);

  // Set up Pannellum with optimized configuration
  useEffect(() => {
    if (!panoramaRef.current || !window.pannellum || hasInitialized.current) return;
    
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

    // Optimize Pannellum configuration
    const pannellumViewer = window.pannellum.viewer(panoramaRef.current, {
      type: 'equirectangular',
      panorama: panoramaUrl,
      autoLoad: true,
      autoRotate: -1,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      hotSpots: pannellumHotspots,
      hfov: 100,
      minHfov: 50,
      maxHfov: 120,
      pitch: 0,
      yaw: 0,
      draggable: true,
      mouseZoom: true,
      keyboardZoom: true,
      showControls: true,
      friction: 0.15,
      dynamic: false, // Disable dynamic loading for better performance
      sceneFadeDuration: 500, // Faster scene transitions
      onLoad: () => {
        setIsLoading(false);
        toast("Панорама загружена", {
          duration: 1500,
        });
      },
      onError: (err: string) => {
        setIsLoading(false);
        toast.error("Ошибка загрузки", {
          description: "Проверьте подключение",
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
      if (pannellumViewer) {
        pannellumViewer.destroy();
      }
    };
  }, [panoramaUrl, hotspots, onHotspotClick]);

  // Update panorama when URL changes
  useEffect(() => {
    if (viewer && panoramaUrl) {
      setIsLoading(true);
      viewer.loadScene('default', { 
        panorama: panoramaUrl,
        hotSpots: hotspots.map(hotspot => ({
          id: hotspot.id,
          pitch: (hotspot.position.y - 50) * 0.9,
          yaw: (hotspot.position.x - 50) * 3.6,
          type: "info",
          text: hotspot.title,
          originalHotspot: hotspot
        }))
      }, () => {
        setIsLoading(false);
      });
    }
  }, [panoramaUrl, viewer]);

  const closeHotspotInfo = () => {
    setActiveHotspot(null);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[70vh] overflow-hidden rounded-lg shadow-lg bg-black/10">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div ref={panoramaRef} className="w-full h-full" />

      {/* Simplified Hotspot Information Panel */}
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
          /* Minimized CSS */
          .pnlm-container { background-color: #000 !important; }
          .pnlm-hotspot { height: 20px; width: 20px; border-radius: 10px; }
          .pnlm-hotspot-base.info { background-color: rgba(58, 68, 255, 0.7); border: 1px solid #fff; }
          .pnlm-hotspot:hover { background-color: rgba(58, 68, 255, 1); }
        `}
      </style>
    </div>
  );
};

export default PanoramaViewer;
