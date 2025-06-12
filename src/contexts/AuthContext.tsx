import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  login_id: string;
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
  // 항상 로그인된 상태로 강제 설정
  // const [user, setUser] = useState<User | null>({
  //   id: 'test-id',
  //   name: '테스트유저',
  //   email: 'test@example.com',
  // });
  // const [loading] = useState(false);

  // 기존 인증 체크 함수 주석 처리

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

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
