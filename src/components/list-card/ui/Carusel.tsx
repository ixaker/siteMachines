import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

interface Photo {
  src: string;
  name: string;
  type: string;
}

interface CaruselProps {
  photos: Photo[];
}

const Carusel: React.FC<CaruselProps> = ({ photos }) => {
  return (
    <Swiper
      className="block sm:hidden"
      modules={[Pagination, Navigation]}
      spaceBetween={1}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation
      loop
    >
      {photos
        .filter((item) => item.type.includes('image'))
        .map((photo, index) => (
          <SwiperSlide key={index}>
            {photo.src.length > 0 ? (
              <Image
                width={350}
                height={200}
                src={photo.src}
                alt={photo.name}
                className="w-full h-auto object-cover"
                loading={`${index === 0 ? 'eager' : 'lazy'}`}
                decoding={`${index === 0 ? 'sync' : 'async'}`}
              />
            ) : (
              <Skeleton variant="rectangular" animation="wave" sx={{ width: '350px', height: '200px' }} />
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default Carusel;
