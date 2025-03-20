"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // Slider state and logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const sliderItems = [
    {
      id: 1,
      title: "Music Festival 2025",
      description: "Experience the best live performances from top artists",
      image: "/image/bali.jpeg",
    },
    {
      id: 2,
      title: "Food & Wine Expo",
      description:
        "Taste exquisite cuisine and premium wines from around the world",
      image: "/image/bali.jpeg",
    },
    {
      id: 3,
      title: "Tech Conference 2025",
      description: "Discover the latest innovations and trends in technology",
      image: "/image/bali.jpeg",
    },
    {
      id: 4,
      title: "Art Exhibition",
      description: "Explore creative masterpieces from renowned artists",
      image: "/image/bali.jpeg",
    },
  ];

  // Auto-sliding every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide =
        currentSlide === sliderItems.length - 1 ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlide);

      // Scroll the slider smoothly
      if (sliderRef.current) {
        const scrollAmount = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({
          left: scrollAmount * nextSlide,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSlide, sliderItems.length]);

  // Data untuk upcoming events, blogPosts, dan partners (tidak diubah)
  const upcomingEvents = [
    {
      id: 1,
      title: "Wonder Girls 2020 Wonder Girls World Tour San Francisco",
      date: "14",
      month: "JUL",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
    {
      id: 2,
      title: "JYJ 2021 JYJ Worldwide Concert Barcelona",
      date: "20",
      month: "AUG",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
    {
      id: 3,
      title: "2021 Super Junior SM Town Live 10 World Tour New York City",
      date: "13",
      month: "SEP",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
    {
      id: 4,
      title: "Wonder Girls 2020 Wonder Girls World Tour San Francisco",
      date: "14",
      month: "JUL",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
    {
      id: 5,
      title: "JYJ 2021 JYJ Worldwide Concert Barcelona",
      date: "20",
      month: "AUG",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
    {
      id: 6,
      title: "2021 Super Junior SM Town Live 10 World Tour New York City",
      date: "13",
      month: "SEP",
      location:
        "We'll get you directly seated and inside for you to enjoy the show.",
      image: "/image/bali.jpeg",
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "5 Strategies to Find Your Conference Keynote and Other Speakers",
      content:
        "Sekarang, kamu bisa produksi tiket fisik untuk eventmu, berjualan tiket offline, hilang perlu khawatir kehabisan stock atau salah input data",
      image: "/image/bali.jpeg",
      date: "7 Mar",
      readTime: "2 min read",
    },
    {
      id: 2,
      title:
        "How Successfully Used Paid Marketing to Drive Incremental Ticket Sales",
      content:
        "Sekarang, kamu bisa produksi tiket fisik untuk eventmu, berjualan tiket offline, hilang perlu khawatir kehabisan stock atau salah input data",
      image: "/api/placeholder/400/250",
      date: "7 Mar",
      readTime: "2 min read",
    },
    {
      id: 3,
      title:
        "Introducing Workspaces: Work smarter, not harder with new navigation",
      content:
        "Sekarang, kamu bisa produksi tiket fisik untuk eventmu, berjualan tiket offline, hilang perlu khawatir kehabisan stock atau salah input data",
      image: "/api/placeholder/400/250",
      date: "7 Mar",
      readTime: "2 min read",
    },
  ];

  const partners = [
    { name: "Spotify", logo: "/api/placeholder/120/40" },
    { name: "Google", logo: "/api/placeholder/120/40" },
    { name: "Stripe", logo: "/api/placeholder/120/40" },
    { name: "YouTube", logo: "/api/placeholder/120/40" },
    { name: "Microsoft", logo: "/api/placeholder/120/40" },
    { name: "Medium", logo: "/api/placeholder/120/40" },
    { name: "Zoom", logo: "/api/placeholder/120/40" },
    { name: "Uber", logo: "/api/placeholder/120/40" },
    { name: "Grab", logo: "/api/placeholder/120/40" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-600 to-purple-700 text-white">
        <header className="container mx-auto py-4 px-4 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V3z"></path>
            </svg>
            <span className="text-xl font-bold">Eventick</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-white hover:text-purple-200">
              Schedule
            </Link>
            <Link href="#" className="text-white hover:text-purple-200">
              Speakers
            </Link>
            <Link href="#" className="text-white hover:text-purple-200">
              Ticket
            </Link>
            <Link href="#" className="text-white hover:text-purple-200">
              Contact
            </Link>
            <button className="bg-transparent border border-white rounded-full px-5 py-1.5 text-sm hover:bg-white hover:text-purple-600 transition">
              Login
            </button>
          </nav>

          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </header>

        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              SBS MTV The Kpop Show Ticket Package
            </h1>
            <p className="mb-8 text-purple-100 text-sm md:text-base">
              Look no further for SBS The Show tickets! If you're a K-pop fan,
              this is the simplest way for you to experience a live K-pop
              recording.
            </p>
            <div className="flex space-x-4">
              <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-2.5 text-sm font-medium">
                Get Ticket
              </button>
              <button className="bg-purple-700 hover:bg-purple-800 border border-purple-400 text-white rounded-full px-6 py-2.5 text-sm font-medium">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mb-8 md:mb-0 order-1 md:order-2">
            <Image
              src="/image/bali.jpeg"
              alt="K-pop group"
              width={500}
              height={400}
              className="rounded-md"
              priority
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 lg:px-8 pb-0 md:pb-8 relative">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden relative -mb-16 z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-800">
                <label className="text-gray-400 text-xs block mb-1">
                  Search Event
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent text-white focus:outline-none text-lg"
                  placeholder="Konser Jazz"
                  defaultValue="Konser Jazz"
                />
              </div>
              <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-800">
                <label className="text-gray-400 text-xs block mb-1">
                  Place
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent text-white focus:outline-none text-lg"
                  placeholder="Location"
                  defaultValue="Indonesia"
                />
              </div>
              <div className="p-4 md:p-6 flex items-center">
                <div className="flex-grow">
                  <label className="text-gray-400 text-xs block mb-1">
                    Time
                  </label>
                  <select className="w-full bg-transparent text-white focus:outline-none text-lg appearance-none cursor-pointer">
                    <option>Any date</option>
                  </select>
                </div>
                <div className="ml-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-sliding carousel with background image */}
      <div className="mt-20 mb-12 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Featured Events
          </h2>
          <div ref={sliderRef} className="flex overflow-x-hidden scroll-smooth">
            {sliderItems.map((item, index) => (
              <div
                key={item.id}
                className="min-w-full md:min-w-[50%] lg:min-w-[100%] flex-shrink-0 px-2 relative h-64 rounded-xl overflow-hidden"
              >
                {/* Background image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay agar teks lebih terlihat */}
                <div className="absolute inset-0 bg-black opacity-40"></div>
                {/* Content slider */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {sliderItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  if (sliderRef.current) {
                    const scrollAmount = sliderRef.current.offsetWidth;
                    sliderRef.current.scrollTo({
                      left: scrollAmount * index,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`w-2 h-2 mx-1 rounded-full ${
                  currentSlide === index ? "bg-purple-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <div className="flex space-x-3">
            <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm flex items-center">
              Workshops
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm flex items-center">
              Event Type
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm flex items-center">
              Any Category
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {upcomingEvents.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-md group"
            >
              <div className="relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white rounded-lg py-2 px-3 flex flex-col items-center">
                  <span className="text-lg font-bold text-gray-800">
                    {event.date}
                  </span>
                  <span className="text-xs text-gray-600">{event.month}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{event.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-2.5 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 font-medium">
            Load More
          </button>
        </div>
      </div>

      {/* Create Your Own Event Section */}
      <div className="bg-purple-50 py-16">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/api/placeholder/500/400"
              alt="Create event illustration"
              width={500}
              height={400}
              className="max-w-md mx-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Make your own Event
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-3 font-medium">
              Create Events
            </button>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Join these brands
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          We've had the pleasure of working with industry-defining brands. These
          are just some of them.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 justify-items-center items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className="max-h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Blog
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold mb-3 text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-2.5 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 font-medium">
            Load More
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center mb-6">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V3z"></path>
                </svg>
                <span className="text-xl font-bold">Eventick</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                The perfect global and local event ticketing platform focused on
                securing tickets with ease. Find out about events that suit your
                preference, create your own events that will last forever.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-blue-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:ml-8">
              <h3 className="text-lg font-bold mb-6">Plan Events</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Create and Sell Tickets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sell Tickets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Online Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Collect Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Eventick</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Stay In The Loop</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Join our mailing list to stay in the loop with our newest events
              and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="py-3 px-4 bg-gray-800 rounded-l-lg focus:outline-none text-white flex-1"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-r-lg font-medium">
                Subscribe Now
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p>Copyright © 2023 All Rights</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
