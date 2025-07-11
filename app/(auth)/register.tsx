import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Fontisto'




const Register = () => {
    const name = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const {register} = useAuth();
    
    const handleSubmit = async () => {
        setIsLoading(true)

        if(!name.current || !passwordRef.current || !emailRef.current){
            Alert.alert('Please fill all the fields')
        };

        try{
            const res = await register(emailRef.current, passwordRef.current, name.current);
            if(res.success){
                name.current = ''
                emailRef.current = ''
                passwordRef.current = ''
                Toast.show({
                    type: 'success',
                    text1:'Thank You',
                    text2: 'Account Created Successfully !'
                })
            }else{
                Toast.show({
                    type: 'error',
                    text1: res.msg || 'Something went wrong'
                });
            }

            
        }catch(err){
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'An unexpected error occurred'
            });
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <ScreenWrapper>
            <View className='flex-1 gap-10 px-6'>
                <BackButton/>
                <Animated.View entering={FadeInDown.duration(1000).springify().damping(20)} className='gap-2 mt-5'>
                    <Text className='text-white font-semibold text-4xl'>Hey,</Text>
                    <Text className='text-white font-semibold text-3xl'>Create Your Account</Text>
                </Animated.View>
                <View className='gap-5 justify-center'>
                    <Input
                        placeholder='Enter Your Name'
                        onChangeText={(value) => (name.current = value)}
                        icon = {
                            <FeatherIcon name='user' color={'white'} size={16} />
                        }
                    />
                    <Input
                        placeholder='Enter Your Email'
                        onChangeText={(value) => (emailRef.current = value)}
                        icon = {
                            <Icon name='email' className='' color={'white'} size={16} />
                        }
                    />
                    <Input
                        placeholder='Enter Your Password'
                        secureTextEntry
                        onChangeText={(value) => (passwordRef.current = value)}
                        icon = {
                            <Icon name='locked' color={'white'} size={16} />
                        }
                    />
                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} className='bg-green-500 rounded-md py-3'>
                        <Text className='uppercase text-[#222222] text-center font-bold text-xl'>
                            {isLoading ? 'logging..' : 'Register'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* footer */}
                <View className='flex-row items-center justify-center gap-1'>
                    <Text className='text-sm text-white'>Already have an account ?</Text>
                    <Pressable onPress={() => router.navigate('/(auth)/login')} >
                        <Text className='text-sky-500 font-semibold'>Log In</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Register
