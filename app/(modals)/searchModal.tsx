import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import { useAuth } from '@/context/AuthContext'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { TransactionType, WalletType } from '@/utils/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import Right from 'react-native-vector-icons/Feather'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useFetchData from '@/hooks/useFetchData'
import { orderBy, where } from '@firebase/firestore'
import TransactionList from '@/components/TransactionList'


const SearchModal = () => {

    const router = useRouter()
    const {user,updateUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const constraints = [
        where('uid', "==", user?.uid),
        orderBy("date", "desc"),
    ];

    const { 
        data:allTransactions,
        error,
        loading: transactionLoading
    } = useFetchData<TransactionType>('transactions',constraints);

    const filteredTransactions = allTransactions.filter((item) => {
        if(search.length > 1){
            if(
                item.category?.toLowerCase().includes(search?.toLowerCase()) || item.type?.toLowerCase().includes(search?.toLowerCase()) || item.description?.toLowerCase().includes(search?.toLowerCase()) 
            ){
                return true
            }
            return false
        }
        return true;
    })

    return (
        <ModalWrapper style={{backgroundColor: 'black'}}>

            <View className='flex-1 mt-2  justify-between px-4'>
                <Header
                    title='Search'
                />
                {/* form */}
                <ScrollView className='mt-5'>
                    <View className='gap-2 mt-2'>
                        <Input
                            placeholder='Eg.: Salary, Grocery'
                            value={search}
                            placeholderTextColor={'white'}
                            containerStyle={{ backgroundColor: 'black' }}
                            onChangeText={(value) => setSearch(value)}
                        />
                    </View>

                    <View>
                        <TransactionList
                            loading={transactionLoading}
                            data={filteredTransactions}
                            emptyListMessage='No transaction match your search keywords'
                        />
                    </View>

                </ScrollView>
            </View>

        </ModalWrapper>
    )
}

export default SearchModal

const styles = StyleSheet.create({})