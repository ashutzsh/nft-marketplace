import React from 'react';
// Importing Hooks: A hook is something that provides extra functionality to a React.js application.
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes'; // This is going to give us information whether we currently have the light mode or dark mode turned on.

import Image from 'next/image'; // This is the Next.js version of the <img> tag
import Link from 'next/link'; // This is the Next.js version of the <a> tag

import images from '../assets'; // Importing images from assets folder
import Button from './Button';

const MenuItems = ({ isMobile, active, setActive }) => {
  // MenuItems is receiving props. We have destructured the props since it can receive only one props(object) and we wanted 3.
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/created-nft';
      case 2:
        return '/my-nfts';
      default: return '/';
    }
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {/* If isMobile then add two more classes: flex-col and h-full */}
      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, i) => ( // 1. item=Explore NFTs, i=0
        // 2. item=Listed NFTs, i=1
        // 3. item=My NFTs, i=2
        // Array[0] is Explore NFTs: Home page – only ‘/’ is added to the website URL on clicking Explore NFTs.
        // Array[1] is Listed NFTs: ‘/created-nft’ is added to the website URL. This takes us to Listed NFTs page
        // Array[2] is My NFTs: ‘/my-nfts’ is added to the website URL. This takes us to My NFTs page.

        <li // Inside li we are adding/displaying menu items to the webpage with a key as well.
          key={i}
          onClick={() => {
            setActive(item); // This will set the active menu item to the one that was clicked.
          }}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 
              ${active === item ? 'dark:text-white text-nft-black-1'
            : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
        ><Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

// Button Group Component
const ButtonGroup = ({ setActive, router }) => {
  const hasConnected = true;
  return hasConnected ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive(''); // Nothing will be active when this is clicked.

        router.push('/create-nft'); // This will redirect the user to the create-nft page.
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {}} // Empty for now. will be used later to connect to Metamask
    />
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme(); // Destructuring the theme and setTheme from the useTheme hook.
  // This will give us information whether we are currently using the light mode or dark mode.
  const [active, setActive] = useState('Explore NFTs'); // Setting the default active state to be Explore NFTs. This active and setActive properties is used below in <MenuItems> tag
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    // This is the logo
    <nav className="flexBetween w-full fixed p-4 z-10 flex-row border-b-4 dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flexCenter md:hidden curson-pointer" onClick={() => {}}>
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-1g ml-1">KryptoArt</p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex" onClick={() => {}}>
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      {/* Light/Dark Mode: */}
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-4">
          <input type="checkbox" className="checkbox" id="checkbox" onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" /> {/* This is the white ball that covers the sun or the moon */}
          </label>
        </div>

        {/* Menu Items: */}
        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
      </div>
      {/* Menu for mobile */}
      <div className="hidden md:flex ml-2">
        {isOpen
          ? (
            <Image
              src={images.cross}
              objectFit="contain"
              width={20}
              height={20}
              alt="close"
              onClick={() => setIsOpen(false)}
              className={theme === 'light' && 'filter invert'}
            />
          ) : (
            <Image
              src={images.menu}
              objectFit="contain"
              width={25}
              height={25}
              alt="menu"
              onClick={() => setIsOpen(true)}
              className={theme === 'light' && 'filter invert'}
            />
          )}

        {isOpen && (
        <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
          <div className="flex-1 p-4">
            <MenuItems active={active} setActive={setActive} isMobile />
          </div>
          <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1 m-auto">
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
