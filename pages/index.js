import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutUsSection from '../components/AboutUsSection';
import MissionSection from '../components/TrendSection';
import ProductSection from '../components/ProductSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import TrendSection from '../components/TrendSection';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ProductSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
