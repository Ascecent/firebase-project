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
import {
    createSpinnerLoader
} from './utils'

const dotLoader = createSpinnerLoader('dot-loader')

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
                        feedbackMessage: 'Enter a valid email address'
                    }, {
                        id: 'loginPassword',
                        validation: 'notEmpty',
                        feedbackMessage: 'The password is required',
                    }],
                })

                validation.init()

                document.getElementById(formId).addEventListener('submit', function (e) {
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

                    const data = new FormData(this)
                    emailSignIn(data)
                })

                document.getElementById('google-auth').addEventListener('click', googleSignIn)
                document.getElementById('facebook-auth').addEventListener('click', facebookSignIn)
            }
        },
        {
            namespace: 'signup',
            beforeEnter() {
                const formId = 'signup-form'
                const validation = Validation({
                    formId: formId,
                    formControls: 'form-control',
                    DOMItems: [{
                        id: 'signUpFullName',
                        validation: 'text',
                        feedbackMessage: 'Only words are allowed'
                    }, {
                        id: 'signUpPhone',
                        validation: 'numbers',
                        feedbackMessage: 'Only numbers are allowed',
                    }, {
                        id: 'signUpGender',
                        feedbackMessage: 'Select a valid gender',
                        customValidation: target => ['male', 'female'].includes(target.value)
                    }, {
                        id: 'signUpEmail',
                        validation: 'email',
                        feedbackMessage: 'Enter a valid email address',
                    }, {
                        id: 'signUpPassword',
                        validation: 'notEmpty',
                        feedbackMessage: 'Enter a valid password',
                    }],
                })

                validation.init()

            }
        }
    ],
    transitions: [{
        name: 'cover',
        to: {
            namespace: ['login', 'signup', 'dashboard']
        },
        enter() {},
        leave() {}
    }]
})
