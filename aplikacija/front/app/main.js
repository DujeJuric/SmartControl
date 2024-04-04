import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faHouseSignal } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './customButton'
import { BASE_URL } from '../utility/url.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { ActivityIndicator } from 'react-native'

const Main = () => {
    url = BASE_URL
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [full_name, setFullName] = useState('')
    const [devices, setDevices] = useState([])
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                if (token === null) {
                    router.navigate('LoginPage')
                    return
                }
                const userEmail = await AsyncStorage.getItem('email') // Get email separately
                setEmail(userEmail)

                const userResponse = await fetch(url + '/getUser/' + userEmail)
                if (!userResponse.ok) {
                    throw new Error('Network response was not ok')
                }
                const userData = await userResponse.json()
                setFullName(userData.full_name)

                // setUserId(userData._id)
                // const devicesResponse = await fetch(url + '/getDevices/' + userData._id)
                // if (!devicesResponse.ok) {
                //     throw new Error('Network response was not ok')
                // }
                // const devicesData = await devicesResponse.json()
                // setDevices(devicesData)

                setLoading(false)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleLogout = () => {
        removeToken()
        router.navigate('LoginPage')
    }

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem('userToken')
        } catch (error) {
            console.error('Error removing user token:', error)
        }
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'MainPage',
                    headerStyle: {
                        backgroundColor: '#FF7B00',
                        height: '20%',
                        border: '5px solid black',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: 'black',
                    },
                    headerShown: false,
                    headerRight: () => <FontAwesomeIcon icon={faUser} style={{ color: 'white' }} size={30} />,
                }}
            />

            <View style={styles.titleView}>
                <Text style={styles.titleText}>Main page</Text>
            </View>
            <View style={styles.centerView}>
                {loading ? ( // Display loading indicator if loading is true
                    <ActivityIndicator size="large" color="#FF7B00" />
                ) : (
                    <>
                        <Text style={{ color: 'black' }}>Welcome, {full_name}!</Text>
                        {devices.map((device) => (
                            <Text key={device.device_id}>{device.device_name}</Text>
                        ))}
                        <CustomButton onPress={handleLogout} title="Logout" />
                    </>
                )}
            </View>
            <View style={styles.bottomView}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 'fit-content',
    },

    titleView: {
        flex: 1,
        backgroundColor: '#FF7B00',
        alignItems: 'center',
        width: '100%',
        maxHeight: 'fit-content',
        justifyContent: 'center',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        paddingTop: 10,
    },
    centerView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        paddingVertical: '40%',
    },
    bottomView: {
        flex: 1,
        backgroundColor: '#FF7B00',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingVertical: 0,
    },
    titleText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomText: {
        fontSize: 16,
        color: '#fff',
    },
})

export default Main
