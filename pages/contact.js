import React from 'react';
import ContactSection from '../components/ContactSection';
import styles from "../styles/contactSection.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div className={styles.page}>
      <Header />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ContactPage;
