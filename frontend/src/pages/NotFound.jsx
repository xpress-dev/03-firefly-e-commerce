import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center">
        <div className="bg-orange-100 rounded-full p-4 mb-4">
          <MdErrorOutline className="text-orange-500 text-5xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
          <br />
          Please check the URL or return to the homepage.
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
