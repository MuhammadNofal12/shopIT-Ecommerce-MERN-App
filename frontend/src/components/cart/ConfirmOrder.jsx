// import React from "react";
// import MetaData from "../layout/MetaData";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { calculateOrderCost } from "../../helpers/helpers";
// import CheckoutSteps from "./CheckoutSteps";

// const ConfirmOrder = () => {
//   const { cartItems, shippingInfo } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.auth);

//   //const navigate = useNavigate();

//   const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//     calculateOrderCost(cartItems);

//   //   const proceedToPaymentHandler = () => {
//   //     navigate("/payment_method");
//   //   };
//   return (
//     <>
//       <MetaData title={"Confirm Order Info"} />
//       <CheckoutSteps shipping confirmOrder />

//       <div className="row d-flex justify-content-between">
//         <div className="col-12 col-lg-8 mt-5 order-confirm">
//           <h4 className="mb-3">Shipping Info</h4>
//           <p>
//             <b>Name:</b> {user?.name}
//           </p>
//           <p>
//             <b>Phone:</b> {shippingInfo?.phoneNo}
//           </p>
//           <p className="mb-4">
//             <b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city},
//             {shippingInfo?.zipCode}, {shippingInfo?.country}
//           </p>

//           <hr />
//           <h4 className="mt-4">Your Cart Items:</h4>
//           {cartItems?.map((item) => (
//             <>
//               <hr />
//               <div className="cart-item my-1">
//                 <div className="row">
//                   <div className="col-4 col-lg-2">
//                     <img
//                       src={item?.image}
//                       alt="Laptop"
//                       height="45"
//                       width="65"
//                     />
//                   </div>

//                   <div className="col-5 col-lg-6">
//                     <Link to={`/product/${item.product}`}>{item?.name}</Link>
//                   </div>

//                   <div className="col-4 col-lg-4 mt-4 mt-lg-0">
//                     <p>
//                       {item?.quantity} * ${item?.price} ={" "}
//                       <b>${(item.quantity * item.price).toFixed(2)}</b>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <hr />
//             </>
//           ))}
//         </div>

//         <div className="col-12 col-lg-3 my-4">
//           <div id="order_summary">
//             <h4>Order Summary</h4>
//             <hr />
//             <p>
//               Subtotal:{" "}
//               <span className="order-summary-values">${itemsPrice}</span>
//             </p>
//             <p>
//               Shipping:{" "}
//               <span className="order-summary-values">${shippingPrice}</span>
//             </p>
//             <p>
//               Tax: <span className="order-summary-values">${taxPrice}</span>
//             </p>

//             <hr />

//             <p>
//               Total: <span className="order-summary-values">${totalPrice}</span>
//             </p>

//             <hr />
//             <Link
//               to="/payment_method"
//               id="checkout_btn"
//               className="btn btn-primary w-100"
//             >
//               Proceed to Payment
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ConfirmOrder;

//-------------------updated -----------------------------------------
import React from "react";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { calculateOrderCost } from "../../helpers/helpers";
import CheckoutSteps from "./CheckoutSteps";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import { clearCart } from "../../redux/features/cartSlice";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // COD mutation
  const [createNewOrder, { isLoading: codLoading }] =
    useCreateNewOrderMutation();
  // Stripe mutation
  const [stripeCheckoutSession, { isLoading: stripeLoading }] =
    useStripeCheckoutSessionMutation();

  // ✅ Handler for COD order
  const placeCODOrder = async () => {
    try {
      await createNewOrder({
        orderItems: cartItems,
        shippingInfo,
        paymentMethod: "COD",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount: totalPrice,
      }).unwrap();

      // ✅ Clear cart, toast once, navigate
      dispatch(clearCart());
      toast.success("Your COD order was placed successfully!");
      navigate("/me/orders", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  // ✅ Handler for Stripe payment
  const proceedToStripePayment = async () => {
    try {
      const session = await stripeCheckoutSession({
        orderItems: cartItems,
        shippingInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount: totalPrice,
      }).unwrap();

      // ✅ Redirect to Stripe Checkout URL
      window.location.href = session.url;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to initiate payment");
    }
  };

  return (
    <>
      <MetaData title={"Confirm Order Info"} />
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name:</b> {user?.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo?.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.zipCode}, {shippingInfo?.country}
          </p>

          <hr />
          <h4 className="mt-4">Your Cart Items:</h4>
          {cartItems?.map((item) => (
            <>
              <hr />
              <div className="cart-item my-1" key={item.product}>
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item?.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item?.quantity} * ${item?.price} ={" "}
                      <b>${(item.quantity * item.price).toFixed(2)}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{" "}
              <span className="order-summary-values">${itemsPrice}</span>
            </p>
            <p>
              Shipping:{" "}
              <span className="order-summary-values">${shippingPrice}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">${taxPrice}</span>
            </p>
            <hr />
            <p>
              Total: <span className="order-summary-values">${totalPrice}</span>
            </p>
            <hr />

            {/* ✅ Stripe Payment */}
            <button
              onClick={proceedToStripePayment}
              className="btn btn-primary w-100 mb-2"
              disabled={stripeLoading}
            >
              {stripeLoading ? "Processing..." : "Pay with Card (Stripe)"}
            </button>

            {/* ✅ COD Payment */}
            <button
              onClick={placeCODOrder}
              className="btn btn-success w-100"
              disabled={codLoading}
            >
              {codLoading ? "Placing COD Order..." : "Place COD Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
