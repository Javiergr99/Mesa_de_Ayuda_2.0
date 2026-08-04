import { NavLink } from "react-router";

import { sidebarNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

export function AppSidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[var(--header-height)] z-30 w-[var(--sidebar-width)] bg-sidebar px-4 py-5">
      <nav className="space-y-1.5" aria-label="Módulos principales">
        {sidebarNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200",
                  isActive && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.9} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
