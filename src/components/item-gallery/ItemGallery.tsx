import { GalleryItem } from "@/types/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { selectEditor } from "@/store/slice/adminSlice";

interface ItemGalleryProps {
  gallery: GalleryItem[];
}

const ItemGallery: React.FC<ItemGalleryProps> = ({ gallery }) => {
  const editor = useSelector(selectEditor);
  const [currentPhoto, setCurrentPhoto] = useState<string>("");

  const [zoomPhoto, setZoomPhoto] = useState(""); // Храним информацию об увеличенной версии
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Позиция мыши

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    src: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ x, y });
    setZoomPhoto(src);
  };

  const handleMouseLeave = () => {
    setZoomPhoto(""); // Убираем увеличенное изображение
  };

  useEffect(() => {
    if (gallery.length > 0) {
      setCurrentPhoto(gallery[0].src);
    }
  }, [gallery]);

  const handleClickShowPhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    const src = e.currentTarget.getAttribute("id") || "";
    setCurrentPhoto(src);
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
          {gallery.map((image, index) => (
            <div
              key={index}
              id={image.src}
              onClick={(e) => handleClickShowPhoto(e)}
              className="relative"
            >
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
            <>
              <div className="flex justify-center items-center w-[100px] min-h-[77px] bg-[#f6f6f6] cursor-pointer">
                <AddAPhotoIcon />
              </div>
            </>
          ) : (
            ""
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
