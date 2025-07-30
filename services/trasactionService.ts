import { fireStore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/utils/types";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "@firebase/firestore";
import { uploadFileOnCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
):Promise<ResponseType> => {
    try{
        const { id, type, walletId, amount, image } = transactionData;
        if(!amount || amount <= 0 || !walletId || !type){
            return { success: false, msg: 'All fields are required!' }
        };

        if(id){
            // todo: update existing transactionx
            const oldTransactionSnapShot = await getDoc(
                doc(fireStore, "transactions", id)
            );
            const oldTransaction = oldTransactionSnapShot.data() as TransactionType;
            const shouldRevertOriginal = 
                oldTransaction.type !== type ||
                oldTransaction.amount !== amount ||
                oldTransaction.walletId !== walletId;
                if(shouldRevertOriginal){
                    let res =  await revertAndUpdateWallets(
                        oldTransaction, 
                        Number(amount), 
                        type, 
                        walletId
                    );
                    if(res.success) return res;
                } 
        }else{
            // update wallet for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!,
                Number(amount!),
                type
            );
            if(!res?.success) return res;
        };

        if(image){
            const imageUploadRes = await uploadFileOnCloudinary(
                image,
                'transactions'
            );
            if(!imageUploadRes?.success){
                return {
                    success: false,
                    msg: imageUploadRes?.msg || 'failed to upload image'
                }
            };

            transactionData.image = imageUploadRes.data;
        };

        const transactionRef = id
            ? doc(fireStore, "transactions", id)
            : doc(collection(fireStore, "transactions"));

        await setDoc(transactionRef, transactionData, { merge: true });

        return {
            success: true,
            data: { ...transactionData, id: transactionRef?.id }
        }

    }catch(err){
        console.log('Error create or Update transaction: ',err);
        return {
            success: false
        }
    }
};

export const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string
) => {
    try{
        const walletRef = doc(fireStore, 'wallets', walletId);
        const walletSnapShot = await getDoc(walletRef);
        if(!walletSnapShot.exists()){
            console.log('Error Update transaction for new transaction');
            return { success: false, msg: 'Wallet not found' }
        }

        const walletData = walletSnapShot.data() as WalletType;

        if(type === 'expense' && walletData.amount! - amount < 0){
            return { success: false, msg: 'Selected wallet do not have enough balance' }
        }

        const updateType = type === 'income' ? 'totalIncome' : 'totalExpenses';
        const updatedWalletAmount = 
            type === 'income'
            ? Number(walletData.amount) + amount
            : Number(walletData.amount) - amount;

        const updatedTotals = 
            type === 'income'
            ? Number(walletData.totalIncome) + amount
            : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        });

        return {
            success: true,
            msg: 'Transaction Updated Successfully !'
        }

    }catch(err){
        console.log('Error Update transaction: ',err);
        return {
            success: false
        }
    }
};

