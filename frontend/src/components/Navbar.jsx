import { CgProfile, CgShoppingCart, CgSearch } from "react-icons/cg";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="flex justify-between py-5 items-center">
      <Logo />
      {/* Desktop Controls */}
      <div className="hidden sm:flex flex-row gap-5 text-2xl">
        <CgProfile />
        <CgShoppingCart />
        <CgSearch />
      </div>
      {/* Mobile Burger Menu */}
      <div className="sm:hidden flex flex-col">
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black mb-1"></div>
      </div>
    </nav>
  );
};

export default Navbar;
