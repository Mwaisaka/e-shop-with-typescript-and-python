import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element = {<Home />}/>
            <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
    )
}