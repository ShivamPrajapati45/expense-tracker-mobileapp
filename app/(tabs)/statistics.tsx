import { ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { BarChart } from 'react-native-gifted-charts';
import { useAuth } from '@/context/AuthContext'

const barData = [
    {
        value: 40,
        label: 'Mon',
        spacing: 4,
        labelWidth: 30,
        frontColor: 'red'
    },
    {
        value: 25,
        label: 'Tues',
        spacing: 4,
        labelWidth: 30,
        frontColor: 'green'
    },
]

const Statistics = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartData, setChartData] = useState(barData)
    const [chartLoading, setChartLoading] = useState(false);
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

    }

    const getMonthlyStats = async () => {

    }

    const getYearlyStats = async () => {

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

                        {
                            chartLoading && (
                                <View className='absolute w-full h-full rounded-md bg-black'>
                                    <Text className='animate-pulse duration-200 transition-all text-white
                                    '>Loading...</Text>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>

            </View>
        </ScreenWrapper>
    )
}

export default Statistics
