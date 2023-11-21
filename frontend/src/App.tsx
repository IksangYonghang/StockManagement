import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
const App = () => {
  const [isLoggedIn, setLoginStatus] = useState(false);

  const handleLoginStatus = (status: boolean) => {
    setLoginStatus(status);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setLoginStatus(true);
    }
  }, []);

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
            </>
          )}
        </Routes>
      </div>
      {isLoggedIn && <Footer />} {/* Render footer only when logged in */}
    </div>
  );
};

export default App;
