import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faHouseSignal } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './customButton'
import { BASE_URL } from './index'

const Main = () => {
    const router = useRouter()
    url = BASE_URL
    const handlePress = () => {
        router.navigate('LoginPage')
    }
    const handleGet = () => {
        console.log('fetching')
        id = '660c0a0e79396105fa705457'
        fetch(url + '/getUsers')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((data) => {
                console.log(data)
                console.log('ok')
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error)
            })
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
                <Text style={(color = 'black')}>Your devices: </Text>
                <CustomButton onPress={handlePress} title="Back" />
                <CustomButton onPress={handleGet} title="Fetch" />
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
