import { colors } from '@/constants/theme'
import { InputProps } from '@/utils/types'
import React from 'react'
import { TextInput, View } from 'react-native'

const Input = (props:InputProps) => {
    return (
        <View style={[props.containerStyle && props.containerStyle]} className='flex-row h-[50px] items-center rounded-md border-[1.5px] border-gray-200 px-4 gap-3 overflow-hidden'>
            {props.icon && props.icon}
            <TextInput
                style={[props.inputStyle]}
                placeholderTextColor={colors.neutral400}
                ref={props.inputRef && props.inputRef}
                {...props}
                className='text-white w-full font-semibold'
            />
        </View>
    )
}

export default Input