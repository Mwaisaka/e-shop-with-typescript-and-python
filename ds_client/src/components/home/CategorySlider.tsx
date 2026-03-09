
export default function CategorySlider() {

    const categories = [
        {
            name: "Mens Shirts",
            image: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
            text: "Upgrade Your Style",
        },
        {
            name: "Women Dresses",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            text: "Elegance Redefined",
        },
        {
            name: "Men Shoes",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            text: "Step Into Comfort",
        },
        {
            name: "Men Shorts",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
            text: "Stay Cool",
        },
        {
            name: "Women Bags",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            text: "Carry in Style",
        },
        {
            name: "Sports Wear",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            text: "Move Freely",
        },
    ];

    const sliderItems = [...categories, ...categories];

    return (
        <div className="mb-10 overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">
                🔥 Trending Categories
            </h2>

            <div className="w-full overflow-hidden">
                <div className="flex animate-scroll gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="min-w-[250] relative h-[180px] rounded-xl overflow-hidden shadow hover:scale-105 transition"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
                                <h3 className="text-lg font-bold">{cat.name}</h3>
                                <p className="text-sm">{cat.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}