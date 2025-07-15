import { fireStore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/utils/types";
import { doc, updateDoc } from "@firebase/firestore";

export const updateUser = async (uid: string, updatedData: UserDataType):Promise<ResponseType> => {
    try{
        const userRef = doc(fireStore, "users", uid);
        await updateDoc(userRef, updatedData);

        return {
            success: true,
            msg: 'Successfully Updated'
        }

    }catch(err: any){
        console.log('Error Updating User: ', err)
        return {
            success: false,
            msg: err?.message
        }
    }
}