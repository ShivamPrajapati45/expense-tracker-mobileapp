import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/utils/types'

export default function Header({title = '',leftIcon,rightIcon,style}: HeaderProps) {
    return (
        <View className='flex-row items-center w-full'>
            {leftIcon &&<View className='self-start'>{leftIcon}</View>}
            {title && (
                <Text
                    className={`${leftIcon ? 'w-[80%]' : 'w-full'} text-center text-white font-bold text-2xl`}
                >
                    {title}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({})