import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/auth/check`,
      {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 필수
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log('현재 접속중:', data);
      if (data.user) {
        setUser(data.user);
      }
      setLoading(false);
    } else {
      console.log('로그인 필요');
      setLoading(false);
      return false;
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  //   useEffect(() => {
  //     fetch("/api/session", { credentials: "include" })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.user) {
  //           setUser(data.user);
  //         }
  //         setLoading(false);
  //       })
  //       .catch(() => setLoading(false));
  //   }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
