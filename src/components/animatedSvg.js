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
      width="170"
      height="170"
      viewBox="0 0 383 223"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="filter0_d_16_26"
          x="0.746658"
          y="0.460472"
          width="381.584"
          height="221.854"
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
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_16_26"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_16_26"
            result="shape"
          />
        </filter>
      </defs>
      <motion.g filter="url(#filter0_d_16_26)">
        <motion.path
          d="M11.9539 100.36C11.7537 99.9971 5.30567 89.9955 7.04376 89.8464C12.6547 89.3649 18.5474 104.418 20.603 107.781C37.8438 135.982 53.1162 165.248 70.6242 193.271"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M74.4134 194.283C74.4134 193.413 73.7663 192.405 73.4919 191.586C71.0457 184.283 71.4283 175.918 71.8844 168.365C73.5426 140.912 86.9909 118.131 102.761 96.5562C122.799 69.1438 147.419 40.9868 178.005 25.026C211.647 7.47044 250.371 -1.01197 288.252 3.78705C318.505 7.61952 356.502 22.3877 372.067 50.3368C388.695 80.1939 352.773 109.077 330.815 123.652C273.241 161.865 207.478 187.919 143.172 212.314"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M115.543 151.105C114.336 148.164 113.725 148.399 113.792 151.457C113.949 158.618 115.341 167.445 118.78 173.758"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M108.24 127.163C106.012 121.473 106.689 129.06 108.712 129.65C113.045 130.916 107.312 112.891 107.312 119.403"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M129.044 123.187C127.631 120.821 123.994 117.734 123.547 114.967C123.413 114.14 123.702 110.224 123.828 110.717C126.048 119.385 126.747 128.568 128.539 137.343C130.158 145.272 133.56 153.836 133.56 162.006C133.56 167.522 133.774 150.806 135.529 145.577C137.018 141.14 142.604 130.971 148.542 136.678C153.994 141.919 155.903 152.066 151.16 158.156C149.706 160.023 137.535 173.9 136.07 167.933"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M157.676 111.921C157.404 111.132 151.6 99.7227 151.27 103.293C149.669 120.612 160.547 139.545 166.229 155.34C168.361 161.267 167.895 153.133 167.941 150.916C168.071 144.685 167.574 136.762 170.371 131.003C173.596 124.363 176.323 134.74 177.191 137.434C178.987 143.01 181.398 149.625 187.915 150.565"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M206.384 139.736C200.984 139.736 205.479 135.28 204.757 130.594C204.355 127.985 201.013 125.229 198.718 127.663C195.413 131.168 194.077 137.561 193.922 142.213C193.536 153.763 204.276 140.941 205.375 135.884C206.938 128.688 205.925 137.892 209.998 141.322"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M214.163 127.721C209.912 122.936 211.388 120.652 218.262 122.569C220.443 123.178 231.477 132.798 232.263 132.317C234.859 130.726 232.733 112.913 232.733 109.852C232.733 104.419 232.733 120.718 232.733 126.151"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M255.92 118.199C255.92 115.861 259.861 115.608 260.727 112.415C264.202 99.5977 248.472 114.715 246.705 120.089C245.064 125.08 248.893 127.727 253.38 125.168C257.577 122.774 259.786 117.355 261.223 112.995C263.807 105.158 265.07 114.779 270.901 117.101"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M274.242 105.198C274.099 102.576 271.384 98.4893 275.723 97.847C280.328 97.1652 280.535 102.917 280.694 106.214C280.783 108.057 280.509 115.633 281.662 109.67C282.747 104.057 284.252 93.2978 290.35 90.6411C298.608 87.043 302.571 109.631 310.422 101.689C312.821 99.2629 313.922 91.5597 316.835 90.242C317.307 90.0285 317.985 93.2489 318.137 93.6366C319.075 96.025 320.534 98.1095 322.222 100.019"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M308.146 67.1019C305.771 64.8582 306.036 69.4992 306.981 70.5198C311.733 75.6514 311.336 55.2774 306.114 69.5956"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.g>
    </motion.svg>
  );
}
