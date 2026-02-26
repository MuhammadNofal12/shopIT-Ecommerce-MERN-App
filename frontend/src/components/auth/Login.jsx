// import React, { useEffect, useState } from "react";
// import { useLoginMutation } from "../../redux/api/authApi";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import MetaData from "../layout/MetaData";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const [login, { isLoading, error, data }] = useLoginMutation();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   //   console.log("=========================================");
//   //   console.log(data);
//   //   console.log("=========================================");

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//     if (error) {
//       toast.error(error?.data?.message);
//     }
//   }, [error, isAuthenticated]);

//   const submitHandler = (e) => {
//     e.preventDefault();

//     const loginData = {
//       email,
//       password,
//     };
//     login(loginData);
//   };
//   return (
//     <>
//       <MetaData title={"Login"} />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form className="shadow rounded bg-body" onSubmit={submitHandler}>
//             <h2 className="mb-4">Login</h2>
//             <div className="mb-3">
//               <label htmlFor="email_field" className="form-label">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email_field"
//                 className="form-control"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="password_field" className="form-label">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password_field"
//                 className="form-control"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <a href="/password/forgot" className="float-end mb-4">
//               Forgot Password?
//             </a>

//             <button
//               id="login_button"
//               type="submit"
//               className="btn w-100 py-2"
//               disabled={isLoading}
//             >
//               {isLoading ? "Authenticating..." : "LOGIN"}
//             </button>

//             <div className="my-3">
//               <a href="/register" className="float-end">
//                 New User?
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

//-------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../../redux/features/cartSlice";
import MetaData from "../layout/MetaData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // Get the location where the user was trying to go

  const [login, { isLoading, error, data }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Redirect the user if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If the user was trying to go somewhere, redirect them there
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    }
    if (error) {
      toast.error(error?.data?.message); // Handle error
    }
  }, [error, isAuthenticated, location, navigate]);

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };
    login(loginData);
  };

  // Handle cart clearing on login
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(clearCart()); // Clear the cart after successful login
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <MetaData title={"Login"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <a href="/password/forgot" className="float-end mb-4">
              Forgot Password?
            </a>

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>

            <div className="my-3">
              <a href="/register" className="float-end">
                New User?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
