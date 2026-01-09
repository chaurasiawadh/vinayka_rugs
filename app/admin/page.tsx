"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag, Image as ImageIcon,
    LogOut, Plus, Trash2, Edit2, Loader, X,
    Info, List, Tag, Star, Layers
} from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useProducts } from '@/hooks/useFirestore';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import { CATEGORIES, COLLECTIONS, SIZES, REVIEW_TAGS } from '@/constants';
import { Product } from '@/types';

// Default State for New Product
const INITIAL_PRODUCT: Partial<Product> = {
    name: '',
    brand: 'Vinayka Rugs',
    sku: '',
    category: 'Modern',
    collection: '',
    description: '',
    shortDescription: '',
    price: '',
    mrp: '',
    discount: 0,
    taxInclusive: true,
    emiAvailable: true,
    images: [],
    sizes: [],
    colors: [],
    specifications: {
        // Features
        weaveType: 'Flat Woven',
        pileHeight: 'High Pile',
        construction: 'Handmade',
        indoorOutdoor: 'Indoor',
        stainResistant: 'Yes',
        specialFeatures: 'Fluffy',
        roomType: 'Living Room',
        waterResistance: 'Not Water Resistant',

        // Materials
        material: 'MICRO SILK FIBER',
        backMaterial: 'Cotton',
        careInstructions: 'Hand Wash Only',

        // Details
        brand: 'Carpet Collection',
        origin: 'India',
        includedComponents: 'Carpet',
        itemHeight: '5 cm',
        manufacturer: 'Carpet Collection',
        manufacturerContact: '',
        unitCount: '1.0 Count',
        warranty: '1 Year Warranty',

        // Style
        color: 'Multicolor',
        theme: 'Modern',
        pattern: 'Modern',
        shape: 'Rectangular',
        rugForm: 'Area Rug',
        style: 'Casual',
        occasion: 'Housewarming',

        // Measurements
        size: '',
        itemWeight: '12 Kilograms',
        dimensionsLxW: '',
        numberOfPieces: '1',
        itemThickness: '5 cm'
    },
    aboutItems: [],
    rating: 4.5,
    reviews: 0,
    reviewSummary: 'Customers find the rug to be well-made, soft, and comfortable.',
    reviewTags: [],
    reviewDistribution: { fiveStar: 70, fourStar: 20, threeStar: 5, twoStar: 2, oneStar: 3 },
    inStock: true,
    deliveryText: '7-10 Business Days',
    returnPolicy: '10 Days Return',
    isTrending: false,
    isNew: true
};

