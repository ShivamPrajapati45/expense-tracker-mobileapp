import { ResponseType, WalletType } from "@/utils/types";
import { uploadFileOnCloudinary } from "./imageService";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "@firebase/firestore";
import { fireStore } from "@/config/firebase";

export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
):Promise<ResponseType> => {
    try {

        let walletToSave = {...walletData};

        // if image is there set to cloudinary
        if(walletData?.image){
            const imageUploadRes = await uploadFileOnCloudinary(
                walletData?.image,
                'wallets'
            );
            if(!imageUploadRes?.success){
                return {
                    success: false,
                    msg: imageUploadRes?.msg || 'failed to upload wallet'
                }
            };

            walletToSave.image = imageUploadRes.data;
        }

        // if this is new wallet, create new wallet
        if(!walletData?.id){
            // new wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
        };

        const walletRef = walletData?.id
            ? doc(fireStore, 'wallets', walletData?.id)
            : doc(collection(fireStore, 'wallets'));

        await setDoc(walletRef, walletToSave, {merge: true}); // updates only the data provided
        return {success: true, data: {...walletData, id:walletRef?.id}}
        
    } catch (error:any) {
        console.log('Error creating or updating wallet: ', error);
        return {
            success: false,
            msg: error?.message || 'Error creating or updating wallet'
        }
    }
};

export const deleteWallet = async (walletId:string):Promise<ResponseType> => {
    try{ 

        const walletRef = doc(fireStore, 'wallets',walletId);
        await deleteDoc(walletRef);

        // todo: delete all transactions of this wallet
        deleteTransactionByWalletId(walletId)
        return {
            success: true,
            msg: 'Wallet Deleted Successfully'
        }

    }catch(err:any){
        console.log('Error Deleting Wallet: ', err);
        return {
            success: false,
            msg: err?.msg
        }
    }
};

export const deleteTransactionByWalletId = async (walletId:string):Promise<ResponseType> => {
    try{ 

        let hasMoreTransactions = true;

        while(hasMoreTransactions){
            const transactionsQuery = query(
                collection(fireStore, 'transactions'),
                where('walletId', '==', walletId)
            );

            const transactionSnapShot = await getDocs(transactionsQuery);
            if(transactionSnapShot.size == 0){
                hasMoreTransactions = false;
                break;
            }

            const batch = writeBatch(fireStore);

            transactionSnapShot.forEach((transactionDoc) => {
                batch.delete(transactionDoc.ref)
            });

            await batch.commit();
        }

        // todo: delete all transactions of this wallet
        return {
            success: true,
            msg: 'All transactions Deleted Successfully'
        }

    }catch(err:any){
        console.log('Error Deleting Wallet: ', err);
        return {
            success: false,
            msg: err?.msg
        }
    }
};