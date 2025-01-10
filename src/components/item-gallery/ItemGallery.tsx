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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
  const [currentType, setCurrentType] = useState<string>('');
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
      setCurrentType(photo[0].type.split('/')[0]);
    }
  }, [photo]);

  const handleClickShowPhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    const src = e.currentTarget.getAttribute('id') || '';
    const about = e.currentTarget.getAttribute('about') || '';
    setCurrentPhoto(src);
    setCurrentType(about);
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
      <div className="w-auto max-w-[550px] flex flex-col gap-5 ">
        {!currentPhoto ? (
          <Skeleton variant="rectangular" width={550} height={400} />
        ) : (
          <>
            {currentType === 'image' ? (
              <div className="h-[350px] max-w-[550px]">
                <Image
                  width={550}
                  height={400}
                  alt={`Machine`}
                  src={currentPhoto}
                  className="relative  object-contain"
                  onMouseMove={(e) => handleMouseMove(e, currentPhoto)}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            ) : (
              <video
                className="sm:max-h-[350px] sm:min-h-[350px] w-full p-1 max-w-[550px] cursor-pointer  bg-[#f6f6f6]"
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
                    checked={mainImage.replace(/\?v=.*$/, '') === currentPhoto.replace(/\?v=.*$/, '')} // Проверяем, выбрана ли эта фотография
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeMainPhoto(e.target.id);
                    }}
                    sx={{
                      color: '#1976d2',
                    }}
                  />
                }
                label={
                  mainImage.replace(/\?v=.*$/, '') === currentPhoto.replace(/\?v=.*$/, '')
                    ? 'Це фото є головним'
                    : 'Зробити головним фото'
                }
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
              about={image.type.split('/')[0]}
              className="relative w-[100px] h-[70px]"
            >
              {image.type.split('/')[0] === 'image' ? (
                <div className="h-[70px] w-[100px]">
                  <Image
                    className="cursor-pointer p-1 w-full h-full bg-[#f6f6f6] object-cover"
                    alt="Image"
                    about="Image"
                    src={image.src}
                    width={100}
                    height={70}
                    decoding="async"
                  />
                </div>
              ) : (
                <div>
                  <video
                    about="Video"
                    className="max-h-[70px] max-w-[100px] p-1 h-full cursor-pointer relative object-cover"
                    autoPlay
                    loop
                  >
                    <source src={image.src} />
                  </video>
                  <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full bg-nonne rounded-lg shadow-lg ">
                    <div className="bg-black rounded-full p-[3px] bg-opacity-50 opacity-95">
                      <PlayArrowIcon
                        sx={{
                          fontSize: '30px',
                          color: 'white',
                        }}
                      />
                    </div>
                  </div>
                </div>
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
          <div className="absolute z-10 pointer-events-none top-[25%] right-[5.5%] max-w-[50%] h-full max-h-[505px] w-full overflow-hidden bg-[#f6f6f6] hidden md:flex items-center justify-center">
            <Image
              src={zoomPhoto}
              alt="Zoomed Photo"
              width={500}
              height={405}
              className="w-full h-full object-cover overflow-visible max-w-[500px] max-h-[405px]"
              style={{
                transform: `scale(3)`,
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
