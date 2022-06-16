import Validation from "./Validation"
import Swal from "sweetalert2"
import {
    createSpinnerLoader
} from "./utils"

const dotLoader = createSpinnerLoader('dot-loader'),
    handleRes = res => {
        setTimeout(() => {
            dotLoader.remove()
            const swalConfig = {
                title: '',
                text: '',
                timer: 1500,
                icon: res.success ? 'success' : 'error',
                timerProgressBar: true,
                confirmButtonColor: res.success ? '#2ecc71' : '#e74c3c',
                confirmButtonText: 'Got it'
            }

            if (res.success) {
                setTimeout(() => {
                    window.location = './dashboard.html'
                }, 1500)

                swalConfig.title = 'Success login'
                swalConfig.text = 'You have successfully authenticated, now you will be redirected to the home page'
            } else {
                swalConfig.title = 'Oh no!, Something is wrong'
                swalConfig.text = res.msj
            }
        }, 500)
    }

export default function Login(authentication) {
    authentication.logout()

    if (localStorage.getItem('user-auth')) {
        localStorage.removeItem('user-auth')
    }

    const validation = Validation({
        formId: 'login-form',
        formControls: 'form-control',
        DOMItems: [{
            id: 'loginEmail',
            validation: 'email',
            feedbackMessage: 'Enter a valid email address'
        }, {
            id: 'loginPassword',
            validation: 'notEmpty',
            feedbackMessage: 'The password is required',
        }],
    })

    validation.init()

    document.getElementById(validation.getFormId()).addEventListener('submit', function (e) {
        document.body.appendChild(dotLoader)
        e.preventDefault()

        if (!validation.getValidityState()) {
            Swal.fire({
                title: 'Invalid form',
                text: 'It seems that the form has been compromised, please refresh the page and try again.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })

            return
        }

        const data = validation.serializeInputs()

        authentication.signInUser(data['loginEmail'], data['loginPassword'])
            .then(res => {
                handleRes(res)
            }).catch(err => console.error(err))
    })

    const signInWithProvider = function (e) {
        document.body.appendChild(dotLoader)
        const provider = e.target.getAttribute('data-provider')
        if (!provider) return

        authentication.signInAPI(provider)
            .then(res => {
                handleRes
            })
            .catch(err => console.error(err))
    }

    document.getElementById('google-auth').addEventListener('click', signInWithProvider)
    document.getElementById('facebook-auth').addEventListener('click', signInWithProvider)
}
