import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const photos = [
  {
    src: "https://drive.google.com/file/d/1m1jB2XhanEWl-O9RP39IDciGitGkQ0wi/view?usp=sharing", // Replace with your own image URLs
    caption: "Sunflower",
  },
  {
    src: "https://drive.google.com/file/d/1kawDfu3q1zYZvr-mY07Sc7h0GYN16R1B/view?usp=sharing",
    caption: "Trek",
  },
  {
    src: "https://drive.google.com/file/d/1pCvVkaAOPJMNDMk9P5KnhIF5yq2B76DT/view?usp=drive_link",
    caption: "Sunset",
  },
];

export default function PhotographyPortfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <header className="mb-12 text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-gray-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Photography Portfolio
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          A glimpse into my world through the lens.
        </motion.p>
      </header>
      
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">Featured Photos</h2>
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          className="rounded-lg shadow-2xl overflow-hidden"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={photo.src} alt={photo.caption} className="rounded-lg" />
              <p className="absolute bottom-0 bg-black bg-opacity-50 text-white p-4 w-full text-center text-lg font-medium">
                {photo.caption}
              </p>
            </motion.div>
          ))}
        </Carousel>
      </section>
      
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">Follow Me on Instagram</h2>
        <p className="text-gray-600 mb-6">Check out my latest captures on Instagram!</p>
        <motion.a
          href="https://www.instagram.com/yourinstagramhandle" // Replace with your Instagram profile
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.1 }}
        >
          <Instagram className="w-6 h-6 mr-2" /> Visit My Instagram
        </motion.a>
      </section>
    </div>
  );
}
