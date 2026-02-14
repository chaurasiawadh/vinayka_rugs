'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Info,
  List,
  Tag,
  Star,
  Layers,
  Image as ImageIcon,
  Smartphone,
  MessageSquare,
} from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useProducts } from '@/hooks/useFirestore';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import {
  CATEGORIES,
  SIZES,
  REVIEW_TAGS,
  MATERIALS,
  ROOMS,
  SHAPES,
} from '@/constants';
import {
  getCustomValues,
  addCustomValue,
  CustomFieldType,
} from '@/lib/customValues';
import { Product } from '@/types';
import DeleteConfirmModal from './DeleteConfirmModal';

// Default State for New Product
const INITIAL_PRODUCT: Partial<Product> = {
  name: '',
  brand: 'Vinayka Rugs',
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
  sizePrices: {},
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
    // manufacturer: 'Carpet Collection',
    // manufacturerContact: '',
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
    quality: '',
  },
  aboutItems: [],
  rating: 0,
  reviews: 0,
  reviewSummary: '',
  reviewTags: [],
  reviewDistribution: {
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  },
  inStock: true,
  deliveryText: '7-10 Business Days',
  returnPolicy: '10 Days Return',
  isTrending: false,
  isNew: true,
  arAssets: {
    glbUrl: '',
    usdzUrl: '',
    placement: 'floor',
  },
};

