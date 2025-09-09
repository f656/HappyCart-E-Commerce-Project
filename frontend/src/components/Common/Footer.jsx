import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetState,
  subscribeNewsletter,
} from "../../redux/Slices/subscriberSlice";
import { toast } from "react-toastify";
const Footer = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.subscriber);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(subscribeNewsletter(email));
  };

  // Success/Error hone ke baad form reset
  useEffect(() => {
    if (success) {
      toast.success("Successfully subscribed! 🎉");
      setEmail(""); // clear input field
    }
    if (error) {
      toast.error(error);
    }

    if (success || error) {
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    }
  }, [success, error, dispatch]);
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0 ">
        <div>
          <h3 className="text-lg text-gray-800">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>

          <form className="flex" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all "
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* Success/Error Messages */}
          {success && (
            <p className="text-green-600 text-sm mt-2">
              Successfully subscribed! 🎉
            </p>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>
        {/* support links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>
        {/* followers section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4"> Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="http://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hove:text-gray-500"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="http://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hove:text-gray-500"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="http://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hove:text-gray-500"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          ©2025, Ali Stack😎.All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
