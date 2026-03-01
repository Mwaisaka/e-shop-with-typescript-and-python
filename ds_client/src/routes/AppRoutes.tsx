import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element = {<Home />}/>
            <Route path="/products/:id/" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password/" element={<ResetPassword />}/>
        </Routes>
    )
}