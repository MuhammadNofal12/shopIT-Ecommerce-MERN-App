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

//   const [login, { isLoading, error, isSuccess }] = useLoginMutation();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   //   console.log("=========================================");
//   //   console.log(data);
//   //   console.log("=========================================");

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success("Login successful");
//     }
//     if (isAuthenticated) {
//       navigate("/");
//     }
//     if (error) {
//       toast.error(error?.data?.message);
//     }
//   }, [error, isAuthenticated, navigate, isSuccess]);

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

//------------------updated----------------------------------------
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import {
  setUser,
  setIsAuthenticated,
  setLoading,
} from "../../redux/features/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error, isSuccess }] = useLoginMutation();

  // Effect to handle post-login actions
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
    }

    if (isAuthenticated) {
      navigate("/"); // Redirect home if logged in
    }

    if (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  }, [isSuccess, isAuthenticated, error, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const loginData = { email, password };
      // Just unwrap the call. The authApi.js 'onQueryStarted'
      // will handle the setUser and setIsAuthenticated dispatches.
      await login(loginData).unwrap();

      // Success toast is already handled in your useEffect!
      navigate("/");
    } catch (err) {
      // Error toast is also handled in your useEffect!
      console.error("Login Error:", err);
    }
  };
  return (
    <>
      <MetaData title="Login" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
            <h2 className="mb-4">Login</h2>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Link to="/password/forgot" className="float-end mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading || loading}
            >
              {isLoading || loading ? "Authenticating..." : "LOGIN"}
            </button>

            <div className="my-3">
              <Link to="/register" className="float-end">
                New User? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
