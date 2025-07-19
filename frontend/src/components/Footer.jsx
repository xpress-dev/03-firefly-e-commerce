import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <>
      <footer className="flex justify-between flex-col sm:flex-row bg-gray-50 p-5 sm:p-10 md:p-15 lg:p-[2.5vw] xl:px-[10vw] rounded-t-2xl  gap-10 sm:gap-2">
        <Logo />

        <div className="font-semibold">
          <p>
            Address: 123 Firefly Lane, E-commerce
            <br /> City, EC 12345
          </p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Email: dev@xpress-dev.xyz</p>
        </div>
        <div className="flex flex-col font-bold text-lg">
          <Link
            to="/"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/collections"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            Collections
          </Link>
          <Link
            to="/about"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            Contact Us
          </Link>
          <Link
            to="/terms"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="hover:text-orange-500 transition-colors cursor-pointer"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
      <Copyright />
    </>
  );
};

export default Footer;
