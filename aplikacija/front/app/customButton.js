import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const CustomButton = ({ onPress, title, marginTop }) => {
    return (
        <TouchableOpacity style={marginTop ? [styles.container, { marginTop }] : styles.container} onPress={onPress}>
            <LinearGradient
                colors={['#FFD050', '#FF8F00']} // Light to dark orange colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        overflow: 'hidden', // Ensure that the gradient doesn't overflow the button container
        width: '80%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default CustomButton
