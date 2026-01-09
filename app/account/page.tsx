'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  LogOut,
  Loader,
  ShoppingBag,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import Button from '@/components/Button';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { UserProfile } from '@/types';

const AccountPage = () => {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [user, userProfile, loading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;
    setSaving(true);
    try {
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, formData);

      // Update Auth Profile if name changed
      if (
        formData.firstName !== userProfile.firstName ||
        formData.lastName !== userProfile.lastName
      ) {
        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
        });
      }

      // In a real app, you might want to refresh the userProfile context here or rely on the listener
      setIsEditing(false);
    } catch (error) {
      // console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="animate-spin text-terracotta" size={32} />
      </div>
    );
  }

  if (!user || !userProfile) return null;

  const memberSince = userProfile.createdAt?.seconds
    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString(
        'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : 'Recently';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header / Banner */}
      <div className="bg-gray-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl mb-2">My Account</h1>
          <p className="text-gray-400 font-light">
            Manage your profile and view your orders
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-8 text-center border-b border-gray-100">
                <div className="w-24 h-24 bg-terracotta/10 rounded-full mx-auto flex items-center justify-center text-terracotta text-3xl font-serif font-bold mb-4 shadow-inner">
                  {userProfile.firstName?.[0]}
                  {userProfile.lastName?.[0]}
                </div>
                <h2 className="text-xl font-bold font-serif text-gray-900">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {userProfile.email}
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest">
                  {userProfile.role}
                </div>
              </div>
              <div className="p-4">
                <button
                  onClick={() => logout().then(() => router.push('/'))}
                  className="w-full flex items-center justify-center gap-2 text-error hover:bg-error/5 py-3 rounded-lg transition-colors font-medium text-sm group"
                >
                  <LogOut
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />{' '}
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <h3 className="text-lg font-bold font-serif flex items-center gap-2 text-gray-800">
                  <User size={20} className="text-terracotta" /> Profile
                  Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-medium text-terracotta hover:underline"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(userProfile);
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-terracotta text-white rounded text-sm hover:bg-black transition-colors"
                    >
                      {saving ? (
                        <Loader size={12} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}{' '}
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {/* First Name */}
                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={User}
                    label="First Name"
                    value={userProfile.firstName}
                  />
                )}

                {/* Last Name */}
                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={User}
                    label="Last Name"
                    value={userProfile.lastName}
                  />
                )}

                <DetailItem
                  icon={Mail}
                  label="Email Address"
                  value={userProfile.email}
                />

                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={Phone}
                    label="Phone Number"
                    value={userProfile.phone || 'Not Provided'}
                  />
                )}

                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      Profession
                    </label>
                    <input
                      name="profession"
                      value={formData.profession || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={Briefcase}
                    label="Profession"
                    value={userProfile.profession || 'Not Specified'}
                  />
                )}

                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      Company
                    </label>
                    <input
                      name="companyName"
                      value={formData.companyName || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={Building}
                    label="Company"
                    value={userProfile.companyName || '-'}
                  />
                )}

                {isEditing ? (
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">
                      City
                    </label>
                    <input
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none"
                    />
                  </div>
                ) : (
                  <DetailItem
                    icon={MapPin}
                    label="City"
                    value={userProfile.city || '-'}
                  />
                )}

                <DetailItem
                  icon={Calendar}
                  label="Member Since"
                  value={memberSince}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                  <MapPin size={16} /> Address
                </h4>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded p-3 text-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none resize-none"
                  />
                ) : (
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    {userProfile.address || 'No address provided.'}
                  </div>
                )}
              </div>
            </section>

            {/* Order History Placeholder */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in animation-delay-100">
              <h3 className="text-lg font-bold font-serif mb-6 flex items-center gap-2 text-gray-800">
                <ShoppingBag size={20} className="text-terracotta" /> Recent
                Orders
              </h3>

              {/* Empty State */}
              <div className="text-center py-12 px-4 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-white p-3 rounded-full inline-flex mb-4 shadow-sm">
                  <ShoppingBag size={24} className="text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">
                  No orders yet
                </h4>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  Looks like you haven&apos;t placed an order for our exquisite
                  rugs yet.
                </p>
                <Button size="sm" onClick={() => router.push('/shop')}>
                  Explore Collection
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 text-gray-300 group-hover:text-terracotta transition-colors p-1.5 bg-gray-50 rounded-md">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">
        {label}
      </p>
      <p className="text-gray-800 font-medium text-sm text-balance">{value}</p>
    </div>
  </div>
);

export default AccountPage;
