import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  district: string | null;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  switchUser?: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MOCK_USERS = [
  { id: 'dev_user', username: 'dev_user', name: 'Dev User' },
  { id: 'user_a', username: 'user_a', name: 'Farmer A' },
  { id: 'user_b', username: 'user_b', name: 'Farmer B' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('mockUserId') || 'dev_user';
  });

  const switchUser = (userId: string) => {
    setActiveUserId(userId);
    localStorage.setItem('mockUserId', userId);
    window.location.reload(); // Reload to fetch user specific data
  };

  const activeMock = MOCK_USERS.find(u => u.id === activeUserId) || MOCK_USERS[0];

  const mockUser = {
    id: activeMock.id,
    username: activeMock.username,
    firstName: activeMock.name.split(' ')[0],
    lastName: activeMock.name.split(' ')[1] || '',
    fullName: activeMock.name,
    primaryEmailAddress: { emailAddress: `${activeMock.id}@example.com` }
  };

  const profile: Profile = {
    id: mockUser.id,
    username: mockUser.username,
    full_name: mockUser.fullName,
    email: mockUser.primaryEmailAddress.emailAddress,
    district: null,
  };

  const updateProfile = async (data: any) => {
    console.log("Mock updateProfile called with:", data);
  };

  const signOut = async () => {
    console.log("Mock sign out called");
    switchUser('dev_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        profile,
        session: { id: "mock-session-123", getToken: async () => "mock-token" },
        loading: false,
        signOut,
        updateProfile,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
