import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import RegistrationPage from './RegistrationPage.js'

const Stack = createNativeStackNavigator()

const Home = () => {
    return <RegistrationPage />
}

export default Home
