import React from "react";

const reviews = [
  { id: 1, text: "Best Deal and on Great price: I recently tried out Olly, and I must say I was pleasantly surprised...", author: "AppSumo User" },
  { id: 2, text: "Congratulations on the launch. Just got myself a lifetime subscription...", author: "Aman Sharma" },
  { id: 3, text: "This tool could be a gamechanger for SMM agencies...", author: "Roberto Perez" },
  { id: 4, text: "It's really awesome to see a tool that makes commenting this easy.", author: "Mike Wakoz" },
  { id: 5, text: "Congratulation Yash Olly is a perfect example of the best use of AI...", author: "Jawad Naeem" },
  { id: 6, text: "Actually, a very useful product for those who do active social media marketing.", author: "Alex Egorov" },
  { id: 7, text: "Best for LinkedIn: Right from the first comment that Olly crafted, I knew I would be using it for all my socials.", author: "Unknown" },
  { id: 8, text: "Absolutely love the simplicity and effectiveness of this tool!", author: "Sophia Reed" },
  { id: 9, text: "Olly has transformed the way I interact with my audience. It's a must-have!", author: "Daniel Vega" },
  { id: 10, text: "Never thought I'd find a tool like Olly. It's intuitive and super helpful!", author: "Chris Zhang" },
  { id: 11, text: "The AI-powered suggestions are top-notch. It saves me hours of work!", author: "Emily Taylor" },
  { id: 12, text: "A game-changer for creating engaging comments and boosting online presence.", author: "Mason Carter" },
];

const CarouselDemo = () => {
  // Adjustable sizes
  const centralDivSize = { width: "400px", height: "400px" }; // Central comment size
  const surroundingDivSize = { width: "250px", height: "250px" }; // Surrounding comment size

  // Colors (Customizable)
  const sectionBgColor = "#34246e"; // Section background color
  const commentBgColor = "#2D2A40"; // Div background color
  const borderColor = "#66C5CC"; // Div border color

  // Styles
  const sectionStyle = `p-8 rounded-lg shadow-lg border text-white`;
  const textStyle = "text-lg mb-4";

  return (
    <div
      className="relative w-full h-[1000px] overflow-hidden p-10"
      style={{ backgroundColor: sectionBgColor }}
    >
      {/* Central Comment */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`${sectionStyle} text-center flex flex-col items-center justify-center`}
          style={{
            ...centralDivSize,
            backgroundColor: commentBgColor,
            borderColor: borderColor,
          }}
        >
          <p className={textStyle}>
            "Best Deal and on Great price: I recently tried out Olly, and I must say I was pleasantly surprised..."
          </p>
          <p className="text-sm text-[#4932af] mt-4">- AppSumo User</p>
        </div>
      </div>

      {/* Surrounding Comments */}
      {reviews.slice(1).map((review, index) => (
        <div
          key={review.id}
          className={`${sectionStyle} absolute text-left p-4`}
          style={{
            ...surroundingDivSize,
            backgroundColor: commentBgColor,
            borderColor: borderColor,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className={textStyle}>{review.text}</p>
          <p className="text-sm text-[#66C5CC] mt-2">- {review.author}</p>
        </div>
      ))}
    </div>
  );
};

export default CarouselDemo;
