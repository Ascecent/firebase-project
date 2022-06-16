import Swal from "sweetalert2"
import {
    createSpinnerLoader,
    previewImage
} from "./utils"
import Validation from "./Validation"

export default function SignUp(authentication, firestore, storage) {
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

                    document.getElementById('image-input').style.backgroundImage = `url(${url})`;
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
        document.getElementById('signUpPhoto').click()
    })

    document.getElementById(validation.getFormId()).addEventListener('submit', async function (e) {
        document.body.appendChild(dotLoader)
        e.preventDefault()

        if (!validation.getValidityState()) {
            dotLoader.remove()
            Swal.fire({
                title: 'Invalid form',
                text: 'It seems that the form has been compromised, please refresh the page and try again.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })

            return
        }

        const data = validation.serializeInputs(),
            {
                success,
                msj,
                uid
            } = await authentication.createUser(data.signUpEmail, data.signUpPassword)

        const swalConfig = {
            title: '',
            text: '',
            timer: 1500,
            icon: success ? 'success' : 'error',
            timerProgressBar: true,
            confirmButtonColor: success ? '#2ecc71' : '#e74c3c',
            confirmButtonText: 'Got it'
        }

        console.log(data)

        if (success) {
            const path = `users/profile_pictures/${uid}/`,
                file = data.signUpPhoto,
                profilePictureInfo = await storage.uploadFiles(path, file)

            console.log(profilePictureInfo)

            firestore.addData('users', {
                'auth-id': uid,
                'name': data.signUpFullName,
                'gender': data.signUpGender,
                'phone': data.signUpPhone,
                'profilePicture': profilePictureInfo.path,
                'userType': 'client'
            }).then(res => {
                setTimeout(() => {
                    dotLoader.remove()
                }, 500)

                setTimeout(() => {
                    window.location = 'index.html'
                }, 1500)
            })

            swalConfig.title = 'Successfully signed up'
            swalConfig.text = 'You have successfully signed up, now you will be redirected to the login page'
            validation.getFormDOMReference().reset()
        } else {
            swalConfig.title = 'Oh no! Something bad happened'
            swalConfig.text = msj
        }

        Swal.fire(swalConfig)

    })
}
