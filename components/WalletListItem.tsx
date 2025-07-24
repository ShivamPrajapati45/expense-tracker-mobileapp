import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { WalletType } from '@/utils/types'
import { Router } from 'expo-router'
import { getProfileImage } from '@/services/imageService'
import Right from 'react-native-vector-icons/Feather'
import Animated, { FadeInDown } from 'react-native-reanimated'

const WalletListItem = ({item,index,router}: {
    item: WalletType,
    index: number,
    router: Router
}) => {
    
    const openWallet = () => {
        router.push({
            pathname: '/(modals)/walletModal',
            params: {
                id: item?.id,
                name: item?.name,
                image: item?.image
            }
        })
    }

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 300)
                .springify()
                .damping(13)
            }
        >
            <TouchableOpacity onPress={openWallet} className='flex-row bg-neutral-700 rounded-md px-2 py-1 justify-between w-full items-center mb-3' activeOpacity={0.84}>
                <View className='h-20 w-20 self-center rounded-md overflow-hidden'>
                    <Image
                        source={getProfileImage(item?.image)}
                        className='h-full flex-1 w-full'
                        resizeMode='cover'
                    />
                </View>
                <View className='flex-1 gap-2 ml-4'>
                    <Text className='text-xl text-neutral-100'>{item?.name}</Text>
                    <Text className='text-lg text-neutral-300'>${item?.amount}</Text>
                </View>
                <Right name='chevron-right' color={'white'} size={28} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default WalletListItem

const styles = StyleSheet.create({})