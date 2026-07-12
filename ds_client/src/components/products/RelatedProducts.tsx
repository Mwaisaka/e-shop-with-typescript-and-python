import { useState , useEffect} from "react";
import { Product } from "../../types/product";
import { fetchRelatedProducts } from "../../api/products";
import ProductCard from "./ProductCard";

interface props{
    productId : number;
}
export default function RelatedProducts({productId}: props){

    const [products, setProucts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        try{
            setLoading(true);

            const res = await fetchRelatedProducts(productId);

            setProucts(res.data);

        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        loadProducts();
    }, [productId]);

    if(loading){
        return <p>Loading related products...</p>;
    }

    if(products.length === 0){
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {products.map((product) => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );

}