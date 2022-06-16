import app from './config'
import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from 'firebase/firestore'

const generateResponse = () => {
    return {
        success: false,
        msj: '',
        data: null
    }
}

const getMatches = (data, matches) => {
    const values = []

    const isMatch = (record, matches) => {
        for (const property in matches) {
            const match = matches[property]

            if (typeof match == 'object') isMatch(record, match)
            else if (record[property] != match) return false
        }
        return true
    }

    data.forEach((record) => {
        if (isMatch(record, matches)) values.push(record)
    })

    return values
}


export default function Firestore() {
    const db = getFirestore(app)

    async function getData(table, matches) {
        let res = generateResponse()

        await getDocs(
                collection(db, table)
            )
            .then(data => {
                res.success = true
                res.data = getMatches(data, matches)
            })
            .catch(error => res.msj = resForError(error.code))

        return res
    }


    async function addData(table, data) {
        const res = generateResponse()

        await addDoc(
                collection(db, table),
                data
            )
            .then(docRef => res.success = true)
            .catch(error => res.msj = resForError(error.code))

        return res
    }

    return ({
        getData,
        addData
    })
}
