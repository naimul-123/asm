import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { clearTimeout } from 'timers';
import { setTimeout } from 'timers/promises';

const useUserActivity = () => {
    const router = useRouter();
    let logoutTimer;
    const resetTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push('/login');

        }, 15 * 60 * 1000);
    }

    useEffect(() => {
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        resetTimer();
    }, [router])
    return (
        null
    )
}

export default useUserActivity