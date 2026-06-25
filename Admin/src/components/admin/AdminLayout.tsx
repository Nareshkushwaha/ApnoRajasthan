import { Outlet, Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { Bell, Search, Sun, Moon, LogOut, User as UserIcon, Settings as SettingsIcon, CheckCheck, Camera, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export default function AdminLayout() {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 👉 ASLI FIX YAHAN HAI: Page load hote hi turant block kardo System Theme ko
  const [dark, setDark] = useState(() => {
    // 1. Sabse pehle local storage check karo
    const savedTheme = localStorage.getItem("admin-theme");
    
    // 2. Agar user ne pehle kabhi button daba kar save kiya hai, toh WAHi mano
    if (savedTheme === "light") return false;
    if (savedTheme === "dark") return true;
    
    // 3. Agar pehli baar aaya hai (koi storage nahi), tabhi default dark rakho ya system theme check karo
    return true; // Default dark rakhna hai toh true, light rakhna hai toh false kardo
  });
  
  const [notifs, setNotifs] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePic, setProfilePic] = useState(""); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isProfileOpen && user) {
        setProfileName(user.name || "");
        setProfileEmail(user.email || ""); 
        setProfilePic(user.profilePic || "");
    }
  }, [isProfileOpen, user]);

  // 👉 SECOND FIX: Classlist ko forcefully update karo aur Storage mein save karo
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/api/notifications/all`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
             const latestNotifs = data.reverse().slice(0, 5).map(n => ({...n, unread: true}));
             setNotifs(latestNotifs);
             setUnreadCount(latestNotifs.length);
          }
        })
        .catch(err => console.error("Notifications load nahi hue"));
    }
  }, [user]);

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const handleLogout = () => { logout(); navigate("/login"); };
  
  const markAllRead = () => {
      setNotifs(notifs.map(n => ({ ...n, unread: false })));
      setUnreadCount(0);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          const searchValue = e.currentTarget.value.trim();
          if(searchValue !== "") {
              navigate(`/admin/search?q=${encodeURIComponent(searchValue)}`);
          }
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    updateUser({ name: profileName, email: profileEmail, profilePic: profilePic });
    toast.success("Profile Details Saved!");
    setIsProfileOpen(false);
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Toggle button logic
  const toggleTheme = () => {
    setDark((prevDark) => !prevDark);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-card/90 px-3 backdrop-blur md:gap-3 md:px-4">
            <SidebarTrigger />
            <div className="hidden flex-1 max-w-md md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    placeholder="Search articles, users... (Press Enter)" 
                    className="pl-9 bg-background focus-visible:ring-primary" 
                    onKeyDown={handleSearch}
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-card border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <DropdownMenuLabel className="p-0 text-base font-bold text-foreground">Notifications</DropdownMenuLabel>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-muted hover:text-foreground" onClick={markAllRead}>
                      <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
                    </Button>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Koi naya notification nahi hai</div>
                    ) : (
                        notifs.map(n => (
                        <DropdownMenuItem 
                          key={n.id} 
                          className="flex items-start gap-2 px-3 py-2.5 focus:bg-muted focus:text-foreground cursor-pointer"
                          onClick={() => navigate("/admin/notifications")} 
                        >
                            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted"}`} />
                            <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-tight">{n.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{n.message}</p>
                            <p className="mt-1 text-[10px] text-muted-foreground">{n.sentAt ? new Date(n.sentAt).toLocaleString() : "Just now"}</p>
                            </div>
                        </DropdownMenuItem>
                        ))
                    )}
                  </div>
                  <div className="px-2 py-2">
                    <DropdownMenuSeparator className="bg-border" />
                    <Link to="/admin/notifications" className="block text-center text-sm font-medium text-primary hover:text-primary/80 mt-2">
                        View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 transition-colors hover:bg-muted sm:px-3 focus:outline-none focus:ring-2 focus:ring-primary">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground overflow-hidden">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden text-left text-xs sm:block">
                      <div className="font-medium text-foreground leading-none">{user.name}</div>
                      <div className="text-muted-foreground uppercase text-[10px] tracking-wider mt-0.5">{user.role}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{user.email || "No Email"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onSelect={() => setIsProfileOpen(true)} className="cursor-pointer focus:bg-muted focus:text-foreground">
                    <UserIcon className="mr-2 h-4 w-4" /> View Profile
                  </DropdownMenuItem>
                  {isAdmin ? (
                      <DropdownMenuItem asChild className="focus:bg-muted focus:text-foreground">
                        <Link to="/admin/settings"><SettingsIcon className="mr-2 h-4 w-4" /> Settings</Link>
                      </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 animate-fade-in p-3 md:p-6 text-foreground">
            <Outlet />
          </main>
        </div>
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-card text-foreground border-border">
          <div className="h-20 w-full bg-gradient-to-r from-primary/80 to-primary/40 relative"></div>
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex justify-between items-end -mt-10 mb-4">
              <div className="relative h-20 w-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-sm overflow-visible">
                <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-primary">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    profileName ? profileName.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                <button 
                  className="absolute bottom-0 right-0 bg-background border border-border rounded-full p-1.5 shadow-md hover:bg-muted transition-colors cursor-pointer z-10"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Profile Photo"
                >
                  <Camera className="h-3 w-3 text-foreground" />
                </button>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 shadow-sm mb-2 bg-muted text-foreground">
                <Shield className="h-3.5 w-3.5" />
                {user.role.toUpperCase()}
              </Badge>
            </div>
            <DialogHeader className="mb-4 text-left">
              <DialogTitle className="text-xl text-foreground">My Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Name</Label>
                <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="focus-visible:ring-primary h-9 bg-background text-foreground" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email</Label>
                <Input id="email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="focus-visible:ring-primary h-9 bg-background text-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-3 bg-muted/30 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsProfileOpen(false)} className="hover:bg-muted hover:text-foreground">Cancel</Button>
            <Button size="sm" onClick={handleProfileSave} className="gradient-primary text-primary-foreground">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}