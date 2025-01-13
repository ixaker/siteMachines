import { GalleryItem } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface PhotoViewerProps {
  gallery: GalleryItem[];
  isOpen: boolean;
  currentPhoto: GalleryItem;
  setCurrentPhoto: React.Dispatch<React.SetStateAction<GalleryItem>>;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ isOpen, currentPhoto, onClose, gallery, setCurrentPhoto }) => {
  const [currentIndex, setCurrentIndex] = useState(gallery.findIndex((photo) => photo.src === currentPhoto.src));
  console.log('gallery', gallery);
  useEffect(() => {
    setCurrentIndex(gallery.findIndex((photo) => photo.src === currentPhoto.src));
  }, [currentPhoto]);

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

  const nextImage = () => {
    const newIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setCurrentPhoto(gallery[newIndex]);
  };
  const prevImage = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
    setCurrentIndex(newIndex);
    setCurrentPhoto(gallery[newIndex]);
  };

  const handleClickDotEnv = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
    setCurrentPhoto(gallery[index]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50" onClick={onClose}>
        <div className="absolute top-1/2 left-1/2 transform- -translate-x-1/2 -translate-y-1/2 h-full w-full p-2">
          {currentPhoto.type.startsWith('image') || currentPhoto.type.length < 0 ? (
            <Image
              src={currentPhoto.src}
              alt="Photo"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
              fill
              loading="lazy"
            />
          ) : (
            <video loop muted controls className="object-cintent h-full absolute left-1/2 transform- -translate-x-1/2">
              <source src={currentPhoto.src} />
            </video>
          )}
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-1 py-1  hover:bg-gray-700"
          >
            <ArrowForwardIosIcon />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-1 py-1  hover:bg-gray-700"
          >
            <ArrowBackIosNewIcon />
          </button>

          <div className="flex gap-2 absolute left-1/2 bottom-4 transform -translate-x-1/2">
            {gallery.map((_, index) => (
              <div
                key={index}
                onClick={(e) => {
                  handleClickDotEnv(e, index);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                  currentIndex === index ? 'bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
