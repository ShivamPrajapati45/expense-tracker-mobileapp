import { fireStore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/utils/types";
import { doc, updateDoc } from "@firebase/firestore";
import { uploadFileOnCloudinary } from "./imageService";

export const updateUser = async (uid: string, updatedData: UserDataType):Promise<ResponseType> => {
    try{
        
        if(updatedData.image && updatedData?.image?.uri){
            const imageUploadRes = await uploadFileOnCloudinary(
                updatedData?.image,
                'users'
            );
            if(!imageUploadRes?.success){
                return {
                    success: false,
                    msg: imageUploadRes?.msg || 'failed to upload image'
                }
            };

            updatedData.image = imageUploadRes.data;
        };

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
};