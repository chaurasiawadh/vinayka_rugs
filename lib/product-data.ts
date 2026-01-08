export const PRODUCTS = [
    {
        id: "1",
        name: "Oh My Bod! Sunscreen Lotion",
        brand: "EVERYDAY HUMANS",
        price: 16.00,
        originalPrice: 20.00,
        discount: "20%",
        rating: 4.5,
        reviewsCount: 214,
        description: "A reliable bodyguard for your skin, with secret uses. This lightweight, long lasting SPF50 sunscreen lotion will save you from the harshest midday sun, while also protecting dry skin, discoloured tattoos, darker scars, gel manicure UV exposures and more.",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1556228720-19777f98018e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000",
        ],
        sizes: ["50ml", "100ml"],
        tags: ["BEST SELLER"],
        details: "A reliable bodyguard for your skin, with secret uses. This lightweight, long lasting SPF50 sunscreen lotion will save you from the harshest midday sun.",
        benefits: "Protects against UV rays, moisturizes skin, and helps fade scars.",
        howToUse: "Apply generously to all exposed skin 20 minutes before sun exposure.",
        ingredients: "Water, Homosalate, Octocrylene, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane...",
    },
    {
        id: "2",
        name: "Turmeric Clarifying Face Wash",
        brand: "VYA NATURALS",
        price: 34.00,
        rating: 4.0,
        reviewsCount: 24,
        images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=1000"],
        tags: ["NEW"]
    },
    {
        id: "3",
        name: "Hyaluronic Acid Toner Plus",
        brand: "ISTREE",
        price: 30.00,
        originalPrice: 38.00,
        rating: 5.0,
        reviewsCount: 67,
        images: ["https://images.unsplash.com/photo-1571781565036-d3f752df25be?auto=format&fit=crop&q=80&w=1000"],
        tags: ["LIMITED OFFER"]
    },
    {
        id: "4",
        name: "Purify Body",
        brand: "FRE",
        price: 24.00,
        originalPrice: 30.00,
        rating: 4.8,
        reviewsCount: 214,
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000"],
        tags: ["BEST SELLER"]
    },
    {
        id: "5",
        name: "Squalane Cleanser",
        brand: "THE ORDINARY",
        price: 36.00,
        rating: 4.2,
        reviewsCount: 80,
        images: ["https://images.unsplash.com/photo-1620917670732-c7f3e82ac973?auto=format&fit=crop&q=80&w=1000"],
        tags: ["BEST SELLER"]
    }
];

export const REVIEWS = [
    {
        id: "1",
        author: "Isabella P.",
        verified: true,
        rating: 5,
        date: "Today",
        content: "Absolutely love this sunscreen! It feels lightweight, blends seamlessly into my skin without any white cast, and leaves a soft, dewy finish. Plus, knowing it's reef-safe and packed with nourishing ingredients makes it a must-have in my daily routine. Highly recommend!",
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100"]
    },
    {
        id: "2",
        author: "Liam S.",
        verified: true,
        rating: 5,
        date: "Yesterday",
        content: "I've been searching for the perfect moisturizer, and I finally found it! This product is so hydrating, absorbs quickly, and doesn't leave a greasy residue. The natural ingredients make my skin feel revitalized and refreshed. It's definitely a new staple in my skincare regimen.",
    }
];

export const FAQS = [
    {
        question: "Are your products vegan and cruelty-free?",
        answer: "Yes, all Lumina products are 100% vegan and cruelty-free. We use no animal-derived ingredients, and no animals are harmed or tested upon during any stage of production."
    },
    {
        question: "Do your products contain parabens or sulfates?",
        answer: "No, our products are formulated without parabens, sulfates, or other harmful chemicals."
    },
    {
        question: "Are your products suitable for sensitive skin?",
        answer: "Many of our products are designed with sensitive skin in mind, but we always recommend patch testing."
    },
    {
        question: "How do I know which product is right for my skin type?",
        answer: "You can use our skin quiz or consult the product details for skin type recommendations."
    },
    {
        question: "Where are your products made?",
        answer: "Our products are ethically manufactured in certified facilities in the USA and South Korea."
    }
];
