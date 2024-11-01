import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import destinationImages, { photo1 } from '../assets/images';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import { Link } from 'react-router-dom';

function Home({ isLogedIn }) {
  const imageList = Object.values(destinationImages);
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
    <div className="overflow-auto">
      <div className="h-screen">
        <Swiper
          modules={[Navigation, Scrollbar, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          loop={true}
          scrollbar={{ draggable: true }}
          style={{ height: '100%' }}
          effect={"cube"}
        >
          {randomizedImages.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 p-4 rounded-2xl flex flex-col items-center justify-center">
                  <h1 className="text-white text-4xl md:text-7xl home-title font-bold text-shadow-md text-center max-w-xs md:max-w-xl">
                    {isLogedIn ? `Flights from ${city} to ${image.name}` : `Flights from ${city} to ${image.name}`}
                  </h1>
                  <button className="text-xl mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                    Travel to {image.name}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        className="flex flex-col items-center min-h-screen justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${photo1})` }}
      >
        <div className="bg-black bg-opacity-50 p-4 rounded-2xl flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-7xl home-title font-bold text-shadow-md text-center max-w-xs md:max-w-xl">
            Explore Our Destinations
          </h1>
          <div className="text-center text-white max-w-lg mx-5">
            <p className="text-lg md:text-xl mb-5">
              Discover breathtaking locations around the world. Our agency offers tailor-made travel packages for every taste. From luxury beach resorts to immersive cultural experiences, we’ve got it all.
            </p>
            <Link to="/destinations" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
              View Destinations
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Home;
