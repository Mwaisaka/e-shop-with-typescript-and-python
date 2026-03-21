import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element = {<Home />}/>
            <Route path="/products/:id/" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password/" element={<ForgotPassword />}/>
            <Route path="/reset-password/:uid/:token/" element={<ResetPassword />}/>
            <Route path="/profile/" element ={<Profile />}/>
            <Route path="/cart/" element={<Cart />} />
        </Routes>
    )
}