"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface User {
  user_id: string;
  email: string;
  jenis_kelamin: 'MALE' | 'FEMALE';
  tanggal_lahir: string;
  kontak: string | null;
  foto_profil: string | null;
  pembeli?: {
    nama_pembeli: string;
  };
  event_creator?: {
    nama_brand: string;
    deskripsi_creator: string | null;
    no_rekening: string | null;
  };
}

// Define the auth user type to match what comes from useAuth()
interface AuthUser {
  user_id?: string;
  id?: string; // Common alternative property name
  email?: string;
  // Add other properties that might exist in your auth context
}

export default function ProfilePage() {
  const { user }: { user: AuthUser | null } = useAuth(); // Type the user from auth context

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // User profile data from database
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Form data for editing
  const [editFormData, setEditFormData] = useState({
    nama: "",
    email: "",
    kontak: "",
    jenis_kelamin: "MALE" as 'MALE' | 'FEMALE',
    tanggal_lahir: "",
  });

  // Password change form data
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Helper function to get user ID from auth context
  const getUserId = () => {
    return user?.user_id || user?.id; // Try both common property names
  };

  // Fetch user profile data from database
  const fetchUserProfile = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/user/profile/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData: User = await response.json();
      setUserProfile(userData);

      // Set form data for editing
      setEditFormData({
        nama: userData.pembeli?.nama_pembeli || userData.event_creator?.nama_brand || "",
        email: userData.email,
        kontak: userData.kontak || "",
        jenis_kelamin: userData.jenis_kelamin,
        tanggal_lahir: userData.tanggal_lahir ? userData.tanggal_lahir.split('T')[0] : "",
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData: typeof editFormData) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`/api/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUserProfile(updatedUser);
      setIsEditing(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  // Change password
  const changePassword = async (passwordData: typeof passwordFormData) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setPasswordChangeLoading(true);
      setPasswordChangeError(null);
      setPasswordChangeSuccess(false);

      const response = await fetch(`/api/user/profile/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      setPasswordChangeSuccess(true);
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      setPasswordChangeError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Fetch user data when component mounts or user changes
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle saving profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(editFormData);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordChangeError("New passwords don't match");
      return;
    }

    // Validate password length
    if (passwordFormData.newPassword.length < 8) {
      setPasswordChangeError("New password must be at least 8 characters long");
      return;
    }

    changePassword(passwordFormData);
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof editFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password input changes
  const handlePasswordInputChange = (field: keyof typeof passwordFormData, value: string) => {
    setPasswordFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (passwordChangeError) {
      setPasswordChangeError(null);
    }
    if (passwordChangeSuccess) {
      setPasswordChangeSuccess(false);
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (!userProfile) return "";
    return userProfile.pembeli?.nama_pembeli || 
           userProfile.event_creator?.nama_brand || 
           "User";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format gender for display
  const formatGender = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Laki-laki' : 'Perempuan';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={fetchUserProfile}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-600">No profile data found</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Profile Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-6 md:p-8 mb-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-4xl font-medium text-white mr-6">
                  {userProfile.foto_profil ? (
                    <img 
                      src={userProfile.foto_profil} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getDisplayName().charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    {getDisplayName()}
                  </h1>
                  <p className="text-white/80">{userProfile.email}</p>
                  <p className="text-white/80">{userProfile.kontak || "-"}</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-bold text-gray-800">Profile Settings</h2>
                </div>
                <div className="p-2">
                  <nav>
                    {[
                      {
                        id: "profile",
                        name: "Personal Information",
                        icon: "user",
                      },
                      { id: "security", name: "Security", icon: "lock" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors mb-1 ${
                          activeSection === item.id
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.icon === "user" && (
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                        {item.icon === "lock" && (
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Personal Information */}
                {activeSection === "profile" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">
                        Personal Information
                      </h2>
                    </div>
                    <div className="p-6">
                      {isEditing ? (
                        <form onSubmit={handleSaveProfile}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap
                              </label>
                              <input
                                type="text"
                                value={editFormData.nama}
                                onChange={(e) => handleInputChange('nama', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Kontak
                              </label>
                              <input
                                type="tel"
                                value={editFormData.kontak}
                                onChange={(e) => handleInputChange('kontak', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis Kelamin
                              </label>
                              <select
                                value={editFormData.jenis_kelamin}
                                onChange={(e) => handleInputChange('jenis_kelamin', e.target.value as 'MALE' | 'FEMALE')}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="MALE">Laki-laki</option>
                                <option value="FEMALE">Perempuan</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Lahir
                              </label>
                              <input
                                type="date"
                                value={editFormData.tanggal_lahir}
                                onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">
                                Nama Lengkap
                              </h3>
                              <p className="font-medium">{getDisplayName()}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">
                                Email
                              </h3>
                              <p className="font-medium">{userProfile.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">
                                Nomor Kontak
                              </h3>
                              <p className="font-medium">{userProfile.kontak || "-"}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">
                                Jenis Kelamin
                              </h3>
                              <p className="font-medium">
                                {formatGender(userProfile.jenis_kelamin)}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">
                                Tanggal Lahir
                              </h3>
                              <p className="font-medium">
                                {formatDate(userProfile.tanggal_lahir)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeSection === "security" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">
                        Security Settings
                      </h2>
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium text-gray-800 mb-6">
                        Change Password
                      </h3>

                      {/* Success Message */}
                      {passwordChangeSuccess && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">Password changed successfully!</p>
                        </div>
                      )}

                      {/* Error Message */}
                      {passwordChangeError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">{passwordChangeError}</p>
                        </div>
                      )}

                      <form className="space-y-4 mb-8" onSubmit={handlePasswordChange}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordFormData.currentPassword}
                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordFormData.newPassword}
                            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            minLength={8}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 8 characters long
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordFormData.confirmPassword}
                            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            minLength={8}
                            required
                          />
                        </div>
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={passwordChangeLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {passwordChangeLoading ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}