import Swal from "sweetalert2"
import {
    createSpinnerLoader,
    previewImage
} from "./utils"

export default function SignUp(authentication, firestore) {
    const dotLoader = createSpinnerLoader('dot-loader'),
        validation = Validation({
            formId: 'signup-form',
            formControls: 'form-control',
            DOMItems: [{
                id: 'signUpPhoto',
                feedbackMessage: '',
                customValidation: target => {
                    const {
                        url,
                        validation
                    } = previewImage(target)

                    console.log(url)
                    console.log(validation)

                    return validation
                }
            }, {
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

    document.getElementById('image-input').addEventListener('click', () => {
        console.log('Image fake container')
        document.getElementById('signUpPhoto').click()
    })

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
        authentication.createUser(data.signUpEmail, data.signUpPassword).then(res => {
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
                    firestore.addData('users', {
                        'auth-id': res.uid,
                        'name': data.signUpFullName,
                        'gender': data.signUpGender,
                        'phone': data.signUpPhone,
                        'userType': 'client'
                    })

                    swalConfig.title = 'Successfully signed up'
                    swalConfig.text = 'You have successfully signed up, now you will be redirected to the login page'
                    validation.getFormDOMReference().reset()

                    setTimeout(() => {
                        window.location = 'index.html'
                    }, 1500)

                } else {
                    swalConfig.title = 'Oh no! Something bad happened'
                    swalConfig.text = res.msj
                }

                Swal.fire(swalConfig)
            }, 500)
        }).catch(err => console.error(err))
    })
}
