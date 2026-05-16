import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import CheckOut from "../pages/CheckOut";
import SignIn from "../components/cart/SignIn";
import SignUp from "../components/cart/SignUp";
import OrderSuccess from "../pages/OrderSuccess";


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
            <Route path="/checkout/" element = {<CheckOut/>}/>
            <Route path="/sign-in/" element = {<SignIn />}/>
            <Route path="/sign-up/" element = {<SignUp />}/>
            <Route path="/order-success/" element = {<OrderSuccess />}/>
        </Routes>
    )
}