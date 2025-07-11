import { View, TouchableOpacity } from 'react-native';
import { Text } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/constants/theme';
import Icon from 'react-native-vector-icons/Entypo';
import Chart from 'react-native-vector-icons/FontAwesome6';


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {

    const tabberIcons: any = {
        index: (isFocused: boolean) => {
            return (
                <Icon 
                    name="home" 
                    size={30} 
                    color={isFocused ? colors.primary : colors.neutral400} 
                />
            )
        },
        statistics: (isFocused: boolean) => {
            return (
                <Chart 
                    name="chart-simple" 
                    size={30} 
                    color={isFocused ? colors.primary : colors.neutral400} 
                />
            )
        },
        wallet: (isFocused: boolean) => {
            return (
                <Icon 
                    name="wallet" 
                    size={30} 
                    color={isFocused ? colors.primary : colors.neutral400}   
                />
            )
        },
        profile: (isFocused: boolean) => {
            return (
                <Chart 
                    name="user" 
                    size={30} 
                    color={isFocused ? colors.primary : colors.neutral400}  
                />
            )
        },
    }
    
    return (
        <View className='flex-row border-t-[1.5px] border-t-neutral-800 w-full justify-around items-center bg-neutral-800 ios:h-20 android:h-20'>
        {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label: any =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
            };

            const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
            };

            return (
            <TouchableOpacity
                key={index}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                className='flex-1 items-center justify-center ios:mb-10'
            >
                {
                    tabberIcons[route.name] && tabberIcons[route.name](isFocused)
                }
            </TouchableOpacity>
            );
        })}
        </View>
    );
}

