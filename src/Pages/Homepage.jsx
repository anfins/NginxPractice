
import { useAuth } from "../Providers/AuthProvider";
import {firestore } from "../Services/Firebase";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    setDoc,
    addDoc,
    query as queryDB,
    onSnapshot,
    arrayUnion,
    arrayRemove,
    where,
    orderBy,
    deleteField,
    startAfter,
    endBefore,
    limit,
    serverTimestamp,
    getCountFromServer,
    documentId,
    increment,
  } from "@firebase/firestore";


const Homepage = () => {
    const auth = useAuth();
    console.log(auth);

    return (
        <div>
            <h1>Homepage</h1>
        </div>
    )
}

export default Homepage;