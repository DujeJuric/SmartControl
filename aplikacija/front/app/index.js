import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginPage from './LoginPage.js'

const Stack = createNativeStackNavigator()

// export const BASE_URL = 'https://7b7d-213-202-117-142.ngrok-free.app' //LAPTOP
export const BASE_URL = 'https://new-physically-husky.ngrok-free.app' // PC

const Home = () => {
    return <LoginPage />
}

export default Home
