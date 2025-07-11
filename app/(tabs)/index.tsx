import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import ScreenWrapper from '@/components/ScreenWrapper'

const Home = () => {
    const handleLogout = async () => {
        await signOut(auth);
    }
    return (
        <ScreenWrapper>
            <View className='flex-1 items-center justify-center'>
                <TouchableOpacity onPress={handleLogout} className='bg-red-500 rounded-md py-2 px-10 mt-4'>
                    <Text className='text-white uppercase font-bold text-center'>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    )
}

export default Home

