"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function TopAppBar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // @ts-ignore - session.user.role is injected in auth.ts
  const userRole = session?.user?.role || "support";
  const isSuperAdmin = userRole === "super_admin" || userRole === "admin";

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "AG";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center h-16 px-lg bg-surface text-primary font-label-md text-label-md sticky top-0 w-full z-40 border-b border-outline-variant">
      <div className="flex items-center gap-lg w-full max-w-2xl">
        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface" 
            placeholder="Search..." 
            type="text" 
          />
        </div>
        {/* Mobile Title */}
        <h1 className="md:hidden font-headline-md text-headline-md font-bold text-primary">SupportFlow</h1>
      </div>
      
      <div className="flex items-center gap-sm">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-sm hidden sm:block"></div>
        
        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-sm p-1 sm:pr-3 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer select-none active:scale-95 duration-150"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md font-bold shadow-sm">
              {getInitials(session?.user?.name, session?.user?.email)}
            </div>
            <span className="font-label-md text-label-md text-on-surface hidden sm:block">
              {session?.user?.name || "Agent Support"}
            </span>
            <span className={`material-symbols-outlined text-on-surface-variant text-sm hidden sm:block transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-sm w-64 bg-surface rounded-xl border border-outline-variant shadow-soft py-md z-50 animate-fade-in origin-top-right">
              {/* Profile Header */}
              <div className="px-md pb-sm border-b border-outline-variant flex items-center gap-sm mb-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md font-bold shadow-sm">
                  {getInitials(session?.user?.name, session?.user?.email)}
                </div>
                <div className="truncate">
                  <p className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    {session?.user?.name || "Agent Support"}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {session?.user?.email || "support@hellobarber.com"}
                  </p>
                  <span className={`inline-block mt-xs px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    isSuperAdmin 
                      ? "bg-error-container text-on-error-container" 
                      : "bg-secondary-container text-on-secondary-container"
                  }`}>
                    {userRole.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <ul className="space-y-xs px-sm">
                <li>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">pending_actions</span>
                    Queue des tickets
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/chats"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chat</span>
                    Chats actifs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/history"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
                    Historique
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/identity"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">badge</span>
                    Identités à valider
                  </Link>
                </li>
                {isSuperAdmin && (
                  <li>
                    <Link 
                      href="/dashboard/team"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">manage_accounts</span>
                      Gestion d'équipe
                    </Link>
                  </li>
                )}
                <li>
                  <Link 
                    href="/dashboard/videos"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-sm px-sm py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">video_library</span>
                    Vidéos signalées
                  </Link>
                </li>
              </ul>

              {/* Logout Section */}
              <div className="mt-sm pt-sm border-t border-outline-variant px-sm">
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-sm px-sm py-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors cursor-pointer text-body-sm font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
