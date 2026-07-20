import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";

//import useUserRoutes from "./components/routes/UserRoutes";
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";

import NotFound from "./components/layout/NotFound";

import { useLazyGetMeQuery } from "./redux/api/userApi";
import { useEffect } from "react";
import { API_BASE_URL } from "./constants/api";

console.log("API URL:", API_BASE_URL);

function App() {
  const [getMe] = useLazyGetMeQuery();

  // App.js

  useEffect(() => {
    getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