//done
export const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try{

        const originalWalletSnapShot = await getDoc(
            doc(fireStore, 'wallets', oldTransaction?.walletId)
        );
        const originalWallet = originalWalletSnapShot.data() as WalletType;

        let newWalletSnapShot = await getDoc(doc(fireStore, 'wallets', newWalletId));
        let newWallet = newWalletSnapShot.data() as WalletType;

        const revertType = oldTransaction.type === 'income' ? 'totalIncome' : 'totalExpenses';

        const revertIncomeExpense: number = 
            oldTransaction.type === 'income'
            ? -Number(oldTransaction.amount)
            : Number(oldTransaction.amount);

        const revertedWalletAmount = 
            Number(originalWallet.amount) + revertIncomeExpense;

        const revertedIncomeExpenseAmount = 
            Number(originalWallet[revertType]) - Number(oldTransaction.amount);

        if(newTransactionType === 'expense'){
            // if user tries to convert income to expense on the same wallet
            // or if the user tries to increase the expense amount and don't have enough balance

            if(oldTransaction?.walletId == newWalletId && 
                revertedWalletAmount < newTransactionAmount){
                return {
                    success: false,
                    msg: "The selected wallet don't have enough balance "
                };
            }

            // if user tries to add expense from a new wallet but the wallet don't have enough balance
            
            if(newWallet.amount! < newTransactionAmount){
                return {
                    success: false,
                    msg: "The selected wallet don't have enough balance "
                };
            }
        };

        await createOrUpdateWallet({
            id: oldTransaction?.walletId,
            amount: revertedWalletAmount,
            [revertType]: revertedIncomeExpenseAmount
        });

        // revert completed

        ////////////////////////

        // refetch the newWallet becoz we may have just updated it
        newWalletSnapShot = await getDoc(doc(fireStore, 'wallets', newWalletId));
        newWallet = newWalletSnapShot.data() as WalletType;

        const updateType = 
            newTransactionType === 'income' ? 'totalIncome' : 'totalExpenses';

        const updateTransactionAmount: number = 
            newTransactionType === 'income'
            ? Number(newTransactionAmount)
            : -Number(newTransactionAmount);

        const newWalletAmount = 
            Number(newWallet.amount) + updateTransactionAmount;

        const newIncomeExpenseAmount = 
            Number(newWallet[updateType]! + Number(newTransactionAmount));

        await createOrUpdateWallet({
            id: newWalletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });
        

        return {
            success: true,
            msg: 'Transaction Updated Successfully !'
        }

    }catch(err:any){
        console.log('Error Update transaction: ',err);
        return {
            success: false
        }
    }
};

export const deleteTransaction = async (
    transactionId: string,
    walletId: string
):Promise<ResponseType> => {
    try{

        const transactionRef = doc(fireStore, 'transactions', transactionId)

        const transactionSnapShot = await getDoc(transactionRef);

        if(!transactionSnapShot.exists()){
            return { success: false,msg: 'Transaction Not Found' }
        }
        const transactionData = transactionSnapShot.data() as TransactionType;

        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;

        // fetch wallet to update amount, totalIncome or total Expenses
        const newWalletSnapShot = await getDoc(doc(fireStore, 'wallets', walletId));
        const walletData = newWalletSnapShot.data() as WalletType;

        // check fields to be updated based on transaction type
        const updateType = 
            transactionType === 'income' ? 'totalIncome' : 'totalExpenses';

        const newWalletAmount = 
            walletData?.amount! -
            (transactionType === 'income'
                ? transactionAmount
                : -transactionAmount
            );

        const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

        if(transactionType === 'expense' && newWalletAmount < 0){
            return { success:false, msg: 'you cannot delete this transaction' }
        }

        await createOrUpdateWallet({
            id: walletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });

        await deleteDoc(transactionRef)


        return { success: true }
    }catch(err:any){
        console.log('Error Update transaction: ',err);
        return { success: false}
    }
};

const getLast7Days = () => {
    const daysWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const result = [];

    for(let i = 0;i >= 0;i--){
        const date = new Date();
        date.setDate(date.getDate() - i);
        result.push({
            day: daysWeek[date.getDay()],
            date: date.toISOString().split('T')[0],
            income: 0,
            expense: 0
        })
    }
    return result.reverse();
}

export const fetchWeeklyStats = async (
    uid: string,
):Promise<ResponseType> => {
    try{

        const db = fireStore;
        const today = new Date();
        const savenDaysAgo = new Date(today);
        savenDaysAgo.setDate(today.getDate() - 7);

        const transactionQuery = query(
            collection(db, 'transactions'),
            where('date', ">=", Timestamp.fromDate(savenDaysAgo)),
            where('date', "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapShot = await getDocs(transactionQuery);
        const weeklyData = getLast7Days();
        const transactions: TransactionType[] = [];

        querySnapShot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp)
                .toDate()
                .toISOString()
                .split("T")[0]

            const dayData = weeklyData.find((day) => day.date == transactionDate);

            if(dayData){
                if(transaction.type === 'income'){
                    dayData.income += transaction.amount;
                }else if(transaction.type === 'expense'){
                    dayData.expense += transaction.amount
                }
            }
        });

        // takes each day and creates two entries in an array
        const stats = weeklyData.flatMap((day) => [
            {
                value: day.income,
                label: day.day,
                spacing: 4,
                labelWidth: 30,
                frontColor: 'green'
            },
            {
                value: day.expense,
                frontColor: 'red'
            }
        ]);


        return { 
            success: true ,
            data: {
                stats,
                transactions
            }
        }
    }catch(err:any){
        console.log('Error Update transaction: ',err);
        return { success: false}
    }
};