const ProductManager: React.FC = () => {
    const { products } = useProducts();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>(INITIAL_PRODUCT);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Helper to update nested state
    const updateField = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent: keyof Product, child: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as any),
                [child]: value
            }
        }));
    };

    // Pricing Calculator
    useEffect(() => {
        if (formData.price && formData.mrp && formData.mrp > formData.price) {
            const discount = Math.round(((formData.mrp - formData.price) / formData.mrp) * 100);
            updateField('discount', discount);
        }
    }, [formData.price, formData.mrp]);

    // Handle Array Fields (About Bullets, Colors)
    const handleArrayAdd = (field: 'aboutItems' | 'colors', value: string) => {
        if (!value) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value]
        }));
    };

    const handleArrayRemove = (field: 'aboutItems' | 'colors', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (fileOrUrl: File | string | null) => {
        if (!fileOrUrl) return;
        if ((formData.images?.length || 0) >= 10) {
            setUploadError("Maximum 10 images allowed.");
            return;
        }

        setLoading(true);
        try {
            let url = '';
            if (typeof fileOrUrl === 'string') {
                url = fileOrUrl;
            } else {
                const storageRef = ref(storage, `products/${Date.now()}_${fileOrUrl.name}`);
                await uploadBytes(storageRef, fileOrUrl);
                url = await getDownloadURL(storageRef);
            }
            setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
            setUploadError(null);
        } catch (err: any) {
            setUploadError(err.message?.includes('CORS') ? "CORS Error: Use 'Paste URL'" : "Upload Failed");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                updatedAt: serverTimestamp()
            };
            if (!formData.id) {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, 'products'), payload);
            } else {
                await updateDoc(doc(db, 'products', formData.id), payload);
            }
            setIsEditing(false);
            setFormData(INITIAL_PRODUCT);
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setFormData(product);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete product?')) await deleteDoc(doc(db, 'products', id));
    };

    // Reusable Specs Input Helper (Fixed focus issue)
    const renderSpecInput = (label: string, field: string, placeholder = '') => (
        <div key={field}>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">{label}</label>
            <input
                className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-terracotta focus:border-terracotta"
                value={(formData.specifications as any)?.[field] || ''}
                onChange={e => updateNestedField('specifications', field, e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    if (isEditing) {
        return (
            <form onSubmit={handleSave} className="bg-gray-50 min-h-screen p-6 pb-20">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white shadow-sm p-4 rounded-lg flex justify-between items-center mb-6 border border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold font-serif">{formData.id ? 'Edit Product' : 'New Product'}</h2>
                        <p className="text-xs text-text-muted">Fill in all details carefully</p>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Info */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800"><Info size={18} /> Basic Information</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Product Name</label>
                                    <input className="w-full border p-2 rounded" value={formData.name} onChange={e => updateField('name', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Brand</label>
                                    <input className="w-full border p-2 rounded" value={formData.brand} onChange={e => updateField('brand', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">SKU</label>
                                    <input className="w-full border p-2 rounded" value={formData.sku} onChange={e => updateField('sku', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Short Description (Card)</label>
                                    <input className="w-full border p-2 rounded" value={formData.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Full Description</label>
                                    <textarea className="w-full border p-2 rounded" rows={4} value={formData.description} onChange={e => updateField('description', e.target.value)} />
                                </div>
                            </div>
                        </section>

                        {/* Images */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="flex items-center gap-2 font-bold text-lg text-gray-800"><ImageIcon size={18} /> Media Gallery</h3>
                                <span className="text-xs text-gray-500">{formData.images?.length || 0} / 10 Images</span>
                            </div>

                            <div className="grid grid-cols-5 gap-4 mb-4">
                                {formData.images?.map((img, i) => (
                                    <div key={i} className="relative aspect-[4/5] rounded border bg-gray-50 overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white shadow-sm text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                        {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">Main</span>}
                                    </div>
                                ))}


                            </div>

                            {/* Add New Image */}
                            {(formData.images?.length || 0) < 10 && (
                                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Add New Image</h4>
                                    <ImageInput key={formData.images?.length} onChange={handleImageUpload} label="Paste Image URL" error={uploadError} />
                                </div>
                            )}
                        </section>

                        {/* Product Information Sections (Amazon Style) */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="flex items-center gap-2 font-bold mb-6 text-lg text-gray-800"><Layers size={18} /> Product Information</h3>

                            <div className="space-y-8">
                                {/* 1. Features & Specs */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Features & Specs</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderSpecInput("Weave Type", "weaveType")}
                                        {renderSpecInput("Pile Height", "pileHeight")}
                                        {renderSpecInput("Construction Type", "construction")}
                                        {renderSpecInput("Indoor/Outdoor", "indoorOutdoor")}
                                        {renderSpecInput("Stain Resistant?", "stainResistant")}
                                        {renderSpecInput("Special Features", "specialFeatures")}
                                        {renderSpecInput("Room Type", "roomType")}
                                        {renderSpecInput("Water Resistance", "waterResistance")}
                                    </div>
                                </div>

                                {/* 2. Materials & Care */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Materials & Care</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderSpecInput("Material", "material")}
                                        {renderSpecInput("Back Material", "backMaterial")}
                                        {renderSpecInput("Care Instructions", "careInstructions")}
                                    </div>
                                </div>

                                {/* 3. Item Details */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Item Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderSpecInput("Brand Name", "brand")}
                                        {renderSpecInput("Country of Origin", "origin")}
                                        {renderSpecInput("Included Components", "includedComponents")}
                                        {renderSpecInput("Manufacturer", "manufacturer")}
                                        {renderSpecInput("Manufacturer Contact", "manufacturerContact")}
                                        {renderSpecInput("Unit Count", "unitCount")}
                                        {renderSpecInput("Warranty", "warranty")}
                                    </div>
                                </div>

                                {/* 4. Style */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Style</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderSpecInput("Colour", "color")}
                                        {renderSpecInput("Theme", "theme")}
                                        {renderSpecInput("Pattern", "pattern")}
                                        {renderSpecInput("Item Shape", "shape")}
                                        {renderSpecInput("Rug Form Type", "rugForm")}
                                        {renderSpecInput("Style", "style")}
                                        {renderSpecInput("Occasion", "occasion")}
                                    </div>
                                </div>

                                {/* 5. Measurements */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Measurements</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderSpecInput("Size (Text)", "size", "e.g. 5x7 feet")}
                                        {renderSpecInput("Item Weight", "itemWeight")}
                                        {renderSpecInput("Dimensions (LxW)", "dimensionsLxW", "e.g. 2.13L x 1.52W Meters")}
                                        {renderSpecInput("Number of Pieces", "numberOfPieces")}
                                        {renderSpecInput("Item Thickness/Height", "itemThickness")}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* About Bullets */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800"><List size={18} /> About This Item (Bullet Points)</h3>
                            <div className="space-y-2 mb-4">
                                {formData.aboutItems?.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input className="flex-1 border p-2 rounded text-sm" value={item} onChange={(e) => {
                                            const newItems = [...(formData.aboutItems || [])];
                                            newItems[i] = e.target.value;
                                            updateField('aboutItems', newItems);
                                        }} />
                                        <button type="button" onClick={() => handleArrayRemove('aboutItems', i)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => handleArrayAdd('aboutItems', 'New Feature')}>+ Add Bullet Point</Button>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">

                        {/* Pricing */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800"><Tag size={18} /> Pricing</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">MRP (₹)</label>
                                    <input type="number" className="w-full border p-2 rounded" value={formData.mrp} onChange={e => updateField('mrp', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Selling Price (₹)</label>
                                    <input type="number" className="w-full border p-2 rounded font-bold text-lg" value={formData.price} onChange={e => updateField('price', Number(e.target.value))} />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Discount:</span>
                                    <span className="font-bold text-green-600">{formData.discount}% OFF</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.taxInclusive} onChange={e => updateField('taxInclusive', e.target.checked)} />
                                    <span className="text-sm">Price inclusive of taxes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.emiAvailable} onChange={e => updateField('emiAvailable', e.target.checked)} />
                                    <span className="text-sm">EMI Available</span>
                                </div>
                            </div>
                        </section>

                        {/* Categorization */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold mb-4 text-lg text-gray-800">Categorization</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                                    <select className="w-full border p-2 rounded" value={formData.category} onChange={e => updateField('category', e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Collection</label>
                                    <select className="w-full border p-2 rounded" value={formData.collection} onChange={e => updateField('collection', e.target.value)}>
                                        <option value="">None</option>
                                        {COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isNew} onChange={e => updateField('isNew', e.target.checked)} /> New Arrival</label>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isTrending} onChange={e => updateField('isTrending', e.target.checked)} /> Trending</label>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isSale} onChange={e => updateField('isSale', e.target.checked)} /> On Sale</label>
                                </div>
                            </div>
                        </section>

                        {/* Sizes & Stock */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold mb-4 text-lg text-gray-800">Sizes & Stock</h3>
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {SIZES.map(size => (
                                        <button
                                            type="button"
                                            key={size}
                                            onClick={() => {
                                                const current = formData.sizes || [];
                                                updateField('sizes', current.includes(size) ? current.filter(s => s !== size) : [...current, size]);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs border transition-colors ${formData.sizes?.includes(size) ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Delivery Text</label>
                                    <input className="w-full border p-2 rounded" value={formData.deliveryText} onChange={e => updateField('deliveryText', e.target.value)} />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={formData.inStock} onChange={e => updateField('inStock', e.target.checked)} /> In Stock</label>
                                </div>
                            </div>
                        </section>

                        {/* Reviews (Admin Controlled) */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800"><Star size={18} /> Reviews (Admin)</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Rating (0-5)</label>
                                    <input type="number" step="0.1" max="5" className="w-full border p-2 rounded" value={formData.rating} onChange={e => updateField('rating', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Count</label>
                                    <input type="number" className="w-full border p-2 rounded" value={formData.reviews} onChange={e => updateField('reviews', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase text-gray-500">"Customers Say" Summary</label>
                                <textarea className="w-full border p-2 rounded" rows={3} value={formData.reviewSummary} onChange={e => updateField('reviewSummary', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Review Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {REVIEW_TAGS.map(tag => (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => {
                                                const current = formData.reviewTags || [];
                                                updateField('reviewTags', current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]);
                                            }}
                                            className={`px-2 py-1 rounded-sm text-xs border transition-colors ${formData.reviewTags?.includes(tag) ? 'bg-green-100 border-green-200 text-green-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </form>
        );
    }

    // List View
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif">Product Inventory</h2>
                <Button onClick={() => { setFormData(INITIAL_PRODUCT); setIsEditing(true); }}>
                    <Plus size={18} className="mr-2" /> Add Product
                </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-text-muted text-sm uppercase">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Stats</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 flex gap-3 items-center">
                                    <img src={p.images[0]} className="h-10 w-10 rounded object-cover" />
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-text-muted">{p.category}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div>₹{p.price.toLocaleString()}</div>
                                    {p.mrp > p.price && <div className="text-xs text-gray-400 line-through">₹{p.mrp.toLocaleString()}</div>}
                                </td>
                                <td className="p-4">
                                    {p.inStock ? <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">In Stock</span> : <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">Out of Stock</span>}
                                </td>
                                <td className="p-4 text-xs text-text-muted">
                                    ★ {p.rating} ({p.reviews})
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-gray-200 rounded text-gray-600"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-error/10 rounded text-error"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Admin: React.FC = () => {
    const { user, userProfile, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/admin/login');
            } else if (userProfile && userProfile.role !== 'admin') {
                router.replace('/'); // Redirect non-admins to home
            }
        }
    }, [user, userProfile, loading, router]);

    if (loading || !user || (userProfile?.role !== 'admin')) {
        return (
            <div className="h-screen flex items-center justify-center flex-col gap-4">
                <Loader className="animate-spin text-terracotta" size={40} />
                <p className="text-sm text-gray-500 animate-pulse">Verifying privileges...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0 z-20">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="font-serif text-2xl font-bold">Admin<span className="text-terracotta">Panel</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-terracotta text-white">
                        <ShoppingBag size={20} /> Products
                    </button>
                    {/* Add more nav items here later (Orders, etc) */}
                </nav>
                <div className="p-4 border-t">
                    <div className="mb-4 px-2">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Logged In As</div>
                        <div className="text-sm font-medium truncate">{userProfile?.firstName} {userProfile?.lastName}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-error hover:bg-error/5 p-2 rounded w-full transition-colors">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <ProductManager />
            </main>
        </div>
    );
};

export default Admin;
