import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import CanvasConfetti from "react-canvas-confetti";
import mojs from "@mojs/core";
import "@fontsource/orbitron";

export default function Final() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    ),
  });

  const confettiInstance = useRef(null);
  const getInstance = (instance) => (confettiInstance.current = instance);

  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [sparks, setSparks] = useState([]);

  const title = "WELCOME TO FLUX";
  const subtitle = "Selected Candidates";
  const members = Array.from({ length: 30 }).map((_, i) => `Member ${i + 1}`);

  const fireworkSound = useRef(new Audio("/firework.mp3"));

  // Update dimensions on resize and scroll
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          window.innerHeight
        ),
      });
    };

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", updateDimensions); // <- Added scroll listener
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", updateDimensions);
    };
  }, []);

  // Confetti bursts from top, left, and right
  useEffect(() => {
    const interval = setInterval(() => {
      if (confettiInstance.current) {
        const origins = [
          { x: Math.random(), y: Math.random() * 0.5 }, // top
          { x: 0, y: Math.random() * 0.8 },             // left
          { x: 1, y: Math.random() * 0.8 },             // right
        ];

        origins.forEach((origin) => {
          confettiInstance.current({
            particleCount: 25,
            spread: 100,
            startVelocity: 25,
            gravity: 0.1,
            origin,
            colors: ["#ff0000", "#ffcc00", "#ff8800", "#ff5555", "#ff3300"],
          });
        });

        fireworkSound.current.play();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouse sparkle effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      const newSpark = {
        x: e.clientX + (Math.random() - 0.5) * 40,
        y: e.clientY + (Math.random() - 0.5) * 40,
        size: Math.random() * 8 + 4,
        color: ["#ff0000", "#ffcc00", "#ff8800", "#ff5555", "#ff3300"][Math.floor(Math.random() * 5)],
        life: 0,
      };
      setSparks((prev) => [...prev, newSpark]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Spark animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSparks((prev) =>
        prev
          .map((spark) => ({ ...spark, y: spark.y - 0.5, life: spark.life + 1 }))
          .filter((spark) => spark.life < 40)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const letters = title.split("");

  const letterVariants = {
    hidden: { y: 50, opacity: 0, rotate: -10, scale: 0.8 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { delay: i * 0.05, type: "spring", stiffness: 500, damping: 20 },
    }),
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
  };

  // Fireworks on click
  useEffect(() => {
    const colors = ["#ff0000", "#ffcc00", "#ff8800"];

    const handleClick = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      const centerMarginX = window.innerWidth * 0.2;
      const centerMarginY = window.innerHeight * 0.2;

      if (
        posX > centerMarginX &&
        posX < window.innerWidth - centerMarginX &&
        posY > centerMarginY &&
        posY < window.innerHeight - centerMarginY
      ) {
        new mojs.Burst({
          left: 0,
          top: 0,
          x: posX,
          y: posY,
          radius: { 0: 180 },
          count: 16,
          children: {
            shape: "circle",
            radius: 12,
            fill: colors,
            strokeWidth: 2,
            duration: 2200,
            easing: "cubic.out",
            swirlSize: 12,
          },
        }).play();

        new mojs.Burst({
          left: 0,
          top: 0,
          x: posX,
          y: posY,
          radius: { 0: 150 },
          count: 12,
          children: {
            shape: "line",
            stroke: colors,
            strokeWidth: 4,
            duration: 1800,
            easing: "cubic.out",
            angle: { 0: 180 },
            swirlSize: 10,
          },
        }).play();

        fireworkSound.current.play();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-16 bg-black text-red-400 overflow-hidden font-['Orbitron'] cursor-none">
      {/* Confetti */}
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={250}
        gravity={0.15}
        recycle={true}
        run={true}
        colors={["#ff0000", "#ffcc00", "#ff8800", "#ff5555", "#ff3300"]}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />

      <CanvasConfetti
        ref={getInstance}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      />

      {/* Title & Subtitle */}
      <div className="relative z-10 w-full py-8 flex flex-col items-center">
        <h1 className="text-center mb-6 px-4 drop-shadow-[0_0_55px_#ff0000] flex flex-col items-center">
          <motion.span
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="gradient-text block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
          >
            WELCOME TO
          </motion.span>

          <motion.span
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="gradient-text block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mt-2"
          >
            FLUX
          </motion.span>
        </h1>

        <motion.h2
          className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl drop-shadow-[0_0_20px_#ff0000] gradient-text"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.h2>
      </div>

      {/* Members Grid */}
      <div className="relative z-10 flex flex-wrap justify-center w-full max-w-6xl gap-6 px-4 mt-6">
        {members.map((name, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px #ff5555" }}
            className="px-4 py-2 w-44 sm:w-48 bg-black/40 border border-red-500 rounded-lg backdrop-blur-md shadow-[0_0_25px_rgba(255,0,0,0.6)] text-center transition-all duration-300"
          >
            <div className="text-sm md:text-base font-bold text-red-100">{name}</div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-[9px] md:text-xs text-red-500/70 font-mono text-center pb-4 px-2 mt-12">
        🎆 Developed by <span className="text-red-400">Introvert</span>
      </footer>

      {/* Custom Cursor */}
      <div
        style={{
          position: "fixed",
          top: cursor.y,
          left: cursor.x,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff0000, #ff8800)",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          boxShadow: "0 0 25px #ff5555, 0 0 35px #ff8800",
        }}
      />

      {/* Cursor Sparks */}
      {sparks.map((spark, index) => (
        <div
          key={index}
          style={{
            position: "fixed",
            top: spark.y,
            left: spark.x,
            width: spark.size * 2,
            height: spark.size * 2,
            borderRadius: "50%",
            backgroundColor: spark.color,
            pointerEvents: "none",
            opacity: 1 - spark.life / 40,
            filter: "blur(2px)",
            zIndex: 9999,
          }}
        />
      ))}

      {/* Gradient text animation */}
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #f87171, #fbbf24, #f97316, #f87171);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 5s linear infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
