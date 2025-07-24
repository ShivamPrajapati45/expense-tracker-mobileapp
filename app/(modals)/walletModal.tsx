import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import { useAuth } from '@/context/AuthContext'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { UserDataType, WalletType } from '@/utils/types'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import Right from 'react-native-vector-icons/Feather'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const WalletModal = () => {
    const router = useRouter()
    const {user,updateUserData} = useAuth();
    const [walletData, setWalletData] = useState<WalletType>({
        name: '',
        image: null
    });
    const oldWallet: {image:string, id:string, name:string} = useLocalSearchParams();
    useEffect(() => {
        if(oldWallet?.id){
            setWalletData({
                name:oldWallet?.name,
                image:oldWallet?.image
            })
        }
    },[])
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const {image, name} = walletData;
        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };

        if(oldWallet?.id) data.id = oldWallet.id;
        
        setLoading(true);
        const res = await createOrUpdateWallet(data);
        setLoading(false)
        console.log('Wallet: ', res);
        if(res.success){
            router.back();
        }else{
            Alert.alert('Wallet', res.msg);
        }

    };

    const onDelete = async () => {
        if(!oldWallet?.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet?.id);
        setLoading(false);

        if(res.success){
            router.back();
        }else{
            Alert.alert("Wallet",res.msg)
        }
    }

    const deleteAlert = () => {
        Alert.alert(
            "Confirm",
            'Are you sure want delete ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel'),
                    style: 'cancel'
                },
                {
                    text: "Delete",
                    onPress: () => onDelete(),
                    style: 'destructive'
                }
            ]
        )
    }
    return (
        <ModalWrapper>
            <View className='flex-1 justify-between px-4'>
                <Header
                    title={oldWallet?.id ? 'Update Wallet' : 'Create Wallet'}
                />
                {/* form */}
                <ScrollView className='mt-5'>
                    <View className='gap-2 mt-2'>
                        <Text className='text-neutral-400'>Wallet Name</Text>
                        <Input
                            placeholder='Eg.: Salary, Grocery'
                            value={walletData.name}
                            onChangeText={(value) => setWalletData({...walletData, name: value})}
                        />
                    </View>
                    <View className='gap-2 mt-5'>
                        <Text className='text-neutral-400'>Wallet Icon</Text>
                        {/* Image picker */}
                        <ImageUpload
                            file={walletData.image}
                            onClear={() => setWalletData({...walletData, image: null})}
                            onSelect={(file) => setWalletData({...walletData, image: file})}
                            placeholder='Upload Image'
                        />
                    </View>
                </ScrollView>
            </View>
            <View className='flex-row items-center justify-between mb-5 gap-2 px-5 pt-2'>
                {oldWallet?.id && !loading && (
                    <TouchableOpacity className='bg-red-600 py-4 px-5 rounded-md' onPress={deleteAlert} activeOpacity={0.75}>
                        <Right name='trash' color={'white'} size={28} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} className='px-10 py-4 rounded-md bg-[#a3e635]'>
                    <Text className='text-xl text-center font-bold text-black'>
                        {loading ? 'Creating...' : `${oldWallet?.id ? 'Update Wallet' : 'Create Wallet'}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </ModalWrapper>
    )
}

export default WalletModal

const styles = StyleSheet.create({})