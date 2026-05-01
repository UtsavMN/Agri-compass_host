import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiPut } from '@/lib/httpClient';

type DistrictContextType = {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
};

const DistrictContext = createContext<DistrictContextType | undefined>(undefined);
const DISTRICT_STORAGE_KEY = 'agri-compass-selected-district';

export function DistrictProvider({ children }: { children: React.ReactNode }) {
  const [selectedDistrict, setSelectedDistrictState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem(DISTRICT_STORAGE_KEY);
    return stored ?? '';
  });

  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedDistrict) {
      localStorage.setItem(DISTRICT_STORAGE_KEY, selectedDistrict);
    } else {
      localStorage.removeItem(DISTRICT_STORAGE_KEY);
    }
  }, [selectedDistrict]);

  // Sync with backend profile if authenticated
  useEffect(() => {
    const syncDistrict = async () => {
      if (user?.id && selectedDistrict) {
        try {
          await apiPut(`/api/profiles/${user.id}`, { location: selectedDistrict });
        } catch (err) {
          console.error('Failed to sync district with profile:', err);
        }
      }
    };
    
    if (user?.id) {
       syncDistrict();
    }
  }, [selectedDistrict, user?.id]);

  const setSelectedDistrict = (district: string) => {
    setSelectedDistrictState(district);
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
