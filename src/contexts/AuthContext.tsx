import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "lumina-auth";

function readSession(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(STORAGE_KEY) === "1" ||
    window.sessionStorage.getItem(STORAGE_KEY) === "1"
  );
}

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (opts: { remember: boolean }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);

  const login = useCallback(({ remember }: { remember: boolean }) => {
    if (remember) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Auth consumer — hook lives alongside provider for a single module boundary */
// eslint-disable-next-line react-refresh/only-export-components -- hook + provider pair
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
