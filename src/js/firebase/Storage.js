import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';
import app from './config'

const generateResponse = () => {
    return {
        success: false,
        msj: '',
        path: null
    }
}

//Storage:
export default function Storage() {
    const storage = getStorage(app);

    async function uploadFiles(url, file) {
        const res = generateResponse(),
            storageRef = ref(storage, url)

        await uploadBytes(storageRef, file)
            .then(snapshot => {
                res.success = true
                res.path = snapshot.metadata.fullPath
            })
            .catch(error => res.msj = error)

        return res
    }

    async function downloadFiles(url) {
        const res = generateResponse(),
            storageRef = ref(storage, url)

        await getDownloadURL(storageRef)
            .then(url => {
                res.success = true
                res.path = url
            })
            .catch(error => res.msj = error)

        return res;
    }

    return ({
        uploadFiles,
        downloadFiles
    })
}
