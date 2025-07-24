import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/utils/types'
import Right from 'react-native-vector-icons/Feather'
import Cancel from 'react-native-vector-icons/Entypo'
import { getFilePath } from '@/services/imageService'
import * as ImagePicker from 'expo-image-picker'


const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    placeholder = '',
    containerStyle,
    imageStyle
}: ImageUploadProps) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: false,
            aspect: [4, 3],
            quality: 0.5,
        });
        // console.log(result.assets[0]);

        if (!result.canceled) {
            onSelect(result.assets[0].uri)
        }
    }
    return (
        <View>
            {!file && (
                <TouchableOpacity onPress={pickImage} className='flex-row  items-center justify-center gap-5 border border-neutral-100 rounded-lg py-2 ' activeOpacity={0.8}>
                    <Right name='upload' className='p-1 rounded-full' color={'white'} size={28} />
                    {placeholder && <Text className='text-white text-lg'>{placeholder}</Text>}
                </TouchableOpacity>
            )}

            {file && (
                <View className='h-36 rounded-lg flex-row flex-1 w-full overflow-hidden'>
                    <Image
                        //@ts-ignore
                        source={getFilePath(file)}
                        resizeMode='contain'
                        className='flex-1 w-full'
                    />
                    <TouchableOpacity onPress={onClear} className='' activeOpacity={0.8}>
                        <Cancel 
                            name='cross' 
                            className='p-1 bg-white rounded-full' 
                            color={'black'} size={28} 
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default ImageUpload

const styles = StyleSheet.create({})