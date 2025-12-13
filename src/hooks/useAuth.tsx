import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "pharma_users";
const CURRENT_KEY = "pharma_current_user";
const SERVER_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function readUsers(): Record<string, { name: string; password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeUsers(obj: Record<string, { name: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(obj));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_KEY);
  }, [user]);

  const signup = async (name: string, email: string, password: string) => {
    // Try server API first
    try {
      const res = await fetch(`${SERVER_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      // if server returned conflict or other, fallthrough to localStorage fallback
    } catch (e) {
      // server not available, fallback
    }

    const users = readUsers();
    if (users[email]) return false; // already exists
    users[email] = { name, password };
    writeUsers(users);
    const newUser = { name, email };
    setUser(newUser);
    return true;
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${SERVER_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      // if server rejects, fallthrough to local fallback
    } catch (e) {
      // server not available
    }

    const users = readUsers();
    const record = users[email];
    if (!record) return false;
    if (record.password !== password) return false;
    setUser({ name: record.name, email });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default useAuth;
