"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext

export default function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("organizer/event-saya");
  const { user } = useAuth(); // Get the user from AuthContext

  // Effect untuk sinkronisasi active tab dengan route yang aktif
  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/organizer/event-saya")) {
      setActiveTab("event-saya");
    } else if (pathname.startsWith("/organizer/informasi-dasar")) {
      setActiveTab("informasi-dasar");
    } else if (pathname.startsWith("/organizer/rekening")) {
      setActiveTab("rekening");
    } else if (pathname.startsWith("/organizer/pengaturan")) {
      setActiveTab("pengaturan");
    } else if (pathname.startsWith("/organizer/reports")) {
      setActiveTab("reports");
    } else if (pathname.startsWith("/organizer")) {
      setActiveTab("organizer");
    } else if (pathname.startsWith("/customer/dashboard")) {
      setActiveTab("switch");
    }
  }, [pathname]);

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user || !user.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  const sidebarMenus = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Event Saya",
          icon: "M15 5a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h10zm-4 6a2 2 0 100-4 2 2 0 000 4z",
          id: "event-saya",
          path: "/organizer/event-saya",
        },
        {
          name: "Laporan",
          icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          id: "reports",
          path: "/organizer/reports",
        },
      ],
    },
    {
      section: "Mode User",
      items: [
        {
          name: "Beralih ke Akun Pembeli",
          icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
          id: "switch",
          path: "/customer/dashboard",
        },
      ],
    },
  ];

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-20" : "w-64"
      } bg-gray-900 text-white transition-all duration-300 ease-in-out h-full flex flex-col fixed lg:relative z-50`}
    >
      {/* Sidebar header */}
      <div className="p-4 flex items-center justify-between">
        <Link
          href="/"
          className={`flex items-center ${
            sidebarCollapsed ? "justify-center w-full" : ""
          }`}
        >
              <img
                src={"/image/putih.svg"}
                alt="BookIt Logo"
                className="w-6 h-6 mr-1"
              />
          {!sidebarCollapsed && (
            <span className="ml-2 text-xl font-bold">BookIt</span>
          )}
        </Link>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-white hidden lg:block"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar menu with sections */}
      <div className="overflow-y-auto flex-grow">
        {sidebarMenus.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {!sidebarCollapsed && (
              <div className="px-4 text-xs text-gray-400 uppercase font-medium mt-4 mb-2">
                {section.section}
              </div>
            )}
            <nav>
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`
                    block w-full ${
                      sidebarCollapsed ? "px-2" : "px-4"
                    } py-2 text-sm font-medium rounded-md mx-2 mb-1
                    ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }
                    transition-all duration-200
                  `}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="flex items-center">
                    <svg
                      className={`${
                        sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-gray-800">
        <div
          className={`flex ${
            sidebarCollapsed ? "justify-center" : "items-center"
          }`}
        >
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {getUserInitial()}
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {getUserInitial()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-gray-400">{user?.email || "No email"}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}