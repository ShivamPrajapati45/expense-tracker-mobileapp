import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { getProfileImage } from '@/services/imageService'
import { accountOptionType } from '@/utils/types'
import Icon from 'react-native-vector-icons/FontAwesome6';
import Setting from 'react-native-vector-icons/Ionicons';
import Logout from 'react-native-vector-icons/MaterialIcons';
import Right from 'react-native-vector-icons/Feather';
import { colors } from '@/constants/theme'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'


const Profile = () => {

    const {user} = useAuth();
    const router = useRouter();
    const accountOptions: accountOptionType[] = [
        {
            title: 'Edit Profile',
            icon: <Icon name='user' color={'white'} size={20} />,
            routeName: '/(modals)/profileModal',
            bgColor: '#6366f1',
        },
        {
            title: 'Settings',
            icon: <Setting name='settings-sharp' className='' color={'white'} size={20} />,
            bgColor: '#059669',
        },
        {
            title: 'Privacy Policy',
            icon: <Icon name='lock' className='' color={'white'} size={20} />,
            // routeName: '/(modals)/profileModal',
            bgColor: colors.neutral800,
        },
        {
            title: 'Logout',
            icon: <Logout name='logout' className='' color={'white'} size={20} />,
            // routeName: '/(modals)/profileModal',
            bgColor: '#e11d48',
        },
    ];

    const handleLogout = async () => {
        await signOut(auth);
    }

    const showLogoutAlert = () => {
        Alert.alert('Confirm', 'Are you sure want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Logout'),
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: () => handleLogout(),
                style: 'destructive'
            },
        ])
    }

    const handlePress = (item: accountOptionType) => {
        if(item.title === 'Logout'){
            showLogoutAlert();
        }

        if(item.routeName) router.push(item.routeName);
    };

    return (
        <ScreenWrapper>
            {/* header */}
            <View className='flex-1 px-5'>
                <Header title='Profile' />

                {/* user info */}
                <View className='items-center mt-7 gap-3'>

                    {/* avatar */}
                    <View className='h-24 w-24 items-center rounded-full'>
                        <Image
                            source={getProfileImage(user?.image)}
                            className='items-center rounded-full w-full h-full'
                            resizeMode='cover'
                        />
                    </View>
                    {/* name & email */}
                    <View className='items-center'>
                        <Text className='text-2xl font-bold text-neutral-200'>
                            {user?.name}
                        </Text>
                        <Text className='text-sm font-semibold text-neutral-400'>
                            {user?.email}
                        </Text>
                    </View>
                </View>

                {/* account Options */}
                <View className='mt-8 gap-5'>
                    {accountOptions.map((item, index) => {
                        return (
                            <Animated.View 
                                key={index} 
                                className=''
                                entering={FadeInDown.delay(index * 50).springify().damping(12)}
                            >
                                <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8} className='flex-row bg-gray-100/10 rounded-md px-2 py-2 text-center items-center gap-4'>
                                    <View style={{
                                        backgroundColor: item?.bgColor
                                    }} className='items-center justify-center p-2 rounded-xl'>
                                        {item.icon && item.icon}
                                    </View>
                                    <Text className='font-semibold text-xl flex-1 text-white'>{item?.title}</Text>
                                    <Right name='chevron-right' color={'white'} size={28} />
                                </TouchableOpacity>
                            </Animated.View>
                        )
                    })}
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Profile
