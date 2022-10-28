import React from 'react';

const Banner = ({ name, childStyles, parentStyles }) => (
  <div className={`relative w-4/5 flex m-auto items-center z-0 overflow-hidden nft-gradient ${parentStyles}`}>
    <p className={`font-bold text-5xl font-poppins leading-70 dark:text-white text-nft-black-3 ${childStyles}`}>{name}</p>
    {/* Bubbles */}
    <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 -z-5" />
    <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-1 -z-5" />
  </div>
);

export default Banner;

