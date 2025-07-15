import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ModalWrapperProps } from '@/utils/types'

const ModalWrapper = ({
    children
}:ModalWrapperProps) => {
    return (
        <View className='flex-1 bg-neutral-800'>
            {children}
        </View>
    )
}

export default ModalWrapper

const styles = StyleSheet.create({})