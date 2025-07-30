import { Alert, ScrollView, Text, View } from 'react-native'
import { useEffect, useState } from 'react'

import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { BarChart } from 'react-native-gifted-charts';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/trasactionService';
import TransactionList from '@/components/TransactionList';


const Statistics = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { user} = useAuth();

    useEffect(() => {
        if(activeIndex === 0){
            getWeeklyStats();
        }
        if(activeIndex === 1){
            getMonthlyStats();
        }
        if(activeIndex === 2){
            getYearlyStats();
        }
    },[activeIndex]);

    const getWeeklyStats = async () => {
        try{
            setChartLoading(true);
            let res = await fetchWeeklyStats(user?.uid as string);
            if(res.success){
                setChartData(res?.data?.stats);
                setTransactions(res?.data?.transactions)
            }else{
                Alert.alert("Weekly Stats Chart: ", res.msg);
            }

        }catch(err){
            console.log('Weekly stats: ',err)
        }finally{
            setChartLoading(false)
        }
    }

    const getMonthlyStats = async () => {
        try{
            setChartLoading(true);
            let res = await fetchMonthlyStats(user?.uid as string);
            if(res.success){
                setChartData(res?.data?.stats);
                setTransactions(res?.data?.transactions)
            }else{
                Alert.alert("Weekly Stats Chart: ", res.msg);
            }

        }catch(err){
            console.log('Weekly stats: ',err)
        }finally{
            setChartLoading(false)
        }
    };

    const getYearlyStats = async () => {
        try{
            setChartLoading(true);
            let res = await fetchYearlyStats(user?.uid as string);
            if(res.success){
                setChartData(res?.data?.stats);
                setTransactions(res?.data?.transactions)
            }else{
                Alert.alert("Weekly Stats Chart: ", res.msg);
            }

        }catch(err){
            console.log('Weekly stats: ',err)
        }finally{
            setChartLoading(false)
        }
    }

    return (
        <ScreenWrapper>
            <View className='px-4 py-1 gap-2'>
                <View className=''>
                    <Header title='Statistics' />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className='gap-4 pt-1 pb-20'
                >
                    <SegmentedControl
                        values={['Weekly', 'Monthly', 'Yearly']}
                        selectedIndex={activeIndex}
                        onChange={(event) => {
                            setActiveIndex(event.nativeEvent.selectedSegmentIndex)
                        }}
                        activeFontStyle={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                        style={{height: 37}}
                        appearance='dark'
                    />
                    <View className='relative justify-center items-center'>
                        {chartData.length > 0 ? (
                            <BarChart 
                                data={chartData} 
                                roundedTop
                                barWidth={20}
                                spacing={[1,2].includes(activeIndex) ? 25 : 16}
                                hideRules
                                yAxisLabelPrefix='$'
                                yAxisThickness={0}
                                xAxisThickness={0}
                                yAxisLabelWidth={[1,2].includes(activeIndex) ? 38 : 35}
                                yAxisTextStyle={{color:'white'}}
                                xAxisLabelTextStyle={{
                                    color:'white',
                                    fontSize:12
                                }}
                                noOfSections={3}
                                minHeight={5}

                            />
                        ) : (
                            <View>

                            </View>
                        )}

                        {chartLoading && (
                                <View className='absolute w-full h-full rounded-md bg-black'>
                                    <Text className='animate-pulse duration-200 transition-all text-white
                                    '>Loading...</Text>
                                </View>
                            )}
                    </View>

                    {/* transactions */}
                    <View>
                        <TransactionList
                            title='Transactions'
                            emptyListMessage='No Transaction Found'
                            data={transactions }
                        />
                    </View>
                </ScrollView>

            </View>
        </ScreenWrapper>
    )
}

export default Statistics
