import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import logo from "./logo.png"; 

const navigation = [
  { name: "Home", href: "/" },
  { name: "Carbon Footprint", href: "/emission" },
  { name: "Neutrality", href: "/neutralityoptions" },
  { name: "About Us", href: "/aboutus" }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Enavbar({ className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [navs, setNavs] = useState(navigation);

  useEffect(() => {
    // Only update `navs` when location.pathname changes
    const updatedNavs = navigation.map(nav => ({
      ...nav,
      current: location.pathname === nav.href
    }));
    setNavs(updatedNavs);
  }, [location.pathname]);  // Removed `navs` from dependency array

  return (
    <nav className={`bg-[#2B263F] fixed top-0 left-0 w-full z-50`}>
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-24 max-w-screen-2xl mx-auto">
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-[#66C5CC] hover:text-white hover:bg-[#342F49] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto max-w-full cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex flex-grow justify-center">
            <div className="flex space-x-8">
              {navs.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "text-transparent bg-clip-text bg-gradient-to-br from-[#6664F1] to-[#C94AF0] text-xl"
                      : "text-[#66C5CC]",
                    "px-6 py-3 rounded-md text-lg font-medium hover:text-white hover:scale-105 ease-in duration-200"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Us Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:pr-0 hidden sm:flex">
            <button
              onClick={() => navigate("/contactus")}
              className="relative text-white border rounded px-8 py-3 text-lg hover:text-white c-btn tracking-wider overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-[#6664F1] to-[#C94AF0]"></span>
              <span className="relative z-10 flex justify-center items-center">
                Contact Us
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navs.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-[#342F49] text-[#66C5CC]"
                    : "text-[#66C5CC] hover:bg-[#342F49] hover:text-white",
                  "block px-6 py-3 rounded-md text-lg font-semibold"
                )}
                aria-current={item.current ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Enavbar;
