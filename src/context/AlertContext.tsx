"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react'; // DEĞİŞİKLİK: ReactNode tipi ayrı olarak import edildi.

// Modal'ın alabileceği durum tipleri
type AlertType = 'success' | 'error' | 'info';

// Context'in içinde tutulacak verilerin tipi
interface AlertContextType {
  showAlert: (message: string, type?: AlertType, title?: string) => void;
  hideAlert: () => void;
  alertState: {
    isOpen: boolean;
    message: string;
    type: AlertType;
    title: string;
  };
}

// Context'i oluşturuyoruz
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Diğer bileşenlerin bu context'e kolayca erişmesini sağlayacak özel bir hook
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Tüm uygulamayı sarmalayacak olan Provider bileşeni
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    type: 'info' as AlertType,
    title: '',
  });

  const showAlert = useCallback((message: string, type: AlertType = 'info', title?: string) => {
    let alertTitle = title;
    if (!alertTitle) {
        switch (type) {
            case 'success':
                alertTitle = 'Başarılı!';
                break;
            case 'error':
                alertTitle = 'Bir Hata Oluştu!';
                break;
            default:
                alertTitle = 'Bilgilendirme';
        }
    }
    setAlertState({ isOpen: true, message, type, title: alertTitle });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  const value = { showAlert, hideAlert, alertState };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

