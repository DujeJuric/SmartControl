import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import Main from './main'



const Home = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [userToken, setUserToken] = useState(null)

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                console.log(token)
                if (token !== null) {
                    setUserToken(token)
                }
            } catch (error) {
                console.error('Error retrieving user token:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkToken()
    }, [])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return <>{userToken === null ? <LoginPage /> : <Main />}</>
}

export default Home
