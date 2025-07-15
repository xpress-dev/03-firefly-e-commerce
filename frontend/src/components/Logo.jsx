import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/">
      <h1 className="oswald-font text-3xl sm:text-5xl ">Firefly •</h1>
      <div className="h-1 mt-2 bg-black"></div>
    </Link>
  );
};

export default Logo;
