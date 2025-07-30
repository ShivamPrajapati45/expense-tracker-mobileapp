import { StyleSheet, Text, View,ImageBackground } from 'react-native'
import React from 'react'
import Menu from 'react-native-vector-icons/Entypo'
import useFetchData from '@/hooks/useFetchData';
import { WalletType } from '@/utils/types';
import { orderBy, where } from '@firebase/firestore';
import { useAuth } from '@/context/AuthContext';

const HomeCard = () => {
    const {user} = useAuth();
    const { 
        data:wallets,
        error,
        loading: walletLoading
    } = useFetchData<WalletType>('wallets',[
        where('uid', '==', user?.uid),
        orderBy('created','desc')
    ]);

    const getTotals = () => {
        return wallets.reduce((totals:any, item:WalletType) => {
            totals.balance = totals.balance + Number(item.amount);
            totals.income = totals.income + Number(item.totalIncome);
            totals.expenses = totals.expenses + Number(item.totalExpenses);
            return totals;
        }, {balance: 0, income: 0, expenses: 0})
    }

    return (
        <ImageBackground
            source={require('../assets/images/card.png')}
            className='h-52 w-full'
            resizeMode='stretch'
        >
            <View className='px-4 p-4 w-full justify-between h-[87%]'>
                <View>
                    {/* total Balance */}
                    <View className='flex-row items-center justify-between mb-1'>
                        <Text className='font-semibold text-lg text-neutral-800'>Total Balance</Text>
                        <Menu name='dots-three-horizontal' className='rounded-full' color={'black'} size={28} />
                    </View>
                    <Text className='font-bold text-3xl text-[#222222]'>${getTotals()?.balance?.toFixed(2)}</Text>
                </View>

                {/* total expenses and income */}
                <View className='flex-row items-center justify-between'>
                    {/* income */}
                    <View className='gap-2'>
                        <View className='flex-row items-center gap-1'>
                            <View className='items-center flex-row'>
                                <Menu name='arrow-long-down' className='rounded-full' color={'green'} size={12} />
                            </View>
                            <Text className='font-semibold text-sm text-neutral-700'>Income</Text>
                        </View>
                        <View className='self-center'>
                            <Text className='font-bold text-green-700 text-lg'>${getTotals()?.income?.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Expenses */}
                    <View className='gap-2'>
                        <View className='flex-row items-center gap-1'>
                            <View className='items-center flex-row'>
                                <Menu name='arrow-long-up' className='rounded-full' color={'red'} size={12} />
                            </View>
                            <Text className='font-semibold text-sm text-neutral-700'>Expense</Text>
                        </View>
                        <View className='self-center'>
                            <Text className='font-bold text-red-700 text-lg'>${getTotals()?.expenses?.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

            </View>
        </ImageBackground>
    )
}

export default HomeCard

const styles = StyleSheet.create({})