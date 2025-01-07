'use client';

import { GalleryItem } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import { Button, Checkbox, FormControlLabel, IconButton, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ItemGalleryProps {
  gallery: GalleryItem[];
  onChange: (updatedPhoto: { src: string; type: string; name: string }[]) => void;
  onChangeMainPhoto: (val: string) => void;
  files: File[];
  setFiles: (param: File[]) => void;
  mainImage: string;
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

const ItemGallery: React.FC<ItemGalleryProps> = ({
  gallery,
  onChange,
  files,
  setFiles,
  mainImage,
  onChangeMainPhoto,
}) => {
  const [photo, setPhoto] = useState(gallery);
  const editor = useSelector(selectEditor);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');

  useEffect(() => {
    console.log('currentPhoto', currentPhoto.includes('jpg'));
  });

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

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const combinedFiles = [...files, ...Array.from(e.target.files)];
    setFiles(combinedFiles);

    const filesArray = Array.from(e.target.files).map((file) => ({
      src: URL.createObjectURL(file),
      type: file.type, // Генерируем временный URL для отображения
      name: file.name,
    }));

    const updated = [...photo, ...filesArray];

    setPhoto(updated);
    onChange(updated);
  };

  const removePhoto = (index: number) => {
    const updated = photo.filter((_, i) => i !== index);
    setPhoto(updated);
    onChange(updated);
  };

  return (
    <section>
      <div className="w-auto flex flex-col gap-5 ">
        {!currentPhoto ? (
          <Skeleton variant="rectangular" width={500} height={350} />
        ) : (
          <>
            {currentPhoto.includes('jpg') ? (
              <Image
                width={500}
                height={350}
                alt={`Machine`}
                src={currentPhoto}
                className="relative max-h-[350px] min-h-[350px] object-contain"
                onMouseMove={(e) => handleMouseMove(e, currentPhoto)}
                onMouseLeave={handleMouseLeave}
              />
            ) : (
              <video
                className="max-h-[350px] min-h-[350px] p-1 h-full cursor-pointer  bg-[#f6f6f6]"
                autoPlay
                loop
                muted
                controls
              >
                <source src={currentPhoto} />
              </video>
            )}
            {editor ? (
              <FormControlLabel
                control={
                  <Checkbox
                    id={currentPhoto}
                    checked={mainImage === currentPhoto} // Проверяем, выбрана ли эта фотография
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeMainPhoto(e.target.id);
                    }}
                    sx={{
                      color: '#1976d2',
                    }}
                  />
                }
                label={mainImage === currentPhoto ? 'Це фото є головним' : 'Зробити головним фото'}
              />
            ) : (
              ''
            )}
          </>
        )}

        <div className=".scrol flex gap-5 overflow-hidden overflow-x-scroll items-center max-w-[500px] pb-3">
          {photo.map((image, index) => (
            <div
              key={index}
              id={image.src}
              onClick={(e) => handleClickShowPhoto(e)}
              className="relative w-[100px] h-[70px]"
            >
              {image.type.split('/')[0] === 'image' ? (
                <div>
                  <Image
                    className="cursor-pointer p-1 min-h-[70px] min-w-[100px] bg-[#f6f6f6] object-contain"
                    alt="Photo"
                    src={image.src}
                    width={100}
                    height={70}
                    decoding="async"
                  />
                </div>
              ) : (
                <video className="min-h-[70px] min-w-[100px] p-1 h-full cursor-pointer  bg-[#f6f6f6]" autoPlay loop>
                  <source src={image.src} type={image.type} />
                </video>
              )}
              {editor ? (
                <div className="relative">
                  <IconButton onClick={() => removePhoto(index)} sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>

                  <div id={image.src} className="absolute z-[90] flex  bottom-5"></div>
                </div>
              ) : (
                ''
              )}
              {currentPhoto !== image.src && (
                <div className="absolute w-full h-full bg-white top-0 left-0 opacity-60 cursor-pointer"></div>
              )}
            </div>
          ))}
          {editor ? (
            <Button
              component="label"
              sx={{ minHeight: '70px', width: '100px', bgcolor: '#e5e7eb' }}
              role={undefined}
              tabIndex={-1}
              className="min-h-[70px] min-w-[100px]"
            >
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
              width={500}
              height={405}
              className="w-full h-full object-cover overflow-visible max-w-[500px] max-h-[405px]"
              style={{
                transform: `scale(2)`,
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
