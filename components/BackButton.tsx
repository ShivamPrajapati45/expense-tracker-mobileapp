import { BackButtonProps } from '@/utils/types'
import { useRouter } from 'expo-router';
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

const BackButton = ({
    style,
    iconSize = 26
}: BackButtonProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity className='bg-gray-100 rounded-sm text-center ' style={{backgroundColor: 'gray',alignSelf:'flex-start',borderRadius: 10,padding:3}} onPress={() => router.back()}>
                <Icon name="chevron-back" size={30} color="white" className='rounded-sm p-2'  />
        </TouchableOpacity>
    )
}

export default BackButton