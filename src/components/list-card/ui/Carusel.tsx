import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

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
      modules={[Pagination, Autoplay, Navigation]}
      spaceBetween={1}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      pagination
      loop
    >
      {photos
        .filter((item) => item.type.includes('image'))
        .map((photo, index) => (
          <SwiperSlide key={index}>
            <Image width={350} height={200} src={photo.src} alt={photo.name} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default Carusel;
