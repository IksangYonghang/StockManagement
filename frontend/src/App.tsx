import { useContext } from "react";
import { ThemeContext } from "./context/theme.context";
import Navbar from "./components/navbar/Navbar.component";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  const { darkMode } = useContext(ThemeContext);

  const appStyles = darkMode ? "app dark" : "app";

  return (
    <div className={appStyles}>
      <Navbar />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companies">
            <Route index element={<Companies />} />
            <Route path="add" element={<AddCompany />} />
            <Route path="update/:id" element={<UpdateCompany />} />
          </Route>
          <Route path="/categories">
            <Route index element={<Categories />} />
            <Route path="add" element={<AddCategory />} />
            <Route path="update/:id" element={<UpdateCategory />} />
          </Route>
          <Route path="/ledgers">
            <Route index element={<Ledgers />} />
            <Route path="add" element={<AddLedger />} />
            <Route path="update/:id" element={<UpdateLedger />} />
          </Route>
          <Route path="/transactions">
            <Route index element={<Transaction />} />
            <Route path="add" element={<AddTransaction />} />
            <Route path="update/:id" element={<UpdateTransaction />} />
          </Route>
          <Route path="/products">
            <Route index element={<Products />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="update/:id" element={<UpdateProduct />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
