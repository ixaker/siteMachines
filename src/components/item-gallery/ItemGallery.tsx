import { GalleryItem, MediaType } from "@/types/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ItemGalleryProps {
  gallery: GalleryItem[];
}

const ItemGallery: React.FC<ItemGalleryProps> = ({ gallery }) => {
  const [currentPhoto, setCurrentPhoto] = useState<string>("");

  useEffect(() => {
    if (gallery.length > 0) {
      setCurrentPhoto(gallery[0].src);
    }
  }, [gallery]);

  const handleClickShowPhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    const src = e.currentTarget.getAttribute("id") || "";
    setCurrentPhoto(src);
    console.log(src);
  };

  return (
    <section>
      <div className="w-auto flex gap-5 max-h-[500px]">
        <Image width={500} height={400} alt={`Machine`} src={currentPhoto} />

        <div className=".scrol flex gap-5 overflow-hidden overflow-y-scroll flex-col pr-3">
          {gallery.map((image, index) => (
            <div
              id={image.src}
              onClick={(e) => handleClickShowPhoto(e)}
              className="relative"
            >
              <Image
                className="cursor-pointer p-1 bg-[#f6f6f6]"
                key={index}
                alt="Photo"
                src={image.src}
                width={100}
                height={100}
              />{" "}
              {currentPhoto !== image.src && (
                <div className="absolute w-full h-full bg-white top-0 left-0 opacity-60 cursor-pointer"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemGallery;
