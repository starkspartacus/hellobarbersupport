"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // @ts-ignore - session.user.role is injected in auth.ts
  const userRole = session?.user?.role || "support";
  const isSuperAdmin = userRole === "super_admin" || userRole === "admin";

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="hidden md:flex flex-col h-screen p-md space-y-sm bg-on-secondary-fixed text-primary-fixed font-body-md text-body-md fixed left-0 top-0 w-[240px] z-50">
      <div className="mb-lg px-sm">
        <div className="flex items-center gap-sm mb-sm">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center font-bold text-primary text-xl">
            S
          </div>
          <h1 className="font-headline-sm text-headline-sm text-on-secondary">SupportFlow</h1>
        </div>
        <p className="font-label-sm text-label-sm text-outline-variant">Agent Dashboard</p>
      </div>

      <ul className="flex-1 space-y-xs">
        <li>
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard") && pathname === "/dashboard"
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined">pending_actions</span>
            Queue
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/chats" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard/chats")
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined">chat</span>
            Active Chats
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/history" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard/history")
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            History
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/identity" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard/identity")
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined">badge</span>
            Identités
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/images" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard/images")
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined">photo_library</span>
            Photos Catalogue
          </Link>
        </li>
        {isSuperAdmin && (
          <li>
            <Link 
              href="/dashboard/team" 
              className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
                isActive("/dashboard/team")
                  ? "bg-on-secondary-fixed-variant text-on-secondary"
                  : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
              }`}
            >
              <span className="material-symbols-outlined">manage_accounts</span>
              Équipe
            </Link>
          </li>
        )}
        <li>
          <Link 
            href="/dashboard/videos" 
            className={`flex items-center gap-md p-sm rounded-lg transition-colors duration-200 cursor-pointer active:scale-95 ${
              isActive("/dashboard/videos")
                ? "bg-on-secondary-fixed-variant text-on-secondary"
                : "text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant"
            }`}
          >
            <span className="material-symbols-outlined">video_library</span>
            Vidéos Signalées
          </Link>
        </li>
      </ul>

      <ul className="mt-auto space-y-xs pt-md border-t border-on-secondary-fixed-variant">
        <li>
          <a href="#" className="flex items-center gap-md p-sm text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant transition-colors duration-200 cursor-pointer active:scale-95 rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </li>
        <li>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-md p-sm text-outline-variant hover:text-on-secondary hover:bg-on-secondary-fixed-variant transition-colors duration-200 cursor-pointer active:scale-95 rounded-lg"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
