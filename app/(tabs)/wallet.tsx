import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Right from 'react-native-vector-icons/Feather'
import { useRouter } from 'expo-router'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/utils/types'
import { orderBy, where } from '@firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import WalletListItem from '@/components/WalletListItem'


const Wallet = () => {
    const router = useRouter();
    const {user} = useAuth();
    const { data:wallets,error,loading } = useFetchData<WalletType>('wallets',[
        where('uid', '==', user?.uid),
        orderBy('created','desc')
    ]);



    const getTotalBalance = () => {
        wallets.reduce((total, item) => {
            total = total + (item.amount || 0);
            return total;
        },0)
    }

    return (
        <ScreenWrapper>
            <View className='flex-1'>
                {/* Balance */}
                <View className='h-40 bg-black justify-center items-center'>
                    <View className='items-center gap-3'>
                        <Text className='font-bold text-4xl text-white'>
                            ${getTotalBalance()}
                        </Text>
                        <Text className='text-lg font-semibold text-neutral-300'>
                            Total Balance
                        </Text>
                    </View>
                </View>

                {/* wallet */}
                <View className='bg-neutral-800 rounded-t-3xl flex-1 pt-5'>

                    {/* header */}
                    <View className='flex-row justify-between items-center mb-2 px-5'>
                        <Text className='font-semibold text-2xl text-[#a3e635]'>
                            Wallet
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(modals)/walletModal')} className='' activeOpacity={0.8}>
                            <Right name='plus' className='bg-[#a3e635] p-1 rounded-full' color={'black'} size={28} />
                        </TouchableOpacity>
                    </View>

                    {/* Todo: Wallets Lists */}
                    <View className='flex-1 px-3 justify-between items-center'>
                        {loading && <Text className='text-white mt-32 font-bold animate-pulse text-xl'>loading...</Text> }
                        <FlatList
                            data={wallets}
                            contentContainerClassName='py-5 pt-2'
                            renderItem={({ item,index }) => {
                                return (
                                    <WalletListItem
                                        item={item}
                                        index={index}
                                        router={router}
                                    />
                                )
                            }}
                        />
                    </View>

                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Wallet

