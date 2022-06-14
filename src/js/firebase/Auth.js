import {
    initializeApp
} from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from "firebase/auth"
import config from './config'
import Swal from 'sweetalert2'

const app = initializeApp(config),
    auth = getAuth()

export const emailSignIn = data => {
    signInWithEmailAndPassword(auth, data.get('loginEmail'), data.get('loginPassword'))
        .then(userCredential => {
            Swal.fire({
                title: 'Success authentication',
                text: 'You have successfully signed in with email and password, now you will be redirected to the home page.',
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#2ecc71',
                timer: 2000,
                timerProgressBar: true,
            })

            setTimeout(() => window.location.href = 'dashboard.html', 2000)
        })
        .catch(error => {
            console.error(error.message)
            Swal.fire({
                title: 'Something went wrong',
                text: 'Something went wrong with your credentials, please try again with valid credentials.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })
        });
}

export const googleSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
        .then(result => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            const user = result.user

            if (token && user) {
                Swal.fire({
                    title: 'Success Google Login',
                    text: 'You have successfully login with Google, now you will be redirected to the home page.',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#2ecc71',
                    timer: 2000,
                    timerProgressBar: true,
                })

                setTimeout(() => window.location.href = 'dashboard.html', 2000)
            }
        }).catch(error => {
            console.error(error)
            const errorCode = error.code
            const errorMessage = error.message
            const email = error.email
            const credential = GoogleAuthProvider.credentialFromError(error)
        });
}

export const facebookSignIn = () => {
    signInWithPopup(auth, new FacebookAuthProvider())
        .then(result => {
            const user = result.user
            const credential = FacebookAuthProvider.credentialFromResult(result)
            const accessToken = credential.accessToken

            if (accessToken && user) {
                Swal.fire({
                    title: 'Success Facebook Login',
                    text: 'You have successfully login with Facebook, now you will be redirected to the home page.',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#2ecc71',
                    timer: 2000,
                    timerProgressBar: true,
                })

                setTimeout(() => window.location.href = './../home.html', 2000)
            }
        })
        .catch(error => {
            console.error(error)
            const errorCode = error.code
            const errorMessage = error.message
            const email = error.email
            const credential = FacebookAuthProvider.credentialFromError(error)
        });
}
