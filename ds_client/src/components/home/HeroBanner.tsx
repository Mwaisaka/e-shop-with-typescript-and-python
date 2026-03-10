import { useState, useEffect } from "react";

export default function HeroBanner() {
    const slides = [
        {
            title: "Summer Fashion Sale",
            subtitle: "Up to 50% Off Selected Items",
            image: "https://images.unsplash.com/photo-1521334884684-d80222895322",
            button: "Shop Now",
        },
        {
            title: "New Arrivals",
            subtitle: "Discover the Latest Trends",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
            button: "Explore",
        },
        {
            title: "Trendy Collection",
            subtitle: "Move with Confidence With Trendy Fashionwear",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
            button: "Shop Now",
        },
        {
            title: "Women Fashion Sale",
            subtitle: "Elegant Styles Up To 40% Off",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            button: "Explore Dresses",
        },
        {
            title: "Premium Menswear",
            subtitle: "Upgrade Your Wardrobe With Modern Style",
            image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
            button: "Shop Menswear",
        },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const slide = slides[index];

    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl mb-10">
            <img
                src={slide.image}
                loading="lazy"
                className="w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">

                <h1 className="text-4xl font-bold mb-2">
                    {slide.title}
                </h1>

                <p className="text-lg mb-4">
                    {slide.subtitle}
                </p>

                <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                    {slide.button}
                </button>

            </div>
        </div>
    );
}