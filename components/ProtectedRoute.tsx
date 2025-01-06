"use client"
import React, { useState } from 'react'
import { useEffect } from 'react';


const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch("/apis/getUser")
            if (res.ok) {
                const data = await res.json();
                setUser(data.payload)
            }
            else window.location.href = ('/login')
        }

        getUser()


    }, [])



    return user ? (
        <>{children}</>
    ) : (
        <p>Loading</p>
    )
}

export default ProtectedRoute