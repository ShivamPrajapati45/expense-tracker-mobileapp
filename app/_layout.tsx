import {AuthProvider} from "@/context/AuthContext"
import '@/global.css'
import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message';

const StackLayout = () => {
    return <Stack screenOptions={{headerShown: false}} >
        <Stack.Screen
            name="(modals)/profileModal"
            options={{
                presentation: 'modal'
            }}
        />
    </Stack>
}

export default function RootLayout(){

    return (
        <AuthProvider>
            <SafeAreaView className='flex-1'>
                <StackLayout/>
                <Toast/>
            </SafeAreaView>
        </AuthProvider>
    )
}
