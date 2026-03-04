// import React, { useEffect, useState } from "react";
// import MetaData from "../layout/MetaData";
// import { useSelector } from "react-redux";
// import CheckoutSteps from "./CheckoutSteps";
// import { calculateOrderCost } from "../../helpers/helpers";
// import {
//   useCreateNewOrderMutation,
//   useStripeCheckoutSessionMutation,
// } from "../../redux/api/orderApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// //import { loadStripe } from "@stripe/stripe-js";

// // Initialize Stripe once
// //const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// const PaymentMethod = () => {
//   const [method, setMethod] = useState("");

//   const navigate = useNavigate();

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);

//   const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

//   const [
//     stripeCheckoutSession,
//     { data: checkoutData, error: checkoutError, isLoading },
//   ] = useStripeCheckoutSessionMutation();

//   useEffect(() => {
//     if (checkoutData) {
//       window.location.href = checkoutData?.url;
//       //   console.log("===========================");
//       //   console.log(checkoutData);
//       //   console.log("===========================");
//       //   navigate(checkoutData?.url);
//     }
//     if (checkoutError) {
//       toast.error(checkoutError?.data?.message);
//     }
//   }, [checkoutData, checkoutError]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error?.data?.message);
//     }

//     if (isSuccess) {
//       navigate("/me/orders?order_success=true");
//     }
//   }, [error, isSuccess, navigate]);

//   const submitHandler = (e) => {
//     e.preventDefault();

//     const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//       calculateOrderCost(cartItems);

//     if (method === "COD") {
//       //Create COD Order
//       const orderData = {
//         shippingInfo,
//         orderItems: cartItems,
//         itemsPrice,
//         shippingAmount: shippingPrice,
//         taxAmount: taxPrice,
//         totalAmount: totalPrice,
//         paymentInfo: {
//           status: "Not Paid",
//         },
//         paymentMethod: "COD",
//       };
//       createNewOrder(orderData);
//     }
//     if (method === "Card") {
//       //Stripe Checkout
//       const orderData = {
//         shippingInfo,
//         orderItems: cartItems,
//         itemsPrice,
//         shippingAmount: shippingPrice,
//         taxAmount: taxPrice,
//         totalAmount: totalPrice,
//       };
//       stripeCheckoutSession(orderData);
//     }
//   };
//   return (
//     <>
//       <MetaData title={"Payment Method"} />
//       <CheckoutSteps shipping confirmOrder payment />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form className="shadow rounded bg-body" onSubmit={submitHandler}>
//             <h2 className="mb-4">Select Payment Method</h2>

//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="payment_mode"
//                 id="codradio"
//                 value="COD"
//                 onChange={(e) => setMethod("COD")}
//               />
//               <label className="form-check-label" htmlFor="codradio">
//                 Cash on Delivery
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="payment_mode"
//                 id="cardradio"
//                 value="Card"
//                 onChange={(e) => setMethod("Card")}
//               />
//               <label className="form-check-label" htmlFor="cardradio">
//                 Card - VISA, MasterCard
//               </label>
//             </div>

//             <button
//               id="shipping_btn"
//               type="submit"
//               className="btn py-2 w-100"
//               disabled={isLoading}
//             >
//               CONTINUE
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentMethod;

//--------------------------updated----------------------------------------------------------
import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// ✅ Initialize Stripe once (outside component)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { isLoading: codLoading }] =
    useCreateNewOrderMutation();

  const [stripeCheckoutSession, { isLoading: stripeLoading }] =
    useStripeCheckoutSessionMutation();

  // ======================
  // ✅ Submit Handler (FIXED)
  // ======================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!method) {
      toast.error("Please select a payment method.");
      return;
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);

    try {
      // ------------------ COD ------------------
      if (method === "COD") {
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          itemsPrice,
          shippingAmount: shippingPrice,
          taxAmount: taxPrice,
          totalAmount: totalPrice,
          paymentInfo: { status: "Not Paid" },
          paymentMethod: "COD",
        };

        await createNewOrder(orderData).unwrap();

        toast.success("Order placed successfully!");
        navigate("/me/orders");
      }

      // ------------------ CARD (Stripe) ------------------
      if (method === "Card") {
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          itemsPrice,
          shippingAmount: shippingPrice,
          taxAmount: taxPrice,
          totalAmount: totalPrice,
        };

        const res = await stripeCheckoutSession(orderData).unwrap();

        const stripe = await stripePromise;

        await stripe.redirectToCheckout({
          sessionId: res.sessionId, // ⚠ must match backend response
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            {/* COD */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={() => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>

            {/* CARD */}
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={() => setMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100 mt-4"
              disabled={codLoading || stripeLoading || !method}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
