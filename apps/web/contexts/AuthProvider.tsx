'use client'

import React from 'react'
type iAuthType = {
    email: string | null,
}

export const AuthContext = React.createContext<iAuthType | null>(null)

const AuthProvider = ({
    children,
    email,
}: {
    children: React.ReactNode,
    email: string | null
}) => {
    return (
        <AuthContext.Provider value={{ email }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider