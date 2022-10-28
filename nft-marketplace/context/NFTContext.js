import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal'; // It is going to allow us to connect to Metamask
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressABI } from './constants';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

// Whenever we use React Context you have to export const a provider in this case we are calling it NFTProvider
// export const NFTProvider = ({ children }) => {

// };
// If we call <NFTProvider /> like this the children is going to be empty.
/* But if we call it like this:
<NFTProvider>
<span>Hello</span>
<span>Ashu</span>
</NFTProvider>
then children is going contain everything inside the NFTProvider tags: both span elements. We are going to use this <NFTProvider> as a wrapper to wrap the entire React application and every single component inside of it will have access to our Blockchain state. */
export const NFTProvider = ({ children }) => {
  const [currentAccount, setcurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    // window.ethereum: ethereum is a function added to window object by metamask. If it is not there that means metamask is not installed.
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      // accounts.length to check if there is an account, then:
      setcurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }

    console.log({ accounts });
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setcurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      // the file is going to come from the file upload we created previously
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS');
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    // router will redirect us to the homepage once an NFT is created
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    // Means if there is no name or if there is no description or if there is no price or if there is no fileUrl (no image) then go out of the function. We dont want to continue with it.
    // If if is not true then: create a new string from the object containing the entireity of the information of our nft
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const added = await client.add(data);

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // After the file is uploaded to ipfs then we are going to take the 'url' and save it on polygon
      await createSale(url, price); // This is pushing our created nft to the marketplace

      router.push('/'); // Pushing to the homepage
    } catch (error) {
      console.log('Error uploading file to IPFS');
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal(); // connect metamask to our smart contract
    const connection = await web3Modal.connect(); // Establishing a connection
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner(); // Signer is the one who is creating the NFT.

    // We are using values that are human readable (eg: 0.025 ETH) but ethereum works with values called wei (which has a lot of zeros (e.g.: 0.025 ETH = 25000000000000000)). Wei is what MetaMask reads.
    const price = ethers.utils.parseUnits(formInputPrice, 'ether'); // converting ether to wei
    const contract = fetchContract(signer); // Fetching our smart contract. fetchContract is a function that wea re gonna create because we'll have to fetch it quite often: for every single function that we create.

    const listingPrice = await contract.getListingPrice(); // Getting our listing price from our smart contract. We used the await keyword because getting something from our contract takes time. It is not instantaneous.

    const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait(); // It takes some time for everything to be written down in our blockchain
  };

  // Fetching the created NFT on the homepage hot bids section
  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider); // Provider instead of signer becacause we want to fetch all of the nfts not only nfts for a specific person

    const data = await contract.fetchMarketItems();
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether'); // converting wei to ether

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));
    return items;
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs }}>
      {children}
    </NFTContext.Provider>
  );
};
