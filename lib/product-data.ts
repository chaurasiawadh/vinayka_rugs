export const PRODUCTS = [
    {
        id: "1",
        name: "Legacy Hand-Knotted Wool Rug",
        brand: "VINAYKA RUGS",
        price: 196000,
        originalPrice: 256000,
        discount: "Save ₹60,000",
        rating: 5.0,
        reviewsCount: 12,
        description: "Experience the timeless elegance of the Legacy collection. Meticulously hand-knotted by skilled artisans, this rug features a sophisticated traditional pattern reimagined for modern interiors. Crafted from premium New Zealand wool, it offers a luxurious underfoot feel and exceptional durability.",
        images: [
            "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1608724553456-89e963624dbb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJ1Z3xlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cnVnfGVufDB8fDB8fHww", 
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
        ],
        sizes: ["6' x 9'", "8' x 10'", "9' x 12'", "10' x 14'"],
        tags: ["BEST SELLER", "HAND KNOTTED"],
        details: "Construction: Hand Knotted\nKnot Count: 100 knots per sq. inch\nPile Height: 0.5 inches\nOrigin: Bhadohi, India",
        material: "100% Premium New Zealand Wool on Cotton Foundation",
        careInstructions: "Vacuum regularly on a low setting without a beater bar. blot spills immediately with a clean, white cloth. Professional rug cleaning recommended every 3-5 years.",
        shipping: "Free shipping worldwide. Ships within 5-7 business days.",
    },
    {
        id: "2",
        name: "Abstract Silk & Wool Blend",
        brand: "VINAYKA RUGS",
        price: 304000,
        rating: 4.8,
        reviewsCount: 8,
        images: ["https://images.unsplash.com/photo-1570197788417-0e289a9da872?auto=format&fit=crop&q=80&w=1200"],
        sizes: ["8' x 10'", "9' x 12'"],
        tags: ["MODERN", "LUXURY"],
        details: "Construction: Hand Knotted\nOrigin: Jaipur, India",
        material: "60% Wool, 40% Bamboo Silk",
        careInstructions: "Professional clean only.",
        shipping: "Free shipping worldwide."
    },
    {
        id: "3",
        name: "Vintage Oushak Revival",
        brand: "VINAYKA RUGS",
        price: 336000,
        originalPrice: 384000,
        rating: 4.9,
        reviewsCount: 15,
        images: ["https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&q=80&w=1200"],
        sizes: ["9' x 12'", "12' x 15'"],
        tags: ["VINTAGE WASH"],
        details: "Construction: Hand Knotted\nFinish: Antique Wash\nOrigin: Turkey",
        material: "100% Hand-spun Wool",
        careInstructions: "Vacuum gently. Professional cleaning recommended.",
        shipping: "Ships in 2-3 weeks."
    },
    {
        id: "4",
        name: "Minimalist Jute Texture",
        brand: "VINAYKA RUGS",
        price: 68000,
        rating: 4.5,
        reviewsCount: 32,
        images: ["https://images.unsplash.com/photo-1596558450255-70077979f454?auto=format&fit=crop&q=80&w=1200"],
        sizes: ["5' x 8'", "8' x 10'"],
        tags: ["ECO FRIENDLY", "NATURAL"],
        details: "Construction: Hand Loomed\nOrigin: India",
        material: "100% Natural Jute",
        careInstructions: "Vacuum regularly. Spot clean with mild detergent.",
        shipping: "In stock, ships in 48 hours."
    }
];

export const REVIEWS = [
    {
        id: "1",
        author: "Sarah J.",
        verified: true,
        rating: 5,
        date: "2 weeks ago",
        content: "The quality of this rug is outstanding. It totally transformed my living room. The wool is so soft and the colors are even more beautiful in person.",
        images: ["https://placehold.co/400x400?text=Review+Image"]
    },
    {
        id: "2",
        author: "Michael T.",
        verified: true,
        rating: 5,
        date: "1 month ago",
        content: "Exceptional craftsmanship. You can tell it's hand-knotted. Customer service was also very helpful with sizing questions.",
    }
];

export const FAQS = [
    {
        question: "How do I choose the right size rug?",
        answer: "A general rule is to leave 12-18 inches of floor exposed on all sides. For living rooms, ensure at least the front legs of furniture are on the rug."
    },
    {
        question: "Do you offer custom sizes?",
        answer: "Yes, as a bespoke manufacturer, we can create this design in any size or shape. Please contact our Bespoke team for a quote."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for standard sizes. Custom orders are final sale."
    },
    {
        question: "Is padding recommended?",
        answer: "Yes, we recommend a high-quality rug pad to prevent slipping, extend the life of the rug, and provide extra cushioning."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we offer free worldwide shipping on all our hand-knotted rugs."
    }
];
