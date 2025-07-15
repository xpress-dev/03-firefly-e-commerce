import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <>
      <footer className="flex justify-between flex-col sm:flex-row bg-gray-50 p-5 sm:p-10 md:p-15 lg:p-[2.5vw] rounded-t-2xl  gap-10 sm:gap-2">
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
          <Link to="/">Home</Link>
          <Link to="/">Collections</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Contact Us</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </footer>
      <Copyright />
    </>
  );
};

export default Footer;
