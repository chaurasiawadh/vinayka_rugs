import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  ShoppingBag, Calendar, Image as ImageIcon, 
  LogOut, Plus, Trash2, Edit2, Loader, AlertTriangle
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useProducts } from '../hooks/useFirestore';
import Button from '../components/Button';
import ImageInput from '../components/ImageInput';
import { CATEGORIES, MATERIALS } from '../constants';

// --- SUB-COMPONENT: Product Manager ---
const ProductManager: React.FC = () => {
  const { products } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProd, setCurrentProd] = useState<any>({});
  const [imageInput, setImageInput] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);

    try {
        let imageUrl = currentProd.images?.[0] || '';

        // Handle Image Input (File Upload or URL)
        if (imageInput) {
            if (typeof imageInput === 'string') {
                // User provided a URL directly
                imageUrl = imageInput;
            } else if (imageInput instanceof File) {
                // User provided a file, upload to Firebase
                try {
                    const storageRef = ref(storage, `products/${Date.now()}_${imageInput.name}`);
                    await uploadBytes(storageRef, imageInput);
                    imageUrl = await getDownloadURL(storageRef);
                } catch (uploadErr: any) {
                    console.error("Upload Error:", uploadErr);
                    // Check for common CORS or permissions issues
                    let errorMsg = "Upload failed.";
                    if (uploadErr.message?.includes('CORS') || uploadErr.code === 'storage/unauthorized' || uploadErr.code === 'storage/unknown') {
                        errorMsg = "CORS Policy Error: Cannot upload from localhost. Please switch to 'Paste URL' tab and use a direct image link.";
                    } else {
                        errorMsg = `Upload failed: ${uploadErr.message}`;
                    }
                    setUploadError(errorMsg);
                    setLoading(false);
                    return; // Stop saving if image upload fails
                }
            }
        }

        const productData = {
            ...currentProd,
            price: Number(currentProd.price),
            images: [imageUrl],
            sizes: currentProd.sizes ? (typeof currentProd.sizes === 'string' ? currentProd.sizes.split(',') : currentProd.sizes) : [],
            colors: currentProd.colors ? (typeof currentProd.colors === 'string' ? currentProd.colors.split(',') : currentProd.colors) : [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        if (currentProd.id) {
            await updateDoc(doc(db, 'products', currentProd.id), productData);
        } else {
            await addDoc(collection(db, 'products'), productData);
        }
        setIsEditing(false);
        setCurrentProd({});
        setImageInput(null);
    } catch (error) {
        console.error("Error saving product", error);
        alert("Error saving product. Check console for details.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this product?')) {
        await deleteDoc(doc(db, 'products', id));
    }
  };

  const handleEditClick = (product: any) => {
      setCurrentProd(product);
      // Reset image input logic
      setImageInput(null);
      setUploadError(null);
      setIsEditing(true);
  };

  const handleCancel = () => {
      setIsEditing(false);
      setUploadError(null);
  }

  if (isEditing) {
      return (
          <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
              <div className="flex justify-between items-start mb-6">
                  <h3 className="font-serif text-xl">{currentProd.id ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><Trash2 size={18} className="opacity-0" /></button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Name" className="border p-2 rounded" value={currentProd.name || ''} onChange={e => setCurrentProd({...currentProd, name: e.target.value})} required />
                      <input placeholder="Price" type="number" className="border p-2 rounded" value={currentProd.price || ''} onChange={e => setCurrentProd({...currentProd, price: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <select className="border p-2 rounded" value={currentProd.category || ''} onChange={e => setCurrentProd({...currentProd, category: e.target.value})} required>
                          <option value="">Select Category</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select className="border p-2 rounded" value={currentProd.material || ''} onChange={e => setCurrentProd({...currentProd, material: e.target.value})} required>
                          <option value="">Select Material</option>
                          {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                  </div>
                  <textarea placeholder="Description" className="border p-2 rounded w-full" rows={3} value={currentProd.description || ''} onChange={e => setCurrentProd({...currentProd, description: e.target.value})} />
                  
                  <ImageInput 
                    label="Product Image"
                    initialValue={currentProd.images?.[0]}
                    onChange={(val) => {
                        setImageInput(val);
                        if(uploadError) setUploadError(null); // Clear error on new selection
                    }}
                    error={uploadError}
                  />

                  <div className="flex items-center gap-2">
                      <input type="checkbox" id="isTrending" checked={currentProd.isTrending || false} onChange={e => setCurrentProd({...currentProd, isTrending: e.target.checked})} />
                      <label htmlFor="isTrending">Mark as Trending / Best Seller</label>
                  </div>

                  <div className="flex gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
                  </div>
              </form>
          </div>
      );
  }

  return (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif">Product Inventory</h2>
              <Button onClick={() => { setCurrentProd({}); setImageInput(null); setUploadError(null); setIsEditing(true); }}>
                  <Plus size={18} className="mr-2" /> Add Product
              </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 text-text-muted text-sm uppercase">
                      <tr>
                          <th className="p-4">Image</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Trending</th>
                          <th className="p-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                  <img src={p.images[0]} className="h-12 w-12 rounded object-cover" alt="" />
                              </td>
                              <td className="p-4 font-medium">{p.name}</td>
                              <td className="p-4 text-sm text-text-muted">{p.category}</td>
                              <td className="p-4">₹{p.price.toLocaleString()}</td>
                              <td className="p-4">
                                  {p.isTrending ? <span className="bg-amber/10 text-amber text-xs px-2 py-1 rounded-full">Trending</span> : '-'}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                  <button onClick={() => handleEditClick(p)} className="p-2 hover:bg-gray-200 rounded text-gray-600"><Edit2 size={16} /></button>
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

// --- MAIN ADMIN LAYOUT ---

const Admin: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'gallery'>('products');

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin text-terracotta" /></div>;
  
  if (!user) return <Navigate to="/login" replace />;

  const menuItems = [
    { id: 'products', label: 'All Rugs & Collections', icon: <ShoppingBag size={20} /> },
    { id: 'events', label: 'Exhibitions', icon: <Calendar size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif text-2xl font-bold">Admin<span className="text-terracotta">Panel</span></h1>
          <p className="text-xs text-text-muted mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-terracotta text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 w-full rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'events' && (
            <div className="text-center py-20 bg-white rounded-xl">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-serif">Exhibitions Manager</h2>
                <p className="text-text-muted">Module under construction. Will manage upcoming events here.</p>
            </div>
        )}
        {activeTab === 'gallery' && (
            <div className="text-center py-20 bg-white rounded-xl">
                <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-serif">Gallery Manager</h2>
                <p className="text-text-muted">Module under construction. Will manage photo uploads here.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default Admin;