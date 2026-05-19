"use client";

import { useSession } from "next-auth/react";

export default function TopAppBar() {
  const { data: session } = useSession();

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "AG";
  };

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
        
        <button className="flex items-center gap-sm p-1 sm:pr-3 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md">
            {getInitials(session?.user?.name, session?.user?.email)}
          </div>
          <span className="font-label-md text-label-md text-on-surface hidden sm:block">
            {session?.user?.name || "Agent Support"}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-sm hidden sm:block">expand_more</span>
        </button>
      </div>
    </header>
  );
}
