"use client"
import { useAuth } from '@/contexts/authContext';
import { useEffect } from 'react';


const ProtectedRoute = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user, getUser } = useAuth()
    // 
    console.log(user);

    useEffect(() => {


        getUser()


    }, [])



    return <>
        {children}
    </>
}

export default ProtectedRoute