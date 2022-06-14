import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"
import {
    Validation
} from "./Validations"
import {
    emailSignIn,
    googleSignIn,
    facebookSignIn
} from "./firebase/Auth"
import Swal from 'sweetalert2'

barba.use(barbaCss)
barba.init({
    views: [{
        namespace: 'login',
        beforeEnter() {
            const formId = 'login-form'
            const validation = Validation({
                formId: formId,
                formControls: 'form-control',
                DOMItems: [{
                    id: 'loginEmail',
                    validation: 'email',
                    feedbackMessage: 'Enter an email with a valid format'
                }, {
                    id: 'loginPassword',
                    validation: 'notEmpty',
                    feedbackMessage: 'The password is required'
                }],
            })

            validation.init()

            document.getElementById(formId).addEventListener('submit', function (e) {
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

                const data = new FormData(this)
                emailSignIn(data)
            })

            document.getElementById('google-auth').addEventListener('click', googleSignIn)
            document.getElementById('facebook-auth').addEventListener('click', facebookSignIn)
        }
    }],
    transitions: [{
        name: 'cover',
        to: {
            namespace: ['login', 'signup', 'dashboard']
        },
        enter() {},
        leave() {}
    }]
})
