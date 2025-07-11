import React, { createContext, useContext, useEffect, useState } from "react";
import {AuthContextType, UserType} from '@/utils/types'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import Toast from "react-native-toast-message";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider:React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();

    // This check if the user is already logged in
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    name: user?.displayName || null,
                    email: user?.email || null,
                    uid: user?.uid || undefined,
                    image: user?.photoURL || null
                })
                updateUserData(user?.uid);
                router.replace('/(tabs)');
            }else{
                setUser(null);
                router.replace('/(auth)/welcome');
            }
        })
        return () => unSubscribe();
    },[])

    const login = async (email: string, password: string) => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true, response}
        }catch(err:any){
            console.log('Err',err)
            let errMsg = 'Something went wrong. Please try again.';
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/user-not-found":
                        errMsg = "No account found with this email.";
                        break;
                    case "auth/wrong-password":
                        errMsg = "Incorrect password. Please try again.";
                        break;
                    case "auth/invalid-credential":
                        errMsg = "Invalid login credentials.";
                        break;
                    case "auth/invalid-email":
                        errMsg = "Please enter a valid email address.";
                        break;
                    default:
                        errMsg = err.message; // fallback if unknown
                }
            }
            return { success: false, msg: errMsg }
        }
    };

    const register = async (email: string,password: string,name: string) => {
        try{
            // create user in firebase Auth
            let response = await createUserWithEmailAndPassword(auth, email,password);

            // Save user data in fireStore
            await setDoc(doc(fireStore, "users", response?.user?.uid),{
                uid: response.user.uid,
                name,
                email,
                createdAt: new Date().toISOString()
            })

            return { success: true }
            
        }catch(err: any){
            let errMsg = 'Something went wrong. Please try again.';
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/email-already-in-use":
                        errMsg = "This email is already registered.";
                        break;
                    case "auth/invalid-email":
                        errMsg = "The email address is not valid.";
                        break;
                    case "auth/weak-password":
                        errMsg = "Password should be at least 6 characters.";
                        break;
                    case "auth/missing-password":
                        errMsg = "Please enter a password.";
                        break;
                    default:
                        errMsg = err.message; // fallback if unknown
                }
            }
            return { success: false, msg: errMsg }
        }
    }

    // this function fetching user data from fireStore and updating setUser state
    const updateUserData = async (uid:string) => {
        try{
            const docRef = doc(fireStore, 'users', uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const data = docSnap.data();
                const userData:UserType = {
                    uid: data?.uid,
                    email: data?.email || null,
                    name: data?.name || null,
                    image: data?.image || null,
                }
                setUser({...userData})
            }

        }catch(err: any){
            console.log('Error in Updating User Data: ', err)
        }
    }

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = ():AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be wrapped inside AuthProvider')
    }
    return context;
}