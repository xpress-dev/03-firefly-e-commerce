import { Link } from "react-router-dom";
import { MdArrowRightAlt } from "react-icons/md";

const Hero = () => {
  return (
    <div className="hero bg-cover bg-center h-[60vh] md:h-[70vh] lg:h-[80vh] relative mt-2">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-[url('https://images.unsplash.com/photo-1483181957632-8bda974cbc91?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-cover bg-center relative hover:bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] transition-all duration-500 ease-in-out rounded-2xl">
        <Link
          to="/collections"
          className="bg-white text-black py-2 px-6 sm:text-[18px] font-semibold absolute bottom-0 right-0 rounded-tl-2xl flex gap-2 items-center"
        >
          Browse Collections <MdArrowRightAlt className="text-3xl" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
