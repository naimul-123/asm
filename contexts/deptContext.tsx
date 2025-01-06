"use client"
import { getData } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useState } from 'react'
interface User {
    designation_bn: string;
    designation_en: string;
    name_bn: string;
    name_en: string;
    sap: number;
    _id: string

}
interface AuthContextType {
    user: User;
    sap: string;
    setSap: React.Dispatch<React.SetStateAction<string>>;
    userLoading: boolean;
    isLogIn: boolean
}

const authContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [sap, setSap] = useState('');
    const { data: user = {}, isLoading: userLoading } = useQuery({
        queryKey: ['user', sap],
        queryFn: () => getData(`/login/api/?sap=${sap}`)
    })
    let isLogIn = false;
    if (user?.sap) {
        isLogIn = true;
    }
    else {
        isLogIn = false;
    }
    console.log(isLogIn);
    const authInfo = { user, sap, setSap, isLogIn, userLoading }

    console.log(user);
    return (
        <authContext.Provider value={authInfo}>
            {children}
        </authContext.Provider>
    )
}

export const useAuthContext = () => {

    const context = useContext(authContext)
    if (!context) {
        throw new Error("UseAuthcontext must be used with an auth provider")
    }
    return context;
}