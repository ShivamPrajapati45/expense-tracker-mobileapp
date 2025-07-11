import React from 'react'
import { Image, Text, View } from 'react-native'

const Index = () => {

    return (
        <View className='bg-black flex-1 items-center justify-center'>
            <Text className='text-xl font-bold'>Index</Text>
            <Image
                source={require('../assets/images/splashImage.png')}
            />
        </View>
    )
}

export default Index