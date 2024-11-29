"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function MovingText({
  text,
  fontSize = 48,
  outlineColor = "black",
  fillColor = "blue",
  duration = 10,
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Precalculate character positions for spacing
  const characterLayout = useMemo(() => {
    return text.split("").map((char, index) => ({
      char,
      x: index * fontSize * 0.6, // Consistent spacing
    }));
  }, [text, fontSize]);

  return (
    <div className="relative overflow-hidden bg-gray-800 w-full h-30 flex items-center">
      {/* Custom glowing cursor */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: cursorPosition.y - 10,
            left: cursorPosition.x - 10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${fillColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
          animate={{
            scale: 1.5,
            opacity: 0.8,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}

      <motion.svg
        className="whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <motion.text
          x="0"
          y="50%"
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={fontSize}
          fontWeight="bold"
          stroke={outlineColor}
          strokeWidth="2"
        >
          {characterLayout.map(({ char, x }, index) => (
            <motion.tspan
              key={index}
              x={x}
              fill="transparent"
              initial={{
                fill: "transparent",
                filter: "drop-shadow(0 0 0px rgba(0,0,0,0))",
              }}
              whileHover={{
                fill: fillColor,
                filter: `drop-shadow(0 0 10px ${fillColor})`,
                scale: 1.1,
              }}
              onMouseEnter={() => setIsHovering(true)} // Enable glowing cursor
              onMouseLeave={() => setIsHovering(false)} // Disable glowing cursor
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                fill: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                filter: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 0.2,
                  ease: "easeInOut",
                },
              }}
            >
              {char}
            </motion.tspan>
          ))}
        </motion.text>
      </motion.svg>
    </div>
  );
}
