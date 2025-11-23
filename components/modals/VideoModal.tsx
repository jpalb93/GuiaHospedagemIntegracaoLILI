import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  isVertical?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, isVertical = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col items-center justify-center p-4 animate-fadeIn backdrop-blur-md">
       <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-3 bg-white/10 rounded-full transition-colors z-50"
      >
        <X size={24} />
      </button>

      <div className={`
        w-full 
        bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10 relative
        ${isVertical 
          ? 'max-w-[350px] aspect-[9/16] max-h-[80vh]' 
          : 'max-w-4xl aspect-video'
        }
      `}>
        <iframe 
          src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`} 
          title="Video Instruction"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;