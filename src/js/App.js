import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"
import {
    Validation
} from "./Validations"
import auth from "./firebase/Auth"
import Swal from 'sweetalert2'
import {
    createSpinnerLoader
} from './utils'
import {
    addUser
} from "./firebase/Firestore"

const dotLoader = createSpinnerLoader('dot-loader')

barba.use(barbaCss)
barba.init({
    views: [{
            namespace: 'login',
            beforeEnter() {
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

                    auth.emailSignIn(validation.serializeInputs())
                })

                document.getElementById('google-auth').addEventListener('click', auth.googleSignIn)
                document.getElementById('facebook-auth').addEventListener('click', auth.facebookSignIn)
            }
        },
        {
            namespace: 'signup',
            beforeEnter() {
                const validation = Validation({
                    formId: 'signup-form',
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
                    const uid = auth.createUser(data.signUpEmail, data.signUpPassword)
                    console.log(uid)

                    addUser({
                        'auth-id': uid,
                        'name': data.signUpFullName,
                        'gender': data.signUpGender,
                        'phone': data.signUpPhone
                    })
                })
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
