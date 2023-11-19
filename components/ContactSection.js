import React, { useState, useEffect } from "react";
import styles from "../styles/contactSection.module.css";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isSent) {
      const timer = setTimeout(() => {
        setIsSent(false);
      }, 5000); // Hide the alert after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isSent]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.name)
    console.log(e)

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }), // Pass the state values
    });

    if (response.ok) {
      // Handle successful submission
      console.log('Email sent successfully!');
      setIsSent(true);
      setName(''); // Clear name field
      setEmail(''); // Clear email field
      setMessage(''); // Clear message field
    } else {
      // Handle submission error
      console.error('Error sending email.');
    }
  };

  return (
    <section className={styles.contact}>
      <h2>Contact Us</h2>
      <p>문의사항 남겨주세요!</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the state on input change
        />

        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update the state on input change
        />

        <label htmlFor="message">메세지</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update the state on input change
        />
        <button type="submit">Send Message</button>
        {isSent && (
        <div className={styles.alert}>Email sent successfully!</div>
        )}
        
      </form>
    </section>
  );
};

export default ContactSection;
