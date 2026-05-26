import {
  LayoutDashboard, Newspaper, FolderTree, Users, Video,
  Tv, Mail, Bell, Settings, FileText, LogOut, Newspaper as Logo
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const main = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true, roles: ["admin", "editor"] },
  { title: "Articles", url: "/admin/articles", icon: Newspaper, roles: ["admin", "editor"] },
  { title: "Categories", url: "/admin/categories", icon: FolderTree, roles: ["admin", "editor"] },
  { title: "Videos", url: "/admin/videos", icon: Video, roles: ["admin", "editor"] },
  // 👉 FIX: Yahan se "editor" hata diya, ab sirf admin ko dikhega
  { title: "Messages", url: "/admin/messages", icon: Mail, roles: ["admin"] },
  { title: "Users", url: "/admin/users", icon: Users, roles: ["admin"] },
  { title: "Live TV", url: "/admin/live-tv", icon: Tv, roles: ["admin"] },
  { title: "Notifications", url: "/admin/notifications", icon: Bell, roles: ["admin", "editor"] }, 
];

const settings = [
  { title: "Settings", url: "/admin/settings", icon: Settings, roles: ["admin"] },
  { title: "Pages", url: "/admin/pages", icon: FileText, roles: ["admin"] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const userRole = (user?.role || "editor").toLowerCase(); 

  const allowedMain = main.filter(item => item.roles.includes(userRole));
  const allowedSettings = settings.filter(item => item.roles.includes(userRole));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary shadow-elegant">
            <Logo className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground">APNO RAJASTHAN</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Admin Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allowedMain.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary-foreground border-l-2 border-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {allowedSettings.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50">System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {allowedSettings.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-primary-foreground border-l-2 border-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3">
        {!collapsed && user && (
          <div className="mb-2 rounded-md bg-sidebar-accent p-2 text-xs text-sidebar-foreground">
            <div className="font-medium">{user.name}</div>
            <div className="text-sidebar-foreground/60">{user.role.toUpperCase()}</div>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}