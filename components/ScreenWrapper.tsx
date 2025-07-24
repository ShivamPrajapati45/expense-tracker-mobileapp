import { colors } from '@/constants/theme'
import { ScreenWrapperProps } from '@/utils/types'
import React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'

let dimensions = Dimensions.get('window');
// console.log(dimensions);

const ScreenWrapper = ({children,style}:ScreenWrapperProps) => {
    let paddingTop = Platform.OS === 'ios' ? dimensions.height * 0.06 : 20;
    return (
        <View style={[{
            paddingTop,
            flex: 1,
            backgroundColor: 'black',
        },style]}>
            <StatusBar barStyle={'light-content'} />
            {children}
        </View>
    )
}

export default ScreenWrapper;
