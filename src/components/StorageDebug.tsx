// Storage Debug Helper
// Add this to your page temporarily to see what's stored

import { useEffect, useState } from 'react';

export function StorageDebug() {
  const [storage, setStorage] = useState<any>({});

  useEffect(() => {
    const updateStorage = () => {
      setStorage({
        pharma_users: localStorage.getItem('pharma_users'),
        pharma_current_user: localStorage.getItem('pharma_current_user'),
        all_keys: Object.keys(localStorage),
      });
    };
    
    updateStorage();
    const interval = setInterval(updateStorage, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('All storage cleared! Refresh the page.');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.9)', 
      color: 'lime',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        🔍 Storage Debug
      </div>
      <div>Users: {storage.pharma_users || 'empty'}</div>
      <div>Current: {storage.pharma_current_user || 'none'}</div>
      <div>Keys: {storage.all_keys?.length || 0}</div>
      <button 
        onClick={clearAll}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Clear All Storage
      </button>
    </div>
  );
}

// To use: Add <StorageDebug /> to your Signup.tsx temporarily