const ProductManager = () => {
  const router = useRouter();
  const { products } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(INITIAL_PRODUCT);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [customMaterials, setCustomMaterials] = useState<string[]>([]);
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [customShapes, setCustomShapes] = useState<string[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState<{
    field: CustomFieldType | null;
    value: string;
  }>({ field: null, value: '' });

  // Load custom values on mount
  useEffect(() => {
    const loadCustomValues = async () => {
      const materials = await getCustomValues('materials');
      const rooms = await getCustomValues('rooms');
      const shapes = await getCustomValues('shapes');
      setCustomMaterials(materials);
      setCustomRooms(rooms);
      setCustomShapes(shapes);
    };
    loadCustomValues();
  }, []);

  // Handler for adding custom values
  const handleAddCustomValue = async () => {
    if (!isAddingCustom.field || !isAddingCustom.value.trim()) return;

    const success = await addCustomValue(
      isAddingCustom.field,
      isAddingCustom.value.trim()
    );

    if (success) {
      // Update local state
      if (isAddingCustom.field === 'materials') {
        setCustomMaterials((prev) => [...prev, isAddingCustom.value.trim()]);
      } else if (isAddingCustom.field === 'rooms') {
        setCustomRooms((prev) => [...prev, isAddingCustom.value.trim()]);
      } else if (isAddingCustom.field === 'shapes') {
        setCustomShapes((prev) => [...prev, isAddingCustom.value.trim()]);
      }

      setIsAddingCustom({ field: null, value: '' });
    } else {
      alert('Failed to add custom value. Please try again.');
    }
  };

  // Helper to update nested state
  const updateField = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (
    parent: keyof Product,
    child: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value,
      },
    }));
  };

  // Pricing Calculator
  useEffect(() => {
    if (formData.price && formData.mrp && formData.mrp > formData.price) {
      const discount = Math.round(
        ((Number(formData.mrp) - Number(formData.price)) /
          Number(formData.mrp)) *
          100
      );
      setFormData((prev) => ({ ...prev, discount }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.price, formData.mrp]);

  // Handle Array Fields (About Bullets, Colors)
  const handleArrayAdd = (field: 'aboutItems' | 'colors', value: string) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const handleArrayRemove = (field: 'aboutItems' | 'colors', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleARFileUpload = async (
    file: File | null,
    type: 'glbUrl' | 'usdzUrl'
  ) => {
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `ar-assets/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        arAssets: {
          ...(prev.arAssets || {
            glbUrl: '',
            usdzUrl: '',
            placement: 'floor',
          }),
          [type]: url,
        },
      }));
      setUploadError(null);
    } catch (err: any) {
      setUploadError('AR Upload Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (fileOrUrl: File | string | null) => {
    if (!fileOrUrl) return;
    if ((formData.images?.length || 0) >= 10) {
      setUploadError('Maximum 10 images allowed.');
      return;
    }

    setLoading(true);
    try {
      let url = '';
      if (typeof fileOrUrl === 'string') {
        url = fileOrUrl;
      } else {
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${fileOrUrl.name}`
        );
        await uploadBytes(storageRef, fileOrUrl);
        url = await getDownloadURL(storageRef);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
      setUploadError(null);
    } catch (err: any) {
      setUploadError(
        err.message?.includes('CORS')
          ? "CORS Error: Use 'Paste URL'"
          : 'Upload Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp(),
      };
      if (!formData.id) {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), payload);
      } else {
        await updateDoc(doc(db, 'products', formData.id), payload);
      }
      setIsEditing(false);
      setFormData(INITIAL_PRODUCT);
      setUploadError(null);
    } catch (err: any) {
      alert(`Error saving product: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'products', deleteModal.id));
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  // Reusable Specs Input Helper
  const renderSpecInput = (label: string, field: string, placeholder = '') => (
    <div key={field}>
      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
        {label}
      </label>
      <input
        className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-terracotta focus:border-terracotta"
        value={(formData.specifications as any)?.[field] || ''}
        onChange={(e) =>
          updateNestedField('specifications', field, e.target.value)
        }
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
            <h2 className="text-xl font-bold font-serif">
              {formData.id ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="text-xs text-text-muted">
              Fill in all details carefully
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800">
                <Info size={18} /> Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Product Name
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Brand
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={formData.brand}
                    onChange={(e) => updateField('brand', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Short Description (Card)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      updateField('shortDescription', e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Full Description
                  </label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 font-bold text-lg text-gray-800">
                  <ImageIcon size={18} /> Media Gallery
                </h3>
                <span className="text-xs text-gray-500">
                  {formData.images?.length || 0} / 10 Images
                </span>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-4">
                {formData.images?.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded border bg-gray-50 overflow-hidden group"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Product ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white shadow-sm text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Image */}
              {(formData.images?.length || 0) < 10 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ImageInput
                    key={formData.images?.length}
                    onChange={handleImageUpload}
                    label="Add Product Image"
                    error={uploadError}
                    showFileUpload={false}
                  />
                </div>
              )}
            </section>

            {/* Product Information Sections (Amazon Style) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-6 text-lg text-gray-800">
                <Layers size={18} /> Product Information
              </h3>

              <div className="space-y-8">
                {/* 1. Features & Specs */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    Features & Specs
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {renderSpecInput('Weave Type', 'weaveType')}
                    {renderSpecInput('Pile Height', 'pileHeight')}
                    {renderSpecInput('Construction Type', 'construction')}
                    {renderSpecInput('Indoor/Outdoor', 'indoorOutdoor')}
                    {renderSpecInput('Stain Resistant?', 'stainResistant')}
                    {renderSpecInput('Special Features', 'specialFeatures')}
                    {renderSpecInput('Water Resistance', 'waterResistance')}
                    {renderSpecInput('Quality', 'quality')}
                  </div>
                </div>

                {/* 2. Materials & Care */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    Materials & Care
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {renderSpecInput('Back Material', 'backMaterial')}
                    {renderSpecInput('Care Instructions', 'careInstructions')}
                  </div>
                </div>

                {/* 3. Item Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    Item Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {renderSpecInput('Brand Name', 'brand')}
                    {renderSpecInput('Country of Origin', 'origin')}
                    {renderSpecInput(
                      'Included Components',
                      'includedComponents'
                    )}
                    {/* {renderSpecInput('Manufacturer', 'manufacturer')}
                    {renderSpecInput(
                      'Manufacturer Contact',
                      'manufacturerContact'
                    )} */}
                    {renderSpecInput('Unit Count', 'unitCount')}
                    {renderSpecInput('Warranty', 'warranty')}
                  </div>
                </div>

                {/* 4. Style */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-terracotta uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    Style
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {renderSpecInput('Colour', 'color')}
                    {renderSpecInput('Theme', 'theme')}
                    {renderSpecInput('Pattern', 'pattern')}

                    {renderSpecInput('Rug Form Type', 'rugForm')}
                    {renderSpecInput('Style', 'style')}
                    {renderSpecInput('Occasion', 'occasion')}
                  </div>
                </div>
              </div>
            </section>

            {/* AR / Live View Assets */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800">
                <Smartphone size={18} /> AR / Live View 3D Models
              </h3>
              <div className="space-y-4">
                {/* GLB Upload */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                    Android Model (.glb)
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded text-xs"
                      value={formData.arAssets?.glbUrl || ''}
                      placeholder="https://.../model.glb"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          arAssets: {
                            ...(prev.arAssets as any),
                            glbUrl: e.target.value,
                          },
                        }))
                      }
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3 flex items-center justify-center cursor-pointer text-xs font-medium transition-colors">
                      Upload
                      <input
                        type="file"
                        accept=".glb"
                        className="hidden"
                        onChange={(e) =>
                          handleARFileUpload(
                            e.target.files ? e.target.files[0] : null,
                            'glbUrl'
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* USDZ Upload */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                    iOS Model (.usdz)
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded text-xs"
                      value={formData.arAssets?.usdzUrl || ''}
                      placeholder="https://.../model.usdz"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          arAssets: {
                            ...(prev.arAssets as any),
                            usdzUrl: e.target.value,
                          },
                        }))
                      }
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3 flex items-center justify-center cursor-pointer text-xs font-medium transition-colors">
                      Upload
                      <input
                        type="file"
                        accept=".usdz"
                        className="hidden"
                        onChange={(e) =>
                          handleARFileUpload(
                            e.target.files ? e.target.files[0] : null,
                            'usdzUrl'
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Placement */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                    Placement Type
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm"
                    value={formData.arAssets?.placement || 'floor'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arAssets: {
                          ...(prev.arAssets as any),
                          placement: e.target.value as 'floor' | 'wall',
                        },
                      }))
                    }
                  >
                    <option value="floor">Floor (Rugs, Tables)</option>
                    <option value="wall">Wall (Art, Curtains)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* About Bullets */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800">
                <List size={18} /> About This Item (Bullet Points)
              </h3>
              <div className="space-y-2 mb-4">
                {formData.aboutItems?.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded text-sm"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(formData.aboutItems || [])];
                        newItems[i] = e.target.value;
                        updateField('aboutItems', newItems);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('aboutItems', i)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayAdd('aboutItems', 'New Feature')}
              >
                + Add Bullet Point
              </Button>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Pricing */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800">
                <Tag size={18} /> Pricing
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                  <strong>Note:</strong> Product Price and MRP are automatically
                  set based on the <strong>first size</strong> entered below.
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="font-bold text-green-600">
                    {formData.discount}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.taxInclusive}
                    onChange={(e) =>
                      updateField('taxInclusive', e.target.checked)
                    }
                  />
                  <span className="text-sm">Price inclusive of taxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.emiAvailable}
                    onChange={(e) =>
                      updateField('emiAvailable', e.target.checked)
                    }
                  />
                  <span className="text-sm">EMI Available</span>
                </div>
              </div>
            </section>

            {/* Categorization */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold mb-4 text-lg text-gray-800">
                Categorization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Category
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Collection
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={formData.collection || ''}
                    onChange={(e) => updateField('collection', e.target.value)}
                    placeholder="e.g., Viraasat, Aether, Silk Route"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                    Material
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[...MATERIALS, ...customMaterials].map((m) => {
                      const current = (formData.specifications as any)
                        ?.material;
                      const isSelected = Array.isArray(current)
                        ? current.includes(m)
                        : current === m;
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            let currentArray = Array.isArray(current)
                              ? current
                              : current
                                ? [current]
                                : [];

                            // Auto-heal fragmented strings
                            const chars = currentArray.filter(
                              (x: any) =>
                                typeof x === 'string' && x.length === 1
                            );
                            if (chars.length > 0) {
                              const merged = chars
                                .join('')
                                .replace(/,/g, '')
                                .trim();
                              const words = currentArray.filter(
                                (x: any) =>
                                  typeof x === 'string' && x.length > 1
                              );
                              if (merged) words.push(merged);
                              currentArray = words;
                            }

                            const newValue = currentArray.includes(m)
                              ? currentArray.filter((i: string) => i !== m)
                              : [...currentArray, m];
                            updateNestedField(
                              'specifications',
                              'material',
                              newValue
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${isSelected ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                  {isAddingCustom.field === 'materials' ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={isAddingCustom.value}
                        onChange={(e) =>
                          setIsAddingCustom({
                            ...isAddingCustom,
                            value: e.target.value,
                          })
                        }
                        placeholder="Enter new material"
                        className="flex-1 border border-gray-300 p-2 rounded text-sm"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomValue();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomValue}
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setIsAddingCustom({ field: null, value: '' })
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddingCustom({ field: 'materials', value: '' })
                      }
                      className="px-3 py-1 rounded-full text-xs border border-dashed border-gray-400 text-gray-600 hover:border-terracotta hover:text-terracotta transition-colors mt-2"
                    >
                      + Add New Material
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                    Room
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[...ROOMS, ...customRooms].map((r) => {
                      const current = (formData.specifications as any)
                        ?.roomType;
                      const isSelected = Array.isArray(current)
                        ? current.includes(r)
                        : current === r;
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() => {
                            let currentArray = Array.isArray(current)
                              ? current
                              : current
                                ? [current]
                                : [];

                            // Auto-heal fragmented strings
                            const chars = currentArray.filter(
                              (x: any) =>
                                typeof x === 'string' && x.length === 1
                            );
                            if (chars.length > 0) {
                              const merged = chars
                                .join('')
                                .replace(/,/g, '')
                                .trim();
                              const words = currentArray.filter(
                                (x: any) =>
                                  typeof x === 'string' && x.length > 1
                              );
                              if (merged) words.push(merged);
                              currentArray = words;
                            }

                            const newValue = currentArray.includes(r)
                              ? currentArray.filter((i: string) => i !== r)
                              : [...currentArray, r];
                            updateNestedField(
                              'specifications',
                              'roomType',
                              newValue
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${isSelected ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                  {isAddingCustom.field === 'rooms' ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={isAddingCustom.value}
                        onChange={(e) =>
                          setIsAddingCustom({
                            ...isAddingCustom,
                            value: e.target.value,
                          })
                        }
                        placeholder="Enter new room type"
                        className="flex-1 border border-gray-300 p-2 rounded text-sm"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomValue();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomValue}
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setIsAddingCustom({ field: null, value: '' })
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddingCustom({ field: 'rooms', value: '' })
                      }
                      className="px-3 py-1 rounded-full text-xs border border-dashed border-gray-400 text-gray-600 hover:border-terracotta hover:text-terracotta transition-colors mt-2"
                    >
                      + Add New Room
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                    Shape
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[...SHAPES, ...customShapes].map((s) => {
                      const current = (formData.specifications as any)?.shape;
                      const isSelected = Array.isArray(current)
                        ? current.includes(s)
                        : current === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => {
                            let currentArray = Array.isArray(current)
                              ? current
                              : current
                                ? [current]
                                : [];

                            // Auto-heal fragmented strings
                            const chars = currentArray.filter(
                              (x: any) =>
                                typeof x === 'string' && x.length === 1
                            );
                            if (chars.length > 0) {
                              const merged = chars
                                .join('')
                                .replace(/,/g, '')
                                .trim();
                              const words = currentArray.filter(
                                (x: any) =>
                                  typeof x === 'string' && x.length > 1
                              );
                              if (merged) words.push(merged);
                              currentArray = words;
                            }

                            const newValue = currentArray.includes(s)
                              ? currentArray.filter((i: string) => i !== s)
                              : [...currentArray, s];
                            updateNestedField(
                              'specifications',
                              'shape',
                              newValue
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${isSelected ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  {isAddingCustom.field === 'shapes' ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={isAddingCustom.value}
                        onChange={(e) =>
                          setIsAddingCustom({
                            ...isAddingCustom,
                            value: e.target.value,
                          })
                        }
                        placeholder="Enter new shape"
                        className="flex-1 border border-gray-300 p-2 rounded text-sm"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomValue();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomValue}
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setIsAddingCustom({ field: null, value: '' })
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddingCustom({ field: 'shapes', value: '' })
                      }
                      className="px-3 py-1 rounded-full text-xs border border-dashed border-gray-400 text-gray-600 hover:border-terracotta hover:text-terracotta transition-colors mt-2"
                    >
                      + Add New Shape
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => updateField('isNew', e.target.checked)}
                    />{' '}
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) =>
                        updateField('isTrending', e.target.checked)
                      }
                    />{' '}
                    Trending
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.isSale}
                      onChange={(e) => updateField('isSale', e.target.checked)}
                    />{' '}
                    On Sale
                  </label>
                </div>
              </div>
            </section>

            {/* Sizes & Stock */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold mb-4 text-lg text-gray-800">
                Sizes & Stock
              </h3>
              <div className="mb-4">
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        const current = formData.sizes || [];
                        updateField(
                          'sizes',
                          current.includes(size)
                            ? current.filter((s) => s !== size)
                            : [...current, size]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${formData.sizes?.includes(size) ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formData.sizes && formData.sizes.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                      Size Pricing (Optional Override)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.sizes.map((size, index) => (
                        <div
                          key={size}
                          className="flex flex-col bg-gray-50 p-3 rounded border border-gray-200 gap-3"
                        >
                          {/* Row 1: Size Label & Default Badge */}
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-800">
                              {size}
                            </span>
                            {index === 0 && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold">
                                Default Base
                              </span>
                            )}
                          </div>

                          {/* Row 2: Selling Price */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold uppercase text-gray-500">
                              Selling Price
                            </label>
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-xs text-gray-400 font-medium">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="0"
                                className="flex-1 border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all w-full"
                                value={formData.sizePrices?.[size] || ''}
                                onChange={(e) => {
                                  const val = e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined;
                                  const newPrices = {
                                    ...(formData.sizePrices || {}),
                                  };
                                  if (val !== undefined) newPrices[size] = val;
                                  else delete newPrices[size];
                                  updateField('sizePrices', newPrices);

                                  // Auto-set base price if default (first index)
                                  if (index === 0 && val !== undefined) {
                                    updateField('price', val);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* Row 3: MRP (Original) */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold uppercase text-gray-500">
                              MRP (Original)
                            </label>
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-xs text-gray-400 font-medium">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="0"
                                className="flex-1 border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all w-full"
                                value={
                                  formData.sizeOriginalPrices?.[size] || ''
                                }
                                onChange={(e) => {
                                  const val = e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined;
                                  const newOriginalPrices = {
                                    ...(formData.sizeOriginalPrices || {}),
                                  };
                                  if (val !== undefined)
                                    newOriginalPrices[size] = val;
                                  else delete newOriginalPrices[size];
                                  updateField(
                                    'sizeOriginalPrices',
                                    newOriginalPrices
                                  );

                                  // Auto-set base MRP if default (first index)
                                  if (index === 0 && val !== undefined) {
                                    updateField('mrp', val);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Delivery Text
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={formData.deliveryText}
                    onChange={(e) =>
                      updateField('deliveryText', e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => updateField('inStock', e.target.checked)}
                    />{' '}
                    In Stock
                  </label>
                </div>
              </div>
            </section>

            {/* Reviews (Admin Controlled) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-lg text-gray-800">
                <Star size={18} /> Reviews (Admin)
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    className="w-full border p-2 rounded"
                    value={formData.rating}
                    onChange={(e) =>
                      updateField('rating', Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Count
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={formData.reviews}
                    onChange={(e) =>
                      updateField('reviews', Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-bold uppercase text-gray-500">
                  &quot;Customers Say&quot; Summary
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={formData.reviewSummary}
                  onChange={(e) => updateField('reviewSummary', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Review Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_TAGS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        const current = formData.reviewTags || [];
                        updateField(
                          'reviewTags',
                          current.includes(tag)
                            ? current.filter((t) => t !== tag)
                            : [...current, tag]
                        );
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
        <Button
          onClick={() => {
            setFormData(INITIAL_PRODUCT);
            setIsEditing(true);
          }}
        >
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
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={p.images[0]}
                    className="h-10 w-10 rounded object-cover"
                    alt={p.name}
                  />
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-left hover:opacity-70 transition-opacity"
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-text-muted">{p.category}</div>
                  </button>
                </td>
                <td className="p-4">
                  <div>₹{p.price.toLocaleString()}</div>
                  {p.mrp > p.price && (
                    <div className="text-xs text-gray-400 line-through">
                      ₹{p.mrp.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {p.inStock ? (
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="p-4 text-xs text-text-muted">
                  ★ {p.rating} ({p.reviews})
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 hover:bg-gray-200 rounded text-gray-600"
                    title="Edit Product"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/reviews/${p.id}`)}
                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                    title="Manage Reviews"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 hover:bg-error/10 rounded text-error"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Product"
        loading={loading}
      />
    </div>
  );
};

export default ProductManager;
