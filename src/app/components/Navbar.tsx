"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for navbar scrolling
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth context
  const { user, logout } = useAuth();
  const router = useRouter();

  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);

  // Handle scroll event to make navbar sticky
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

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <div
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-gray-800 shadow-lg"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-2xl flex items-center">
              <svg
                className={`w-8 h-8 mr-2 ${
                  isScrolled ? "text-indigo-600" : "text-white"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 13L12 16L15 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={
                  isScrolled ? "text-indigo-600" : "text-white tracking-wider"
                }
              >
                BookIt
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/ticket"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Cari Event
              </Link>
              
              {user?.type === 'creator' && (
                <Link
                  href="/organizer"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Kelola Event
                </Link>
              )}
              
              {user && (
                <Link
                  href="/customer/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Tiket Saya
                </Link>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center">
                <div className="relative group">
                  <button
                    className={`flex items-center text-sm py-2 px-4 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? "hover:bg-gray-100"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-1">{user.name}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                        Profil Saya
                      </Link>
                      <Link href="/customer/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                        Tiket Saya
                      </Link>
                      {user.type === 'creator' && (
                        <Link href="/organizer" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                          Kelola Event
                        </Link>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button
                    className={`text-sm py-2 px-5 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        : "text-white border border-white/60 hover:bg-white hover:text-indigo-600"
                    }`}
                  >
                    Masuk
                  </button>
                </Link>

                <Link href="/register">
                  <button
                    className={`text-sm py-2 px-5 rounded-full transition-all duration-200 shadow-lg ${
                      isScrolled
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    Daftar
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "currentColor" : "white"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "currentColor" : "white"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-16 z-40 bg-gradient-to-b from-indigo-600 to-purple-700 pt-4 pb-6 px-4 shadow-xl rounded-b-2xl">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/ticket"
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cari Event
              </Link>
              
              {user?.type === 'creator' && (
                <Link
                  href="/organizer"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kelola Event
                </Link>
              )}
              
              {user && (
                <Link
                  href="/customer/dashboard"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tiket Saya
                </Link>
              )}
              
              {user ? (
                <>
                  <div className="pt-3 pb-1 px-4 border-t border-white/20">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col space-y-3">
                  <Link href="/login">
                    <button 
                      className="w-full text-sm py-2 px-4 text-white border border-white/60 rounded-full hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Masuk
                    </button>
                  </Link>
                  <Link href="/register">
                    <button 
                      className="w-full text-sm py-2 px-4 bg-white text-indigo-600 rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Daftar
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}