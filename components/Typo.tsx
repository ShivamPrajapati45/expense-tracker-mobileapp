import { colors } from '@/constants/theme'
import React from 'react'
import { Text, TextStyle } from 'react-native'
import {TypoProps} from '@/utils/types'
import { verticalScale } from '@/utils/styling'

const Typo = ({
    size,
    color = colors.text,
    fontWeight = '400',
    children,
    style,
    textProps = {},
}: TypoProps) => {
    const textStyle: TextStyle = { //@ts-ignore
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color,
        fontWeight
    }
    return <Text {...textProps} style={[textStyle,style]}>{children}</Text>
}

export default Typo