import React from "react";
import { motion } from "framer-motion";

export default function AnimatedSvg() {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <motion.svg
      width="93"
      height="100"
      viewBox="0 0 93 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="filter0_dd_5_37"
          x="0.0341797"
          y="0.0704651"
          width="92.4296"
          height="99.2354"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="2"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_5_37"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5_37"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_5_37"
            result="effect2_dropShadow_5_37"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_5_37"
            result="shape"
          />
        </filter>
      </defs>
      <motion.g
        filter="url(#filter0_dd_5_37)"
        initial="hidden"
        animate="visible"
      >
        {/* Animate each path */}
        <motion.path
          d="M9.07494 56.1424C9.09052 55.7685 8.89073 54.1399 9.68501 55.2578C12.8947 59.7751 14.775 65.5921 16.5178 70.7841C18.3453 76.2285 20.473 81.446 22.4355 86.7986C22.9095 88.0912 23.1576 89.2783 23.4727 87.0731C24.2732 81.4691 23.604 75.7987 24.1438 70.1741C26.3456 47.2288 37.4713 27.3627 57.0572 14.8709C60.9913 12.3618 80.2161 1.62162 83.1988 10.5699"
          stroke="#113042"
          strokeWidth="2"
          strokeLinecap="square"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M32.1357 76.4578C32.1357 75.2782 32.1357 70.8795 32.1357 74.5056C32.1357 76.7283 32.1768 88.582 34.881 82.4975"
          stroke="#113042"
          strokeWidth="2"
          strokeLinecap="square"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M31.0376 66.0256C28.0901 69.3415 34.9633 72.6086 35.3386 67.9168C35.7694 62.5312 26.6032 65.9837 31.0376 70.4181"
          stroke="#113042"
          strokeWidth="2"
          strokeLinecap="square"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M40.9208 53.397C40.9208 50.1165 40.9208 51.2613 40.9208 53.7631C40.9208 59.5486 40.9208 65.3341 40.9208 71.1197C40.9208 71.5408 41.3401 78.9591 40.2497 78.9591C39.3206 78.9591 39.9923 74.6869 40.1277 74.2615C42.3574 67.2539 50.3314 71.798 47.2655 78.105C46.1403 80.4197 43.3031 83.4262 40.4327 83.0161C39.0256 82.8151 40.2875 81.6105 40.9208 81.3994"
          stroke="#113042"
          strokeWidth="2"
          strokeLinecap="square"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M55.7455 73.1634C55.7455 66.8654 51.3574 72.6077 52.6952 74.6886C53.2199 75.5049 58.1313 76.2958 56.6912 77.5559C55.1934 78.8665 52.1888 79.8178 50.2549 80.3013"
          stroke="#113042"
          strokeWidth="2"
          strokeLinecap="square"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.g>
    </motion.svg>
  );
}
