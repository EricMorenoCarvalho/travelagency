import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import images from '../assets/images';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';

function Home() {
  const imageList = Object.values(images);
  const [city] = useState(localStorage.getItem('city') || "");

  const randomizeArray = (arr) => {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const randomizedImages = randomizeArray(imageList);

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4500 }}
        loop={true}
        scrollbar={{ draggable: true }}
        style={{ height: '100vh' }}
      >
        {randomizedImages.map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-4xl md:text-7xl home-title font-bold text-shadow-md text-center max-w-xs md:max-w-xl">
                Flights from {city} to {image.name}
              </h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Home;
