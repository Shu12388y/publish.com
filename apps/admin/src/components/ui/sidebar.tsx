import { useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/auth-slice";

type SidebarProps = {
  activeItem?: string;
};

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/analysis" },
  { label: "Analytics", icon: BarChart3, href: "/analysis" },
  { label: "Content", icon: FileText, href: "/content" },
  { label: "Audience", icon: Users, href: "/audience" },
  { label: "Topics", icon: Tags, href: "/topics" },
  { label: "Campaigns", icon: Megaphone, href: "/campaigns" },
];

function Sidebar({ activeItem = "Analytics" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isSigningOut = useAppSelector(
    (state) => state.auth.status === "loading",
  );
  const initials = user?.fullname
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    try {
      await dispatch(signOut()).unwrap();
      navigate("/sign-in");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }

  return (
    <>
      {!isMobileOpen && (
        <Button
          className="fixed left-4 top-4 z-40 md:hidden"
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="size-4" />
        </Button>
      )}
      {isMobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "group fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-y-auto border-r border-[#29445b] bg-[#102a43] p-5 text-[#edf3f1] transition-transform duration-200 md:sticky md:top-0 md:h-svh md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <div className="mb-8 flex items-center">
          <Link
            className={cn(
              "flex items-center gap-2 text-lg font-semibold tracking-tight text-white",
              isCollapsed && "justify-center",
            )}
            to="/analysis"
            title={isCollapsed ? "Publish.com" : undefined}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d7e5ea] text-sm font-bold text-[#102a43]">
              P
            </span>
            {!isCollapsed && <span>Publish.com</span>}
          </Link>
          <Button
            className="ml-auto md:hidden"
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="grid grid-cols-1 gap-1 md:block md:space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <Link
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isCollapsed && "md:justify-center md:px-0",
                  isActive
                    ? "bg-[#d7e5ea] text-[#102a43]"
                    : "text-[#a9bdc9] hover:bg-[#193b57] hover:text-white",
                )}
                to={item.href}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t pt-4 md:mt-auto">
          <Link
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#a9bdc9] transition-colors hover:bg-[#193b57] hover:text-white",
              isCollapsed && "md:justify-center md:px-0",
            )}
            to="/settings"
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="size-4 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#a9bdc9] transition-colors hover:bg-[#193b57] hover:text-white",
              isCollapsed && "md:justify-center md:px-0",
            )}
            type="button"
            title={isCollapsed ? "Sign out" : undefined}
            disabled={isSigningOut}
            onClick={handleSignOut}
          >
            <LogOut className="size-4 shrink-0" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
          <div
            className={cn(
              "mt-4 flex items-center gap-3 border-t border-[#29445b] px-2 pt-4",
              isCollapsed && "md:justify-center md:px-0",
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dce8e7] text-xs font-semibold text-[#102a43]">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user?.fullname}</p>
                <p className="truncate text-xs text-[#8fa8b7]">
                  {user?.organization}
                </p>
              </div>
            )}
          </div>
          <Button
            className={cn(
              "mt-4 hidden border-[#35546a] text-[#a9bdc9] hover:bg-[#193b57] hover:text-white md:inline-flex",
              isCollapsed ? "size-8 w-8" : "w-full justify-start",
            )}
            type="button"
            variant="outline"
            size={isCollapsed ? "icon" : "sm"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
            {!isCollapsed && <span>Collapse sidebar</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}

type SidebarLayoutProps = {
  children: ReactNode;
};

function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-muted/30 md:h-svh md:flex-row md:overflow-hidden">
      {children}
    </div>
  );
}

export { Sidebar, SidebarLayout };
