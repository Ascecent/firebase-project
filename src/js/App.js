import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"
import {
    Validation
} from "./Validations"

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
                    feedbackMessage: 'Enter an email with a valid format (example@example.com)'
                }, {
                    id: 'loginPassword',
                    validation: 'notEmpty',
                    feedbackMessage: 'The password is required'
                }],
            })

            validation.init()
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
