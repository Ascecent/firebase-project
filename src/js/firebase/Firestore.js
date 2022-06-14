import {
    app
} from './config'
import {
    getFirestore,
    collection,
    addDoc
} from "firebase/firestore"
const firestore = getFirestore(app),
    users = collection(firestore, 'users')

export async function addUser(user) {
    try {
        const docRef = await addDoc(users, user)
        console.log(`Document written to ID: ${docRef.id}`)
    } catch (error) {
        console.error(error)
    }
}
