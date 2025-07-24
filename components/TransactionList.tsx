import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps, TransactionListType } from '@/utils/types'
import {FlashList} from '@shopify/flash-list'
import { expenseCategories } from '@/constants/data';
import { Icon } from 'react-native-vector-icons/Icon';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage
}: TransactionListType) => {
    const handleClick = () => {

    }
    return (
        <View className='gap-3'>
            {title && (
                <Text className='text-white font-semibold text-xl'>
                    {title}
                </Text>
            )}

            <View className='min-h-10'>
                <FlashList
                    data={data}
                    renderItem={({item,index}) => (<TransactionItem item={item} index={index} handleClick={handleClick} />)}
                    estimatedItemSize={60}
                />
            </View>

            {!loading && data.length === 0 && (
                <Text className='text-white font-semibold text-lg text-center mt-2'>
                    {emptyListMessage}
                </Text>
            )}

            {loading && (
                <View className='items-center justify-center mt-20'>
                    <Text className='animate-pulse text-white font-semibold text-2xl'>loading...</Text>
                </View>
            )}

        </View>
    )
};

export const TransactionItem =({item,index,handleClick}:TransactionItemProps) => {
    let category = expenseCategories['rent'];
    console.log(category)
    return (
        <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(14)}>
            <TouchableOpacity onPress={() => handleClick(item)} activeOpacity={0.75} className='flex-row justify-between items-center mb-3 gap-3 bg-neutral-900 p-3 rounded-lg'>
                <View style={{backgroundColor: category?.bgColor}} className='p-1 rounded-md' >
                    {category?.icon && category?.icon}
                </View>
                <View className='flex-1 gap-1 justify-center'>
                    <Text className='text-neutral-300 text-lg font-semibold'>{category?.label}</Text>
                    {/* <Text>{category?.description}</Text> */}
                </View>

                <View className='gap-1 items-end justify-center'>
                    <Text className='text-green-500 font-bold text-xl'>+ $78</Text>
                    <Text className='text-neutral-300 text-sm'>12 jan</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TransactionList

const styles = StyleSheet.create({})