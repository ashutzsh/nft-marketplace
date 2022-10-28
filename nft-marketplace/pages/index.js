import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme, usetheme } from 'next-themes';
import { Banner, CreatorCard } from '../components';

import images from '../assets';
import makeId from '../utils/makeId';

const Home = () => {
  const [hideButtons, sethideButtons] = useState(false);
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      sethideButtons(false);
    } else {
      sethideButtons(true);
    }
  };
  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Discover, Collect, and Sell Extraordinary NFTs"
          childStyles="md:text-4xl max-w-3xl ml-10 md:ml-0 sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        {/* Top Sellers */}
        <div className="lg:w-4/5 xl:w-4/5 md:w-auto lg:m-auto">
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Top Sellers</h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - ((i * 0.15) * (i * 0.25))}
                />
              ))}
              {!hideButtons && (
                <>
                  <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 curson-pointer left-0">
                    <Image
                      src={images.left}
                      layout="fill"
                      objectFit="contain"
                      alt="left-arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                  <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 curson-pointer right-0">
                    <Image
                      src={images.right}
                      layout="fill"
                      objectFit="contain"
                      alt="right-arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;

