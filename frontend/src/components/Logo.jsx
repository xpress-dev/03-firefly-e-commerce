import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/">
      <h1 className="font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent text-3xl sm:text-5xl mb p-2">
        Firefly
      </h1>
    </Link>
  );
};

export default Logo;
