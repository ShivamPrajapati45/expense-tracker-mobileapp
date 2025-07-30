import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import ModalWrapper from '@/components/ModalWrapper'
import { deleteWallet } from '@/services/walletService'
import { TransactionType, WalletType } from '@/utils/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import Right from 'react-native-vector-icons/Feather'
import { Dropdown } from 'react-native-element-dropdown'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { expenseCategories, transactionTypes } from '@/constants/data'
import useFetchData from '@/hooks/useFetchData'
import { orderBy, where } from '@firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '@/components/Input'
import { createOrUpdateTransaction, deleteTransaction } from '@/services/trasactionService'


const TransactionModal = () => {
    const router = useRouter()
    const {user} = useAuth();

    const { 
            data:wallets,
            error:walletError,
            loading:walletLoading 
        } = useFetchData<WalletType>('wallets',[
        where('uid', '==', user?.uid),
        orderBy('created','desc')
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description:'',
        category: '',
        date: new Date(),
        walletId:'',
        image: null,
    });
    type paramType = {
        id: string;
        type: string;
        amount: string;

        category: string;
        date: string;
        description?: string;
        image?: any;
        uid: string;
        walletId: string

    }
    const oldTransaction: paramType = useLocalSearchParams();
    useEffect(() => {
        if(oldTransaction?.id){
            setTransaction({
                type: oldTransaction?.type,
                amount: Number(oldTransaction.amount),
                description: oldTransaction?.description || '',
                category: oldTransaction?.category || '',
                date: new Date(oldTransaction?.date),
                walletId: oldTransaction.walletId,
                image: oldTransaction?.image
            })
        }
    },[])
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        try{
            setLoading(true);
            const { type, amount, description, category, date, walletId, image  } = transaction;
            if(!walletId || !date || !amount || (type === 'expense' && !category)){
                Alert.alert('Transaction','Fill all the fields')
            }
    
            let transactionData: TransactionType = {
                type,
                amount,
                description,
                category,
                date,
                walletId,
                image: image ? image: null,
                uid: user?.uid
            };
            if(oldTransaction?.id) transactionData.id = oldTransaction?.id;
            
            const res = await createOrUpdateTransaction(transactionData);
            if(res.success){
                router.back();
            }else{
                Alert.alert('Transaction', res.msg)
                console.log('Transaction failed 2',res.msg)
            }
        }catch(err){
            console.log('Transaction Error failed: ',err);
        }finally{
            setLoading(false);
        }
        


    };

    const onDelete = async () => {
        if(!oldTransaction?.id) return;
        setLoading(true);
        const res = await deleteTransaction(oldTransaction?.id,oldTransaction?.walletId);
        setLoading(false);

        if(res.success){
            router.back();
        }else{
            Alert.alert("Transaction",res.msg)
        }
    }

    const deleteAlert = () => {
        Alert.alert(
            "Confirm",
            'Are you sure you want to delete ?',
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
    };

    const onDateChange = (event:any, selectedDate: any) => {
        const currentData = selectedDate || transaction.date;
        setTransaction({...transaction, date:currentData});
        setShowDatePicker(Platform.OS === 'ios' ? true : false)
    }

    return (
        <ModalWrapper>
            <View className='flex-1 px-4'>
                <Header
                    title={oldTransaction?.id ? 'Update Transaction' : 'Create Transaction'}
                />
                {/* form */}
                <ScrollView className='mt-5' showsVerticalScrollIndicator={false}>
                    <View className='gap-2 mt-2'>
                        <Text className='text-neutral-400'>Type</Text>
                        {/* dropdown manu */}
                        <Dropdown
                            style={styles.dropdown}
                            activeColor='black'
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={{color: 'white'}}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            data={transactionTypes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={transaction.type}
                            onChange={item => {
                                setTransaction({...transaction, type: item.value})
                            }}
                        />
                    </View>

                    <View className='gap-2 mt-2'>
                        <Text className='text-neutral-400'>Wallet</Text>
                        {/* dropdown manu */}
                        <Dropdown
                            style={styles.dropdown}
                            activeColor='black'
                            placeholderStyle={{color: 'white'}} 
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={{color: 'white'}}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            data={wallets.map((wallet) => ({
                                label: `${wallet?.name} (${wallet?.amount})`,
                                value: wallet?.id
                            }))}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={transaction.walletId}
                            onChange={item => {
                                setTransaction({...transaction, walletId: item.value})
                            }}
                        />
                    </View>

                    {transaction.type === 'expense' && (
                        <View className='gap-2 mt-2'>
                            <Text className='text-neutral-400'>Expense Category</Text>
                            {/* dropdown manu */}
                            <Dropdown
                                style={styles.dropdown}
                                activeColor='black'
                                placeholderStyle={{color: 'white'}} 
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={{color: 'white'}}
                                itemContainerStyle={styles.dropdownItemContainer}
                                containerStyle={styles.dropdownListContainer}
                                data={Object.values(expenseCategories)}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder='Select Category'
                                value={transaction.category}
                                onChange={item => {
                                    setTransaction({...transaction, category: item.value})
                                }}
                            />
                        </View>
                    )}

                    {/* Date picker */}
                    <View className='gap-2 mt-2'>
                        <Text className='text-neutral-400'>Date</Text>
                        {!showDatePicker && (
                            <TouchableOpacity
                                activeOpacity={0.86}
                                className='border-2 border-neutral-200 rounded-md px-2 py-2.5'
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text className='text-xl text-white font-semibold'>
                                    {(transaction.date).toLocaleString()}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {showDatePicker && (
                            <View>
                                <DateTimePicker
                                    onChange={onDateChange}
                                    value={transaction.date as Date}
                                    mode='date'
                                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity
                                    onPress={() => setShowDatePicker(false)}
                                    activeOpacity={0.878}
                                    >
                                        <Text className='uppercase text-xl font-semibold'>Ok</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    {/* amount */}
                    <View className='gap-2 mt-2'>
                        <Text className='text-neutral-400'>Wallet Name</Text>
                        <Input
                            keyboardType='numeric'
                            value={transaction.amount.toString()}
                            onChangeText={(value) => setTransaction({...transaction, amount: Number(value.replace(/[^0-9]/g,""))})}
                        />
                    </View>

                    <View className='gap-2 mt-5'>
                        <Text className='text-neutral-400'>Wallet Icon</Text>
                        {/* Image picker */}
                        <ImageUpload
                            file={transaction.image}
                            onClear={() => setTransaction({...transaction, image: null})}
                            onSelect={(file) => setTransaction({...transaction, image: file})}
                            placeholder='Upload Image'
                        />
                    </View>
                </ScrollView>
            </View>
            
            <View className='flex-row items-center justify-between mb-5 gap-2 px-5 pt-2'>
                {oldTransaction?.id && !loading && (
                    <TouchableOpacity className='bg-red-600 py-4 px-5 rounded-md' onPress={deleteAlert} activeOpacity={0.75}>
                        <Right name='trash' color={'white'} size={28} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} className='px-10 py-4 rounded-md bg-[#a3e635]'>
                    <Text className='text-xl text-center font-bold text-black'>
                        {oldTransaction?.id ? 'Update' : 'Create'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ModalWrapper>
    )
}

export default TransactionModal

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'white',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        borderCurve: 'continuous'
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'white'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'white'
    },
    iconStyle: {
        width: 20,
        height: 20,
        tintColor: 'white'
    },
    dropdownItemContainer: {
        borderRadius: 15,
        marginHorizontal: 7
    },
    dropdownListContainer: {
        backgroundColor: 'black', 
        borderRadius: 8,
        borderCurve:'continuous',
        top: 5,
        paddingVertical: 5,
        borderColor: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    }
})