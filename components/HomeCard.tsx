import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Menu from 'react-native-vector-icons/Entypo'
import { ImageBackground } from 'react-native'

const HomeCard = () => {
    return (
        <ImageBackground
            source={require('../assets/images/card.png')}
            className='h-52 w-full'
            resizeMode='stretch'
        >
            <View className='px-4 p-4 w-full justify-between h-[87%]'>
                <View>
                    {/* total Balance */}
                    <View className='flex-row items-center justify-between mb-1'>
                        <Text className='font-semibold text-lg text-neutral-800'>Total Balance</Text>
                        <Menu name='dots-three-horizontal' className='rounded-full' color={'black'} size={28} />
                    </View>
                    <Text className='font-bold text-3xl text-[#222222]'>$2389.0</Text>
                </View>

                {/* total expenses and income */}
                <View className='flex-row items-center justify-between'>
                    {/* income */}
                    <View className='gap-2'>
                        <View className='flex-row items-center gap-1'>
                            <View className='items-center flex-row'>
                                <Menu name='arrow-long-down' className='rounded-full' color={'green'} size={12} />
                            </View>
                            <Text className='font-semibold text-sm text-neutral-700'>Income</Text>
                        </View>
                        <View className='self-center'>
                            <Text className='font-bold text-green-700 text-lg'>$276</Text>
                        </View>
                    </View>

                    {/* Expenses */}
                    <View className='gap-2'>
                        <View className='flex-row items-center gap-1'>
                            <View className='items-center flex-row'>
                                <Menu name='arrow-long-up' className='rounded-full' color={'red'} size={12} />
                            </View>
                            <Text className='font-semibold text-sm text-neutral-700'>Expense</Text>
                        </View>
                        <View className='self-center'>
                            <Text className='font-bold text-red-700 text-lg'>$276</Text>
                        </View>
                    </View>
                </View>

            </View>
        </ImageBackground>
    )
}

export default HomeCard

const styles = StyleSheet.create({})