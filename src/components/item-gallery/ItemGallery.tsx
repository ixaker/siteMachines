'use client';

import { GalleryItem } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import { Button, styled } from '@mui/material';

interface ItemGalleryProps {
  gallery: GalleryItem[];
  onChange: (updatedPhoto: { src: string }[]) => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  zIndex: 10,
});

const ItemGallery: React.FC<ItemGalleryProps> = ({ gallery, onChange }) => {
  const [photo, setPhoto] = useState(gallery);
  const editor = useSelector(selectEditor);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');

  const [zoomPhoto, setZoomPhoto] = useState(''); // Храним информацию об увеличенной версии
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Позиция мыши

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, src: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ x, y });
    setZoomPhoto(src);
  };

  useEffect(() => {
    setPhoto(gallery);
  }, [gallery]);

  const handleMouseLeave = () => {
    setZoomPhoto(''); // Убираем увеличенное изображение
  };

  useEffect(() => {
    if (photo.length > 0) {
      setCurrentPhoto(photo[0].src);
    }
  }, [photo]);

  const handleClickShowPhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    const src = e.currentTarget.getAttribute('id') || '';
    setCurrentPhoto(src);
  };

  // const addPhoto = (e) => {
  //   const updated = [...photo, { src: e.target.files }];
  //   setPhoto(updated);
  //   onChange(updated);
  // };

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files).map((file) => ({
      src: URL.createObjectURL(file), // Генерируем временный URL для отображения
    }));

    const updated = [...photo, ...filesArray];
    setPhoto(updated);
    onChange(updated);
  };

  return (
    <section>
      <div className="w-auto flex gap-5 max-h-[400px]">
        {!currentPhoto ? (
          <Skeleton variant="rectangular" width={505} height={505} />
        ) : (
          <Image
            width={500}
            height={400}
            alt={`Machine`}
            src={currentPhoto}
            className="relative max-h-[400px]"
            onMouseMove={(e) => handleMouseMove(e, currentPhoto)}
            onMouseLeave={handleMouseLeave}
          />
        )}

        <div className=".scrol flex gap-5 overflow-hidden overflow-y-scroll flex-col pr-3">
          {photo.map((image, index) => (
            <div key={index} id={image.src} onClick={(e) => handleClickShowPhoto(e)} className="relative">
              <Image
                className="cursor-pointer p-1 bg-[#f6f6f6]"
                alt="Photo"
                src={image.src}
                width={100}
                height={100}
                decoding="async"
              />

              {currentPhoto !== image.src && (
                <div className="absolute w-full h-full bg-white top-0 left-0 opacity-60 cursor-pointer"></div>
              )}
            </div>
          ))}
          {editor ? (
            <Button component="label" sx={{ minHeight: '77px', bgcolor: '#e5e7eb' }} role={undefined} tabIndex={-1}>
              <AddAPhotoIcon />
              <VisuallyHiddenInput type="file" onChange={addPhoto} multiple />
            </Button>
          ) : (
            ''
          )}
        </div>

        {zoomPhoto && (
          <div className="absolute z-10 pointer-events-none top-[25%] right-[11.5%] max-w-[50%] h-full max-h-[505px] w-full overflow-hidden bg-[#f6f6f6] flex items-center justify-center">
            <Image
              src={zoomPhoto}
              alt="Zoomed Photo"
              width={505}
              height={505}
              className="w-full h-full object-cover max-w-[500px] max-h-[405px]"
              style={{
                transform: `scale(3)`, // Масштабируем изображение
                transformOrigin: `${zoomPosition.x}px ${zoomPosition.y}px`, // Центрируем масштаб в точке курсора
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemGallery;
