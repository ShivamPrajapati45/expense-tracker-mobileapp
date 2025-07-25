import { fireStore } from "@/config/firebase";
import { collection, onSnapshot, query, QueryConstraint } from "@firebase/firestore";
import { useEffect, useState } from "react";

const useFetchData = <T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
    
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!collectionName) return;
        const collectionRef = collection(fireStore, collectionName);
        const q = query(collectionRef, ...constraints);

        const unsub = onSnapshot(q,(snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    id: doc?.id,
                    ...doc.data()
                }
            }) as T[];
            setData(fetchedData);
            setLoading(false)
        },(err) => {
            console.log('Error Fetching Data: ', err);
            setError(err?.message);
            setLoading(false)
        });

        return () => unsub();
    },[]);

    return { data, error, loading }

};

export default useFetchData;