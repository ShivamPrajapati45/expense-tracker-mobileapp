import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import { getProfileImage } from '@/services/imageService'
import Icon from 'react-native-vector-icons/FontAwesome6';
import Input from '@/components/Input'
import { useAuth } from '@/context/AuthContext'


const ProfileModal = () => {
    const {user} = useAuth();
    const [userData, setUserData] = useState({
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
    const handleSubmit = async () => {

    }
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
                            source={getProfileImage(userData.image)}
                            resizeMode='cover'
                            className='self-center bg-neutral-300 h-32 w-32 rounded-full border border-neutral-600'
                        />
                        <TouchableOpacity>
                            <Icon   
                                name='pencil'
                                color={'black'}
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
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} className='px-2 w-full py-4 rounded-md bg-green-500'>
                    <Text className='text-xl text-center font-bold text-black'>{loading ? 'Updating' : 'Update'}</Text>
                </TouchableOpacity>
            </View>
        </ModalWrapper>
    )
}

export default ProfileModal

const styles = StyleSheet.create({})