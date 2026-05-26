import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "editor" | "Admin" | "Editor";

interface User { 
  name: string; 
  role: Role; 
  email?: string; 
  token?: string; 
  profilePic?: string; // Photo ke liye
}

interface AuthCtx {
  user: User | null;
  login: (name: string, role: Role, email?: string, token?: string, profilePic?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void; 
  setRole: (role: Role) => void; // 👉 Yahan setRole ka type add kiya
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  // 👉 ASALI MAGIC YAHAN HAI: useEffect hata diya! 
  // Ab page refresh hote hi React sabse pehle yahan se data aur photo uthayega bina kisi delay ke.
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("ar_admin_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (name: string, role: Role, email?: string, token?: string, profilePic?: string) => {
    const u: User = { name, role, email, token, profilePic };
    setUser(u);
    localStorage.setItem("ar_admin_user", JSON.stringify(u));
  };

  const logout = () => { 
    setUser(null); 
    localStorage.removeItem("ar_admin_user"); 
    // 👉 Logout karne par baaki bacha hua data bhi saaf taaki koi bug na aaye
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("ar_admin_user", JSON.stringify(updatedUser));
    }
  };

  // 👉 Naya function banaya jo Users.tsx me setRole wale error ko theek karega
  const setRole = (role: Role) => {
    updateUser({ role });
  };

  // 👉 setRole ko Provider ki value me pass kar diya
  return <Ctx.Provider value={{ user, login, logout, updateUser, setRole }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};