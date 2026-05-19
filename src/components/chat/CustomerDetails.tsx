import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSupportStore } from "@/store/useSupportStore";
import { useSession } from "next-auth/react";

export default function CustomerDetails() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const selectedChat = useSupportStore((state) => state.selectedChat);
  
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedChat && token) {
      const chatId = (selectedChat as any).id || (selectedChat as any)._id;
      fetchCustomerDetails(chatId);
    } else {
      setCustomer(null);
    }
  }, [selectedChat, token]);

  const fetchCustomerDetails = async (chatId: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/chat/admin/${chatId}/customer-details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomer(res.data);
    } catch (error) {
      console.error("Failed to fetch customer details", error);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <aside className="w-[300px] hidden xl:flex flex-col bg-surface border border-outline-variant rounded-lg shadow-soft shrink-0 items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </aside>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <aside className="w-[300px] hidden xl:flex flex-col bg-surface border border-outline-variant rounded-lg shadow-soft overflow-y-auto shrink-0">
      {/* Header / Identity */}
      <div className="p-lg flex flex-col items-center text-center border-b border-outline-variant/50 relative">
        <button className="absolute top-md right-md text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-md transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <div className="relative mb-sm">
          <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline-lg border-4 border-surface shadow-sm">
            {customer.initials}
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-tertiary-container border-2 border-surface rounded-full"></span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{customer.name}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Premium Member Since {customer.memberSince}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {customer.tags?.map((tag: string, i: number) => (
            <span key={i} className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 ${
              tag === "VIP" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"
            }`}>
              {tag === "VIP" && <span className="material-symbols-outlined text-[14px]">star</span>}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-md border-b border-outline-variant/50">
        <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Contact Info</h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-md font-body-sm text-body-sm text-on-surface group cursor-pointer hover:bg-surface-container-low p-1 -mx-1 rounded-sm transition-colors">
            <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">mail</span>
            <span className="truncate flex-1" title={customer.email}>{customer.email}</span>
            <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 text-[16px]">content_copy</span>
          </li>
          <li className="flex items-center gap-md font-body-sm text-body-sm text-on-surface group cursor-pointer hover:bg-surface-container-low p-1 -mx-1 rounded-sm transition-colors">
            <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">phone</span>
            <span>{customer.phone}</span>
          </li>
          <li className="flex items-start gap-md font-body-sm text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">location_on</span>
            <span className="whitespace-pre-line">{customer.address}</span>
          </li>
        </ul>
      </div>

      {/* Recent Activity / Orders */}
      <div className="p-md flex-1">
        <div className="flex justify-between items-center mb-sm">
          <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recent Orders</h4>
          <a className="font-label-sm text-label-sm text-primary hover:underline" href="#">View All</a>
        </div>
        <div className="space-y-sm">
          {customer.recentOrders?.length > 0 ? customer.recentOrders.map((order: any) => (
            <div key={order.id} className="p-sm bg-surface-container-lowest border border-outline-variant rounded-md cursor-pointer hover:border-primary transition-colors group">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{order.id}</span>
                <span className={`font-label-sm text-label-sm px-1.5 rounded ${
                  order.status === "Delivered" 
                    ? "text-tertiary-container bg-tertiary-fixed-dim/20" 
                    : "text-on-surface-variant bg-surface-container-high"
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate" title={order.desc}>{order.desc}</p>
              <p className="font-label-sm text-label-sm text-outline mt-1">{order.date} • {order.price}</p>
            </div>
          )) : (
            <p className="text-sm text-on-surface-variant italic">Aucune commande récente</p>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="p-md border-t border-outline-variant bg-surface-container-lowest grid grid-cols-2 gap-sm">
        <button className="px-md py-2 border border-outline-variant rounded-md font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex justify-center items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]">receipt_long</span> Invoice
        </button>
        <button className="px-md py-2 border border-outline-variant rounded-md font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex justify-center items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]">assignment_return</span> Return
        </button>
      </div>
    </aside>
  );
}
