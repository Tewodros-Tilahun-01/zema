import { addEventListener, NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = addEventListener((state: NetInfoState) => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      // Show alert when network status changes
      if (isConnected !== null && isConnected !== connected) {
        setShowAlert(true);
        // Auto-hide alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }
      setIsConnected(connected);
    });
    return () => unsubscribe();
  }, [isConnected]);

  return { isConnected, showAlert };
};
