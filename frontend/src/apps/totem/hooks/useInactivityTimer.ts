import { useEffect, useRef, useCallback } from 'react';

export const useInactivityTimer = (timeoutMs: number, onTimeout: () => void) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(onTimeout, timeoutMs);
    }, [timeoutMs, onTimeout]);

    useEffect(() => {
        // Events to listen for activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        // Start timer initially
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer]);

    return resetTimer; // Return reset function if needed manually
};