const getLast12Months = () => {
    const monthsOfYear =[
        'Jan',
        'Feb',
        'Mar',
        "Apr",
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const result = [];

    for(let i = 11; i >= 0; i--){
        const date = new Date();
        date.setMonth(date.getMonth() - i);

        const monthName = monthsOfYear[date.getMonth()];
        const shortYear = date.getFullYear().toString().slice(-2);
        const formattedMonthYear = `${monthName} ${shortYear}`; // Jan 24, May 25
        const formattedDate = date.toISOString().split("T")[0];

        result.push({
            month: formattedMonthYear,
            fullDate: formattedDate,
            income: 0,
            expense: 0
        })
    };

    return result.reverse();
}

const getYearsRange = (startYear: number, endYear: number):any => {
    const result = [];
    for(let year = startYear; year <= endYear; year++){
        result.push({
            year: year.toString(),
            fullDate: `01-01-${year}`,
            income: 0,
            expense: 0
        })
    }

    return result.reverse();
}

export const fetchYearlyStats = async (
    uid: string,
):Promise<ResponseType> => {
    try{

        const db = fireStore;

        // define query to fetch transactions in the last 12 months
        const transactionQuery = query(
            collection(db, 'transactions'),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapShot = await getDocs(transactionQuery);
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapShot.docs.reduce((earliest, doc) => {
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate : earliest
        }, new Date());

        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear, currentYear)

        querySnapShot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id; // Include document id in transaction data
            transactions.push(transaction);

            const transactionYear = (transaction.date as Timestamp).toDate().getFullYear();

            const yearData = yearlyData.find((item:any) => item.year === transactionYear.toString());

            if(yearData){
                if(transaction.type === 'income'){
                    yearData.income += transaction.amount;
                }else if(transaction.type === 'expense'){
                    yearData.expense += transaction.amount
                }
            }
        });

        // takes each day and creates two entries in an array
        const stats = yearlyData.flatMap((year:any) => [
            {
                value: year.income,
                label: year.month,
                spacing: 4,
                labelWidth: 35,
                frontColor: 'green'
            },
            {
                value: year.expense,
                frontColor: 'red'
            }
        ]);


        return { 
            success: true ,
            data: {
                stats,
                transactions
            }
        }
    }catch(err:any){
        console.log('Error Update transaction: ',err);
        return { success: false}
    }
};

export const fetchMonthlyStats = async (
    uid: string,
):Promise<ResponseType> => {
    try{

        const db = fireStore;
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        // define query to fetch transactions in the last 12 months
        const transactionQuery = query(
            collection(db, 'transactions'),
            where('date', ">=", Timestamp.fromDate(twelveMonthsAgo)),
            where('date', "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapShot = await getDocs(transactionQuery);
        const monthlyData = getLast12Months();
        const transactions: TransactionType[] = [];

        querySnapShot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp).toDate()
            const monthName = transactionDate.toLocaleString('default', {
                month: 'short'
            });
            const shortYear = transactionDate.getFullYear().toString().slice(-2);
            const monthData = monthlyData.find((month) => month.month === `${monthName} ${shortYear}`);

            if(monthData){
                if(transaction.type === 'income'){
                    monthData.income += transaction.amount;
                }else if(transaction.type === 'expense'){
                    monthData.expense += transaction.amount
                }
            }
        });

        // takes each day and creates two entries in an array
        const stats = monthlyData.flatMap((month) => [
            {
                value: month.income,
                label: month.month,
                spacing: 4,
                labelWidth: 46,
                frontColor: 'green'
            },
            {
                value: month.expense,
                frontColor: 'red'
            }
        ]);


        return { 
            success: true ,
            data: {
                stats,
                transactions
            }
        }
    }catch(err:any){
        console.log('Error Update transaction: ',err);
        return { success: false}
    }
};


