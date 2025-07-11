import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View,Image,Text } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'


const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View className='flex-1 justify-between'>
                {/* login btn and image */}
                <View className=''>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.75} className='self-end mr-5 font-semibold uppercase px-5 py-2 rounded-sm bg-blue-500'>
                        <Typo>
                            Sign In
                        </Typo>
                    </TouchableOpacity>
                    <Animated.Image
                        entering={FadeIn.duration(2000)}
                        source={require('../../assets/images/welcome.png')}
                        resizeMode='contain'
                        className='w-full h-[300px] mt-10 self-center'
                    />
                </View>

                {/* footer */}
                <View 
                    className="items-center shadow-white pb-[50px] gap-[20px] shadow-lg"
                    style={{
                        shadowColor: 'white',
                        shadowOffset: { width: 0, height: -10 },
                        shadowOpacity: 0.15,
                        shadowRadius: 25,
                        elevation: 10,
                    }}
                >
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} className='items-center gap-2'>
                        <Text className='text-2xl font-semibold text-white'>Always take control</Text>
                        <Text className='text-2xl font-semibold text-white'>of your finances</Text>
                    </Animated.View>
                    <View className='items-center gap-2'>
                        <Text className='text-xs font-semibold text-white'>Finances must be arranged to set a better lifecycle in future</Text>
                    </View>
                    <View className='items-center gap-2 w-full px-10'>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.8} className='bg-yellow-300 w-full rounded-md py-3 '>
                            <Text className='text-black font-semibold text-lg uppercase text-center'>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome