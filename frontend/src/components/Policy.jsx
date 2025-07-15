import { RiExchangeFundsFill } from "react-icons/ri";
import { MdOutlinePriceCheck } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const Policy = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col sm:flex-row items-center text-center gap-10 my-10 mx-auto">
        <div className="flex flex-col gap-2 items-center bg-gray-50 p-4 rounded-2xl w-full">
          <RiExchangeFundsFill className="text-5xl mb-4" />
          <p className="font-semibold text-lg">Easy Exchange</p>
          <p className="text-sm text-gray-500">
            No questions asked, your product exchanged
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center bg-gray-50 p-4 rounded-2xl w-full">
          <MdOutlinePriceCheck className="text-5xl mb-4" />
          <p className="font-semibold text-lg">Seven-day Return</p>
          <p className="text-sm text-gray-500">
            We return the product within 7 days
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center bg-gray-50 p-4 rounded-2xl w-full">
          <BiSupport className="text-5xl mb-4" />
          <p className="font-semibold text-lg">Full Support</p>
          <p className="text-sm text-gray-500">
            From our dedicated support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
