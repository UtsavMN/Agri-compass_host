import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type DistrictContextType = {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
};

const DistrictContext = createContext<DistrictContextType | undefined>(undefined);
const DISTRICT_STORAGE_KEY = 'agri-compass-selected-district';

export function DistrictProvider({ children }: { children: React.ReactNode }) {
  const [selectedDistrict, setSelectedDistrictState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(DISTRICT_STORAGE_KEY) ?? '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedDistrict) {
      localStorage.setItem(DISTRICT_STORAGE_KEY, selectedDistrict);
    } else {
      localStorage.removeItem(DISTRICT_STORAGE_KEY);
    }
  }, [selectedDistrict]);

  // Sync with backend profile if authenticated
  const { user, session } = useAuth();
  useEffect(() => {
    const syncDistrict = async () => {
      if (user && session && selectedDistrict) {
        try {
          const token = await session.getToken();
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/profiles/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ district: selectedDistrict })
          });
        } catch (err) {
          console.error('Failed to sync district with profile:', err);
        }
      }
    };
    
    syncDistrict();
  }, [selectedDistrict, user, session]);

  const setSelectedDistrict = (district: string) => {
    // Not allowed to re-select once set as per requirements
    if (!selectedDistrict) {
      setSelectedDistrictState(district);
    }
  };

  return (
    <DistrictContext.Provider value={{ selectedDistrict, setSelectedDistrict }}>
      {children}
    </DistrictContext.Provider>
  );
}

export function useDistrictContext() {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error('useDistrictContext must be used within a DistrictProvider');
  }
  return context;
}
