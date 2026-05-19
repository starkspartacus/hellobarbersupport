"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSupportStore } from "@/store/useSupportStore";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const initSocket = useSupportStore((state) => state.initSocket);
  const disconnectSocket = useSupportStore((state) => state.disconnectSocket);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      initSocket(session.accessToken as string);
    }
    return () => {
      disconnectSocket();
    };
  }, [status, session, initSocket, disconnectSocket]);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
