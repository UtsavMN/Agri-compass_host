import { createContext, useContext, ReactNode } from 'react';
import { useUser, useClerk, useSession } from '@clerk/clerk-react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const { signOut } = useClerk();

  let profile: Profile | null = null;
  
  if (user) {
    profile = {
      id: user.id,
      username: user.username,
      full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.primaryEmailAddress?.emailAddress || null,
      district: null, // Could map to user metadata if desired
    };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading: !isLoaded,
        signOut,
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
