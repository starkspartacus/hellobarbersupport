import { customerProfile } from "@/lib/mocks/chat";

export default function CustomerDetails() {
  const { name, initials, memberSince, tags, email, phone, address, recentOrders } = customerProfile;

  return (
    <aside className="w-[300px] hidden xl:flex flex-col bg-surface border border-outline-variant rounded-lg shadow-soft overflow-y-auto shrink-0">
      {/* Header / Identity */}
      <div className="p-lg flex flex-col items-center text-center border-b border-outline-variant/50 relative">
        <button className="absolute top-md right-md text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-md transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <div className="relative mb-sm">
          <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline-lg border-4 border-surface shadow-sm">
            {initials}
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-tertiary-container border-2 border-surface rounded-full"></span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{name}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Premium Member Since {memberSince}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag, i) => (
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
            <span className="truncate flex-1">{email}</span>
            <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 text-[16px]">content_copy</span>
          </li>
          <li className="flex items-center gap-md font-body-sm text-body-sm text-on-surface group cursor-pointer hover:bg-surface-container-low p-1 -mx-1 rounded-sm transition-colors">
            <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">phone</span>
            <span>{phone}</span>
          </li>
          <li className="flex items-start gap-md font-body-sm text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">location_on</span>
            <span className="whitespace-pre-line">{address}</span>
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
          {recentOrders.map((order) => (
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
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{order.desc}</p>
              <p className="font-label-sm text-label-sm text-outline mt-1">{order.date} • {order.price}</p>
            </div>
          ))}
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
