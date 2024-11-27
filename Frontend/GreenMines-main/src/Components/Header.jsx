import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "./Navbar"

function Header() {
  const navigate = useNavigate()
  const ref = useRef(null)

  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: "easeInOut" },
  }

  return (
    <div className="from-[#2B263F] to-[#231E3D] bg-gradient-to-b w-full px-6 sm:px-10 lg:h-screen overflow-x-hidden">
      {/*<video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
        <Navbar className="z-50" />
        <div className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 py-12 md:py-20">
          <motion.div
            ref={ref}
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 sm:mb-6">
              Tackling Climate Change with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#66C5CC] to-[#009688]">
                CARBON
              </span>{" "}
              Solutions
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8">
              GREENMINES provides innovative solutions to reduce carbon emissions
              and promote sustainability. Join us in building a greener future.
            </p>

            <button
              onClick={() => {
                navigate("/dashboard")
                console.log("Button clicked!")
              }}
              className="rounded px-5 sm:px-7 py-2 sm:py-3 bg-[#009688] text-white relative group hover:bg-[#00796B] overflow-hidden tracking-wider text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Header

