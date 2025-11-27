
import { useState, useEffect } from 'react';
import { GuestConfig } from '../types';
import { fetchOfficialTime } from '../constants';

export const useGuestStay = (config: GuestConfig) => {
  const [isTimeVerified, setIsTimeVerified] = useState(false);
  
  const [stayStage, setStayStage] = useState<'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout'>(() => {
    // Cálculo inicial síncrono (baseado na hora local) para evitar flash
    if (!config.checkInDate) return 'checkin';
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const parseDate = (str: string) => {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const checkIn = parseDate(config.checkInDate);
    
    if (now.getTime() < checkIn.getTime()) return 'pre_checkin';
    if (now.getTime() === checkIn.getTime()) return 'checkin';
    
    if (config.checkoutDate) {
      const checkOut = parseDate(config.checkoutDate);
      const preCheckoutDate = new Date(checkOut);
      preCheckoutDate.setDate(preCheckoutDate.getDate() - 1);
      
      if (now.getTime() === checkOut.getTime()) return 'checkout';
      if (now.getTime() === preCheckoutDate.getTime()) return 'pre_checkout';
    }
    return 'middle';
  });

  useEffect(() => {
    const updateStage = async () => {
      try {
        const now = await fetchOfficialTime();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        if (!config.checkInDate) {
          setStayStage('checkin');
        } else {
          const parseDate = (str: string) => {
            const [y, m, d] = str.split('-').map(Number);
            return new Date(y, m - 1, d);
          };

          const checkIn = parseDate(config.checkInDate);
          
          if (today.getTime() < checkIn.getTime()) {
            setStayStage('pre_checkin');
          } else if (today.getTime() === checkIn.getTime()) {
            setStayStage('checkin');
          } else if (config.checkoutDate) {
            const checkOut = parseDate(config.checkoutDate);
            const preCheckoutDate = new Date(checkOut);
            preCheckoutDate.setDate(preCheckoutDate.getDate() - 1);
            
            if (today.getTime() === checkOut.getTime()) {
              setStayStage('checkout');
            } else if (today.getTime() === preCheckoutDate.getTime()) {
              setStayStage('pre_checkout');
            } else {
              setStayStage('middle');
            }
          } else {
            setStayStage('middle');
          }
        }
        setIsTimeVerified(true);
      } catch (e) {
        console.warn("Usando horário do dispositivo (falha na rede)", e);
        setIsTimeVerified(true);
      }
    };

    updateStage(); 
    const interval = setInterval(updateStage, 60000); // Verifica a cada 1 min
    return () => clearInterval(interval);
  }, [config.checkInDate, config.checkoutDate]);

  const isPasswordReleased = (() => {
    if (!config.checkInDate) return true;
    const now = new Date(); 
    // Nota: Idealmente usaríamos a hora oficial aqui também, mas para UI instantânea usamos local
    // A validação de segurança real está no backend/logic se houvesse
    const [y, m, d] = config.checkInDate.split('-').map(Number);
    const checkIn = new Date(y, m - 1, d);
    const releaseDate = new Date(checkIn);
    releaseDate.setDate(releaseDate.getDate() - 1); 
    releaseDate.setHours(0, 0, 0, 0);
    return now.getTime() >= releaseDate.getTime();
  })();

  const isSingleNight = (() => {
      if (!config.checkInDate || !config.checkoutDate) return false;
      const [y1, m1, d1] = config.checkInDate.split('-').map(Number);
      const [y2, m2, d2] = config.checkoutDate.split('-').map(Number);
      const d1Date = new Date(y1, m1 - 1, d1);
      const d2Date = new Date(y2, m2 - 1, d2);
      const diffTime = d2Date.getTime() - d1Date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays === 1;
  })();

  return {
    stayStage,
    isTimeVerified,
    isPasswordReleased,
    isCheckoutToday: stayStage === 'checkout',
    isSingleNight
  };
};
