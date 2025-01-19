"use client"


import { postData } from '@/lib/api';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import Swal from 'sweetalert2';
interface User {
    sap: number;
    name: string;
    designation: string;
    department?: string;
    section?: string;
    cell?: string;
    chember?: string
}

interface UserUpdate {
    sap: number;
    department: string;
    section: string;

}

interface AuthContextType {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>;
    logout: () => Promise<void>
    getUser: () => Promise<void>
    isOpenModal: boolean
    setIsOpemModal: Dispatch<SetStateAction<boolean>>;
    profileMutation: UseMutationResult<AxiosResponse, Error, UserUpdate>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [user, setUser] = useState<User | null>(null)
    const [isOpenModal, setIsOpemModal] = useState<boolean>(false)
    const router = useRouter()
    const queryClient = useQueryClient();


    const logout = async () => {
        try {
            await axios.post('/apis/logout');
            queryClient.clear();
            router.push('/login');
            setIsOpemModal(false)
            setUser(null)

        }
        catch (error) {
            console.error('Logout failed:', error)
        }
    }
    const getUser = async () => {
        const res = await fetch("/apis/getUser")
        if (res.ok) {
            const data = await res.json();
            setUser(data.payload)
        }
        else window.location.href = ('/login')
    }
    const profileMutation: UseMutationResult<AxiosResponse, Error, UserUpdate> = useMutation({
        mutationFn: async (data) => postData('/apis/updateUser', data),
        onSuccess: async (result) => {
            if (result.data) {
                getUser()
                console.log(result.data);

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User info have been updated successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
    const authInfo = { user, setUser, getUser, isOpenModal, setIsOpemModal, logout, profileMutation }


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
