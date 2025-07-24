import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useAuth } from '@/context/AuthContext'
import Right from 'react-native-vector-icons/Feather'
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import { useRouter } from 'expo-router'


const Home = () => {
    const {user} = useAuth();
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View className='flex-1 px-4 mt-1'>
                {/* header */}
                <View className='flex-row justify-between items-center mb-2'>
                    <View className='gap-1'>
                        <Text className='text-white text-2xl font-semibold'>Hello,</Text>
                        <Text className='text-white text-3xl font-bold'>{user?.name}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.75} className=''>
                        <Right name='search' className='p-1 rounded-full !text-neutral-300' size={28} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className='mt-2 pb-8 gap-4'
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                >
                    {/* card */}
                    <View>
                        <HomeCard/>
                    </View>

                    <TransactionList title='Recent Transactions' loading={false} data={[1,2,3,4,5,6,7,8,10]} />
                    
                </ScrollView>

                <TouchableOpacity onPress={() => router.push('/(modals)/transactionModal')} className='h-12 bg-[#a3e635] items-center justify-center text-center w-12 rounded-full absolute bottom-5 right-8' activeOpacity={0.9}>
                    <Right size={32} name='plus' color={'black'} />
                </TouchableOpacity>

            </View>
        </ScreenWrapper>
    )
}

export default Home

