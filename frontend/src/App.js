import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";

import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
import NotFound from "./components/layout/NotFound";

import { useLazyGetMeQuery } from "./redux/api/userApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  setIsAuthenticated,
  setLoading,
} from "./redux/features/userSlice";
import { API_BASE_URL } from "./constants/api";

console.log("API URL:", API_BASE_URL);

function App() {
  const dispatch = useDispatch();
  const [getMe] = useLazyGetMeQuery();

  // App.js
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components

    dispatch(setLoading(true));
    getMe()
      .unwrap()
      .then((data) => {
        if (isMounted) {
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        if (isMounted) {
          dispatch(setLoading(false));
          dispatch(setIsAuthenticated(false));
          dispatch(setUser(null));
        }
      });

    return () => {
      isMounted = false;
    }; // Cleanup
  }, [getMe, dispatch]);

  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            {userRoutes}
            {adminRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
