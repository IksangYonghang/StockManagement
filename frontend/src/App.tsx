import { useState, useEffect, useRef, useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/theme.context";
import ProductReport from "./pages/reports/ProductStockReport.page";
import ProductStockReport from "./pages/reports/ProductStockReport.page";

interface MainContentProps {
  isLoggedIn: boolean;
  handleLoginStatus: (status: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  isLoggedIn,
  handleLoginStatus,
}) => {
  return (
    <div className="wrapper">
      <ToastContainer />
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
            <Route path="/categories/update/:id" element={<UpdateCategory />} />
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

            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="users/update/:id" element={<UpdateUser />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<Home />} />
            <Route path="/productReport" element={<ProductStockReport />} />
          </>
        )}
      </Routes>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { darkMode } = useContext(ThemeContext);
  const appStyles = darkMode ? "app dark" : "app";

  const handleLoginStatus = (status: boolean) => {
    setLoginStatus(status);
  };

  const handleUserActivity = () => {
    setRemainingTime(5 * 60); //Setting  auto-logout time to 5 minutes

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const startTime = new Date(); // Log start time when timer resets
    // console.log(`User activity detected at ${startTime.toLocaleTimeString()}`);

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerRef.current!);
          localStorage.removeItem("token");
          setLoginStatus(false);
          navigate("/login");
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setLoginStatus(true);
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    const resetTimer = () => {
      handleUserActivity();
    };

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [setLoginStatus, navigate, location.pathname]);

  return (
    <div className={appStyles}>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} setLoginStatus={setLoginStatus} />
        <MainContent
          isLoggedIn={isLoggedIn}
          handleLoginStatus={handleLoginStatus}
        />
        <Footer />
      </div>
    </div>
  );
};
export default App;
