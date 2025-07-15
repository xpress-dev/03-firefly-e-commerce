import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw] xl:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
