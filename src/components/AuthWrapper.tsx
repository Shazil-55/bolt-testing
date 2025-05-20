import { useEnhancedSelector } from '@/helpers/reduxHooks';
import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router';

const AuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const isAuth = useEnhancedSelector(state => state.User.isAuth)


    useEffect(() => {
        if (!isAuth) {
            navigate('/sign-in')
        }
    }, [isAuth])

    if (!isAuth) {
        return <></>
    }


    return (
        <>
            {children}
        </>
    )
}

export default AuthWrapper