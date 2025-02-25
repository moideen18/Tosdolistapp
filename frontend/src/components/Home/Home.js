import React from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Home.css"; // Using CSS Modules
// If you're not using CSS modules, simply import "./Home.css";

function HomePage() {
  return (
    <div className={styles.homepage}>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to TODO-LIST</h1>
            <p>
              Stay organized and boost your productivity with our modern, professional task management solution.
            </p>
          </div>
        </section>
        <section className={styles.features}>
          <div className={styles.featuresContent}>
            <h2>Our Features</h2>
            <p>
              Discover the power of simplicity with our comprehensive task management tools:
            </p>
            <ul>
              <li>Clean and intuitive interface</li>
              <li>Real-time task updates</li>
              <li>Cross-device synchronization</li>
              <li>Customizable notifications</li>
              <li>Secure cloud storage</li>
            </ul>
          </div>
        </section>
        <section className={styles.about}>
          <div className={styles.aboutContent}>
            <h2>About TODO-LIST</h2>
            <p>
              TODO-LIST is designed to simplify your daily routine. Whether you're managing personal goals or professional projects, our platform helps you stay focused and achieve more.
            </p>
            <p>
              Enjoy a clutter-free workspace, seamless navigation, and robust performance—all in one place.
            </p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} MyProject. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
