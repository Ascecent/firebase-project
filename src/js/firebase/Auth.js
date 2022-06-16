import {
    getAuth,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import app from './config'

const generateResponse = () => {
    return {
        success: false,
        msj: '',
        user: null,
        uid: null,
    }
}

const errors = {
    'auth/email-already-in-use': 'Email already in use',
    'auth/invalid-email': 'Email is invalid',
    'auth/popup-closed-by-user': 'Form has been compromised',
    'auth/popup-closed-by-user': 'The popup has been closed by user',
    'auth/weak-password': 'The password entered is weak',
    'auth/wrong-password': 'Incorrect email and/or password',
    'auth/user-not-found': 'Incorrect email and/or password',
    'auth/account-exists-with-different-credential': 'The account already exists with different credential',
    getError: function (code) {
        return this[code] || code
    }
}

export default function Authentication() {
    const auth = getAuth(app)

    const saveUserDataInLocalStorage = uid => {
        localStorage.setItem('user-auth', uid)
    }

    async function createUser(email, password) {
        const res = generateResponse()

        await createUserWithEmailAndPassword(auth, email, password)
            .then(userData => {
                res.success = true
                res.uid = userData.user.uid
            })
            .catch(error => res.msj = errors.getError(error.code))

        return res;
    }

    async function signInUser(email, password) {
        const res = generateResponse()

        await signInWithEmailAndPassword(auth, email, password)
            .then(userData => {
                const uid = userData.user.uid
                res.success = true
                res.uid = uid
                saveUserDataInLocalStorage(uid)
            })
            .catch(error => res.msj = errors.getError(error.code));

        return res;
    }

    async function signInAPI(service) {
        const res = generateResponse();
        let provider = null;

        switch (service) {
            case 'google':
                provider = new GoogleAuthProvider()
                break
            case 'facebook':
                provider = new FacebookAuthProvider()
                break
            default:
                res.msj = 'Service provider not supported'
        }

        if (provider != null)
            await signInWithPopup(auth, provider)
            .then(userData => {
                const {
                    user: {
                        email,
                        photoURL,
                        displayName,
                        uid
                    }
                } = userData

                res.success = true;
                res.user = {
                    email,
                    photoURL,
                    displayName,
                    uid
                };
                res.uid = uid
                saveUserDataInLocalStorage(uid)
            })
            .catch(error => res.msj = errors.getError(error.code))

        return res
    }

    function logout() {
        signOut(auth)
    }

    return ({
        logout,
        signInAPI,
        signInUser,
        createUser
    })
}
