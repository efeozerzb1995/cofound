import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
    const location = useLocation();
    
    useEffect(() => {
        // Page tracking disabled - base44 removed
    }, [location]);
    
    return null;
}