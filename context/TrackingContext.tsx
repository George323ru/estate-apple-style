
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UserJourney, PageVisit } from '../types';

interface TrackingContextType {
  getJourney: () => UserJourney;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const sessionId = useRef(`sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const visits = useRef<PageVisit[]>([]);

  useEffect(() => {
    // Record page visit
    const visit: PageVisit = {
      path: location.pathname,
      timestamp: Date.now(),
      referrer: document.referrer
    };
    visits.current.push(visit);
    
    // Optional: Log to console in dev
    if (process.env.NODE_ENV === 'development') {
      console.log('Tracking:', visit);
    }
  }, [location]);

  const getJourney = (): UserJourney => {
    return {
      sessionId: sessionId.current,
      visits: visits.current,
      userAgent: navigator.userAgent,
      deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
    };
  };

  return (
    <TrackingContext.Provider value={{ getJourney }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
