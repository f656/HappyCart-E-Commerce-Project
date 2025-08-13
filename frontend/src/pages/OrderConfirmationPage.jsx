import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/Slices/cartSlice";
import { setCheckout } from "../redux/Slices/checkoutSlice";
// const checkout = {
//   _id: "12343",
//   createdAt: new Date(),
//   checkoutItems: [
//     {
//       productId: "1",
//       name: "Jacket",
//       color: "Black",
//       size: "M",
//       quantity: 2,
//       price: 150,
//       image: "https://picsum.photos/150?random=1",
//     },
//     {
//       productId: "2",
//       name: "T-shirt",
//       color: "Red",
//       size: "xl",
//       quantity: 2,
//       price: 120,
//       image: "https://picsum.photos/150?random=2",
//     },
//   ],
//   shippingAddress: {
//     address: "123 Fashion Street",
//     city: "New York",
//     country: "USA",
//   },
// };

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //const { order, loading, error } = useSelector((state) => state.order);
  const { checkout } = useSelector((state) => state.checkout);
  const stateCheckout = location.state?.checkout;
  const [initialized, setInitialized] = useState(false);
  console.log("Redux checkout:", checkout);
  console.log("Location state checkout:", stateCheckout);

  const items = checkout?.checkoutItems || checkout?.orderItems || [];

  //Clear the cart when the order is confirmed
  useEffect(() => {
    // If we got checkout from navigate, set it in Redux
    if (stateCheckout) {
      dispatch(setCheckout(stateCheckout));
    }
    setInitialized(true);
  }, [stateCheckout, dispatch]);

  useEffect(() => {
    if (!initialized) return; // wait until first pass is done

    // If we still don't have checkout after init → redirect
    if (!checkout) {
      navigate("/my-orders");
      return;
    }

    // If we have checkout, clear the cart
    if (checkout?._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [checkout, initialized, navigate, dispatch]);

  const calculateEstimationDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // add 10 days to the order date
    return orderDate.toLocaleDateString();
  };

  if (!checkout) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank you for your order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id and Date: */}
            <div>
              <h2 className="text-xl font-semibold">Order ID:{checkout._id}</h2>
              <p className="text-gray-500">
                Order date:{new Date(checkout.createdAt).toLocaleString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimationDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-20">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">₹{item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info: */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">Paypal</p>
            </div>
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address},{" "}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
