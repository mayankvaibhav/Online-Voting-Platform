import React from "react";
import styles from "./aboutUs.module.css"; // Import the styles

const AboutUs = () => {
  return (
    <div className={styles.aboutContainer}>
      {/* Header Section */}
      <header className={styles.header}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.subtitle}>
          Empowering democracy with technology - A secure and transparent online voting system.
        </p>
      </header>

      {/* Introduction Section */}
      <section className={styles.section}>
        <h2>Who We Are</h2>
        <p>
          Our Online Voting Platform is designed to provide a seamless, secure, and reliable way
          to conduct elections digitally. We leverage advanced cryptographic techniques, robust
          authentication mechanisms, and an intuitive user interface to ensure transparency and 
          ease of use for all voters.
        </p>
      </section>

      {/* Mission Section */}
      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          We aim to revolutionize the electoral process by eliminating traditional voting challenges,
          ensuring accessibility for everyone, and making elections more inclusive. With our platform,
          elections can be conducted with **integrity, efficiency, and transparency**.
        </p>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2>Why Choose Us?</h2>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>🔐 Secure & Encrypted</h3>
            <p>Our system ensures data integrity with blockchain-like security mechanisms.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🌍 Accessible Anywhere</h3>
            <p>Vote from anywhere in the world with just a device and an internet connection.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>⏳ Instant Results</h3>
            <p>Forget long counting processes! Get accurate results immediately.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🛡️ Fraud Prevention</h3>
            <p>Robust authentication and monitoring prevent unauthorized voting.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.section}>
        <h2>Meet Our Team</h2>
        <div className={styles.team}>
        <div className={styles.teamMember}>
            <div className={styles.avatar}></div>
            <h3>Mayank Vaibhav</h3>
            <p>Co-Founder & Lead Developer</p>
          </div>
          <div className={styles.teamMember}>
            <div className={styles.avatar}></div>
            <h3>Harshit Raj</h3>
            <p>Frontend Developer</p>
          </div>
          <div className={styles.teamMember}>
            <div className={styles.avatar}></div>
            <h3>Suraj Mani</h3>
            <p>Security Specialist</p>
          </div>
          <div className={styles.teamMember}>
            <div className={styles.avatar}></div>
            <h3>Dharmendra Singh</h3>
            <p>Operations Manager</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <p>© 2025 Online Voting Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
