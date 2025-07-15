import React from "react";

const Copyright = () => {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Firefly E-commerce. Made by{" "}
        <a
          href="https://github.com/xpress-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
        >
          Xpress Dev
        </a>
      </p>
    </div>
  );
};

export default Copyright;
