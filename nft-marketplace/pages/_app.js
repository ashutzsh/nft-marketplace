// _app.js file is for reusable code

import { ThemeProvider } from 'next-themes'; // This is for toggling light/dark mode
import Script from 'next/script'; // In NextJs we dont use lowercase script component so we are importing NextJS' custom Script component
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => ( // This component is going to be on every single page: Header and Footer
  <ThemeProvider attribute="class">
    {/* attribute='class' means we are going to change light/dark mode depending on different classes */}
    <div>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/9d976c394b.js" crossOrigin="anonymous" />
    {/* Importing FontAwesome  */}

  </ThemeProvider>
);

export default MyApp;

