import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.component";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home.page";
import Companies from "./pages/companies/Companies.page";
import AddCompany from "./pages/companies/AddCompany.page";
import Contact from "./pages/contacts/Contact.page";
import UpdateCompany from "./pages/companies/UpdateCompany.page";
import Ledgers from "./pages/ledgers/Ledgers.page";
import AddLedger from "./pages/ledgers/AddLedger.page";
import UpdateLedger from "./pages/ledgers/UpdateLedger.page";
import Categories from "./pages/categories/Categories.page";
import AddCategory from "./pages/categories/AddCategory.page";
import UpdateCategory from "./pages/categories/UpdateCategory.page";
import Products from "./pages/products/Product.page";
import AddProduct from "./pages/products/AddProduct.page";
import UpdateProduct from "./pages/products/UpdateProduct.page";
import Transaction from "./pages/transactions/Transaction.page";
import AddTransaction from "./pages/transactions/AddTransaction.page";
import UpdateTransaction from "./pages/transactions/UpdateTransaction.Page";
import Login from "./pages/user/Login.page";
import Registration from "./pages/user/Register.page";
import ResetPassword from "./pages/user/ResetPassword.page";
import Users from "./pages/user/Users.page";
import AddUser from "./pages/user/AddUser.page";
import UpdateUser from "./pages/user/UpdateUser.page";

const App = () => {
  // State to manage login status
  const [isLoggedIn, setLoginStatus] = useState(false);

  // Reference for the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation hook
  const navigate = useNavigate();

  // Function to update login status
  const handleLoginStatus = (status: boolean) => {
    setLoginStatus(status);
  };

  // Function to handle user activity
  const handleUserActivity = () => {
    // Reset the timer when user activity is detected
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set the timer for 5 minutes
    timerRef.current = setTimeout(() => {
      // Perform logout actions after 5 minutes of inactivity
      localStorage.removeItem("token");
      setLoginStatus(false);
      navigate("/login");
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };

  // Effect for initial login status check and event listeners
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setLoginStatus(true);
    }

    // List of events to track for user activity
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    // Function to reset the timer
    const resetTimer = () => {
      handleUserActivity();
    };

    // Adding event listeners for each event
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup function to remove event listeners on unmount
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [setLoginStatus, navigate]);

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} setLoginStatus={setLoginStatus} />
      <div className="wrapper">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              <Login
                handleLoginStatus={handleLoginStatus}
                isLoggedIn={isLoggedIn}
              />
            }
          />

          <Route path="/register" element={<Registration />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {isLoggedIn && (
            <>
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/add" element={<AddCompany />} />
              <Route path="/companies/update/:id" element={<UpdateCompany />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route
                path="/categories/update/:id"
                element={<UpdateCategory />}
              />
              <Route path="/ledgers" element={<Ledgers />} />
              <Route path="/ledgers/add" element={<AddLedger />} />
              <Route path="/ledgers/update/:id" element={<UpdateLedger />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/transactions/add" element={<AddTransaction />} />
              <Route
                path="/transactions/update/:id"
                element={<UpdateTransaction />}
              />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/update/:id" element={<UpdateProduct />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="users/update/:id" element={<UpdateUser />} />
            </>
          )}
        </Routes>
      </div>
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default App;
