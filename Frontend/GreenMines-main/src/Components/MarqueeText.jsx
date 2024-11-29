"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MovingText({
  text,
  fontSize = 48,
  outlineColor = "black",
  fillColor = "blue",
  duration = 10,
}) {
  return (
    <div className="overflow-hidden w-full h-20 flex items-center">
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
          initial={{ fill: "transparent" }}
          whileHover={{
            fill: fillColor,
          }}
          transition={{
            fill: {
              duration: 5, // Duration of the fill animation
              ease: "easeInOut", // Smooth easing
            },
          }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}
