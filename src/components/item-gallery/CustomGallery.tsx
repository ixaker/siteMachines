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
import PhotoViewer from './ui/PhotoViewer';

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

const CustomGallery: React.FC<ItemGalleryProps> = ({
  gallery,
  onChange,
  files,
  setFiles,
  mainImage,
  onChangeMainPhoto,
}) => {
  const [photo, setPhoto] = useState(gallery);
  const editor = useSelector(selectEditor);
  const [currentPhoto, setCurrentPhoto] = useState<GalleryItem>({ name: '', src: '', type: '' });
  const [zoomPhoto, setZoomPhoto] = useState(''); // Храним информацию об увеличенной версии
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Позиция мыши
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
    setZoomPhoto('');
  };

  useEffect(() => {
    if (photo.length > 0) {
      setCurrentPhoto(photo[0]);
    }
  }, [photo]);

  const handleClickShowPhoto = (e: React.MouseEvent<HTMLElement>) => {
    const id = Number(e.currentTarget.getAttribute('id')) || 0;
    setCurrentPhoto(gallery[id]);
  };

  const openPhotoViewer = () => {
    setIsViewerOpen(true);
  };

  const closePhotoViewer = () => {
    setIsViewerOpen(false);
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
      <PhotoViewer
        gallery={gallery || []}
        currentPhoto={currentPhoto}
        setCurrentPhoto={setCurrentPhoto}
        isOpen={isViewerOpen}
        onClose={closePhotoViewer}
      />
      <div className="w-full flex flex-col gap-5 max-w-[550px] overflow-x-scroll overflow-hidden">
        {!currentPhoto.src ? (
          <Skeleton variant="rectangular" width={550} height={400} />
        ) : (
          <>
            {currentPhoto.type.startsWith('image') ? (
              <div className="h-[350px] max-w-[550px] ">
                <Image
                  width={550}
                  height={350}
                  alt={`Machine`}
                  src={currentPhoto.src}
                  className="relative object-cover h-full w-full cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, currentPhoto.src)}
                  onMouseLeave={handleMouseLeave}
                  onClick={openPhotoViewer}
                  loading="lazy"
                />
              </div>
            ) : (
              <video
                className="h-[350px] sm:max-h-[350px] sm:min-h-[350px] w-full p-1 max-w-[550px] cursor-pointer object-cover  bg-[#f6f6f6]"
                loop
                muted
                controls
              >
                <source src={currentPhoto.src} />
              </video>
            )}
            {editor ? (
              <FormControlLabel
                control={
                  <Checkbox
                    id={currentPhoto.src}
                    checked={mainImage.replace(/\?v=.*$/, '') === currentPhoto.src.replace(/\?v=.*$/, '')} // Проверяем, выбрана ли эта фотография
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeMainPhoto(e.target.id);
                    }}
                    sx={{
                      color: '#1976d2',
                    }}
                  />
                }
                label={
                  mainImage.replace(/\?v=.*$/, '') === currentPhoto.src.replace(/\?v=.*$/, '')
                    ? 'Це фото є головним'
                    : 'Зробити головним фото'
                }
              />
            ) : (
              ''
            )}
          </>
        )}

        <ul className="flex gap-3 md:gap-5 overflow-x-scroll items-center pb-2">
          {editor && (
            <Button
              component="label"
              sx={{ bgcolor: '#e5e7eb', width: '100px', height: '70px' }}
              role={undefined}
              tabIndex={-1}
            >
              <AddAPhotoIcon />
              <VisuallyHiddenInput type="file" onChange={addPhoto} multiple />
            </Button>
          )}
          {photo.map((image, index) => (
            <li
              className="max-w-[100px] flex-shrink-0 relative "
              key={index}
              id={index.toString()}
              onClick={(e) => handleClickShowPhoto(e)}
              about={image.type.split('/')[0]}
            >
              {image.type.split('/')[0] === 'image' ? (
                <Image
                  alt={image.name}
                  src={image.src}
                  width={100}
                  height={70}
                  className="w-[100px] h-[70px] p-1"
                  loading="lazy"
                />
              ) : (
                <div className="relative">
                  <video about="Video" className="w-[100px] h-[70px] p-1  cursor-pointer object-cover" loop>
                    <source src={image.src} />
                  </video>

                  <div className="absolute top-1/2 left-1/2 transform- -translate-x-1/2 -translate-y-1/2 bg-black rounded-full p-1  bg-opacity-80">
                    <PlayArrowIcon
                      sx={{
                        fontSize: '30px',
                        color: 'white',
                      }}
                    />
                  </div>
                </div>
              )}
              {editor && (
                <div className="absolute top-0 right-0">
                  <IconButton onClick={() => removePhoto(index)}>
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </div>
              )}
              {currentPhoto.src !== image.src && (
                <div className="absolute w-full h-full bg-white top-0 left-0 opacity-60 cursor-pointer"></div>
              )}
            </li>
          ))}
        </ul>

        {zoomPhoto && (
          <div className="absolute z-10 pointer-events-none top-[25%] right-[5.5%] max-w-[50%] h-full max-h-[505px] w-full overflow-hidden bg-[#f6f6f6] hidden md:flex items-center justify-center">
            <Image
              loading="lazy"
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

export default CustomGallery;
