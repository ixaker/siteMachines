import { GalleryItem } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface PhotoViewerProps {
  gallery: GalleryItem[];
  isOpen: boolean;
  currentPhoto: string;
  setCurrentPhoto: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ isOpen, currentPhoto, onClose, gallery, setCurrentPhoto }) => {
  const photoGallery = gallery.filter((item) => item.type.startsWith('image/'));
  const [differenceLenght, setDifferenceLenght] = useState<number>(0);

  const [currentIndex, setCurrentIndex] = useState(
    photoGallery.findIndex((photo) => photo.src === currentPhoto) + differenceLenght || 0
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setDifferenceLenght(gallery.length - photoGallery.length);
  }, [gallery]);

  const nextImage = () => {
    const newIndex = currentIndex < photoGallery.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setCurrentPhoto(photoGallery[newIndex]?.src || '');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50" onClick={onClose}>
        <div className="absolute top-1/2 left-1/2 transform- -translate-x-1/2 -translate-y-1/2 h-full w-full p-2">
          <Image
            src={currentPhoto}
            alt="Photo"
            className="object-cover absolute top-1/2 left-1/2 transform- -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            width={1000}
            height={800}
          />
          <button
            onClick={onClose}
            className="absolute top-[1%] right-[1%] text-white text-2xl bg-black bg-opacity-50 rounded-full px-1.5"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
