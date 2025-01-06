"use client"

import { postData } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react'
interface User {
    sap: number;
    name: string;
    designation: string;
    department?: string;
    section?: string;
    cell?: string;
    chember?: string
}

interface AuthContextType {
    loginmutation: any;
    profilemutation: any;
    loginError: string;
    user: User | null,
    loading: boolean;
    refetchUser: () => void;
    logout: () => void;
    isOpenModal: boolean
    setIsOpemModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {

    const [loginError, setLoginError] = useState('')
    const [isOpenModal, setIsOpemModal] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient();


    // const loginmutation = useMutation({
    //     mutationFn: async (data) => postData('/apis/login', data),
    //     onSuccess: async (result) => {
    //         if (result.statusText === "OK") {
    //             // console.log("Login successfull");
    //             setLoginError('')
    //             await queryClient.invalidateQueries(['user'])
    //             router.push('/dashboard')
    //         }
    //         else {
    //             console.log("Failed Login:", result);
    //         }
    //     },
    //     onError: (error) => {
    //         setLoginError(error?.response?.data?.error || "Login failed")
    //     }
    // });
    // const profilemutation = useMutation({
    //     mutationFn: async (data) => postData('/apis/updateUser', data),
    //     onSuccess: async (result) => {
    //         if (result.statusText === "OK") {
    //             console.log("Uprate successfull");
    //             await queryClient.invalidateQueries(['user'])


    //         }
    //         else {
    //             console.log("Failed to update:", result);
    //         }
    //     },
    //     onError: (error) => {
    //         setLoginError(error?.response?.data?.error || "Update failed")
    //     }
    // });


    // const { data: user, isLoading: loading, refetch: refetchUser } = useQuery({
    //     queryKey: ["user"],
    //     queryFn: async () => {
    //         try {
    //             const response = await axios.get("/apis/user");
    //             return response.data.user;
    //         } catch (error) {
    //             console.log("Error log in user from auth context", error);
    //             if (error?.response?.status === 401 || error.response?.status === 403 || error?.response?.status === 500) {
    //                 router.push('/login')
    //             }
    //             return null
    //         }

    //     },
    //     staleTime: 0,
    //     retry: false
    // }

    // )

    const logout = async () => {
        try {
            await axios.post('/apis/logout');
            await queryClient.invalidateQueries(['user'])
            queryClient.clear();
            router.push('/login');
            setIsOpemModal(false)

        }
        catch (error) {
            console.error('Logout failed:', error)
        }
    }


    const authInfo = { loginError, isOpenModal, setIsOpemModal, logout }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("UseAuthcontext must be used with an auth provider")
    }
    return context;
}                                                                                                                                                                                          
