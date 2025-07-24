import Header from '@/components/Header'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import { useAuth } from '@/context/AuthContext'
import { getProfileImage } from '@/services/imageService'
import { updateUser } from '@/services/userService'
import { UserDataType } from '@/utils/types'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'



const ProfileModal = () => {
    const router = useRouter()
    const {user,updateUserData} = useAuth();
    const [userData, setUserData] = useState<UserDataType>({
        name: '',
        image: null
    });
    useEffect(() => {
        setUserData({
            name: user?.name || '',
            image: user?.image || null
        })
    },[user])
    
    const [loading, setLoading] = useState(false);

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: false,
            aspect: [4, 3],
            quality: 0.5,
        });
        // console.log(result.assets[0]);

        if (!result.canceled) {
            setUserData({...userData, image: result.assets[0].uri})
        }
    }
    const handleSubmit = async () => {
        const {image, name} = userData;
        
        setLoading(true);
        const res = await updateUser(user?.uid as string, userData);
        if(res.success){
            // update user state
            updateUserData(user?.uid as string);
            router.back();
        }else{
            Alert.alert('user', res.msg);
        }
        setLoading(false);

    }
    console.log('Users: ',getProfileImage(userData?.image))
    return (
        <ModalWrapper>
            <View className='flex-1 justify-between px-4'>
                <Header
                    title='Update Profile'
                />

                {/* form */}
                <ScrollView className='mt-5 gap-4'>
                    <View className='relative self-center'>
                        <Image
                            source={getProfileImage(userData?.image)}
                            style={{ alignSelf: 'center', backgroundColor: '#d1d5db', height: 128, width: 128, borderRadius: 64, borderWidth: 1, borderColor: '#52525b' }}
                            resizeMode='cover'
                        />
                        <TouchableOpacity className='' onPress={onPickImage}>
                            <Icon   
                                name='pencil'
                                color={'white'}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View className='gap-2'>
                        <Text className='text-neutral-400'>Name</Text>
                        <Input
                            placeholder='Name'
                            value={userData.name}
                            onChangeText={(value) => setUserData({...userData, name: value})}
                        />
                    </View>
                </ScrollView>
            </View>
            <View className='flow-row items-center justify-center mb-5 gap-2 px-5 pt-2'>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} className='px-2 w-full py-4 rounded-md bg-[#a3e635]'>
                    <Text className='text-xl text-center font-bold text-black'>{loading ? 'Updating' : 'Update'}</Text>
                </TouchableOpacity>
            </View>
        </ModalWrapper>
    )
}

export default ProfileModal

const styles = StyleSheet.create({})