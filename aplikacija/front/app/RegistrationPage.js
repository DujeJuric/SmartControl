import { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import CustomButton from './customButton'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faHouseSignal } from '@fortawesome/free-solid-svg-icons'

const LoginPage = () => {
    const router = useRouter()

    const handlePress = () => {
        router.navigate('main')
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'SmartControl',
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
                <FontAwesomeIcon icon={faHouseSignal} size={50} color="white" />
                <Text style={styles.titleText}>Welcome to SmartControl.</Text>
            </View>
            <View style={styles.centerView}>
                <Text style={(color = 'black')}>Please register to continue</Text>
                <CustomButton onPress={handlePress} title="Register" />
            </View>
            <View style={styles.bottomView}>
                <Text style={styles.bottomText}>Already registered? Login.</Text>
            </View>
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

export default LoginPage
