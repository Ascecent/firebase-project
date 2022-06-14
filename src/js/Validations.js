// ------------------------------
// Regex patterns

const expressions = {
    'email': /^(([^<>()\[\]\\.,;:\s@\']+(\.[^<>()\[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'text': /^([a-zA-ZáéíóúÁÉÍÓÚñÑ.]+( )*)+$/,
    getExpression: function (exp) {
        return this[exp] || null
    }
}

// ------------------------------

// ------------------------------
// Utility functions

const getDOMItem = (selector, config) => {
    return config['selector'] ? document.querySelector(selector) : document.getElementById(selector)
}

const getDOMItems = selector => document.querySelectorAll(selector)

// ------------------------------

// Form validation implementation
export const Validation = config => {
    document.getElementById(config.formId).reset()
    const items = config.DOMItems

    // -------------------------------
    // Object configuration for properly handling validation

    const submitButton = getDOMItem(`#${config.formId} button[type="submit"]`, {
            selector: true
        }),
        formControls = getDOMItems(`#${config.formId} .${config.formControls}`),
        formInputs = getDOMItems(`#${config.formId} input, #${config.formId} select`),
        validationObject = Object.fromEntries(items.map(item => [item.id, false]))

    Object.preventExtensions(validationObject)

    let validityState = false

    // -------------------------------

    // -------------------------------
    // Validation functionality

    const validationHandler = target => {
        console.log(target)
        const targetId = target.getAttribute('id'),
            item = items.find(element => element.id === targetId),
            value = target.value,
            validation = item.validation,
            message = item.feedbackMessage

        if (item) {
            let validationState

            if (item.customValidation) {
                validationState = item.customValidation(target)
            } else {
                validationState =
                    validation == 'notEmpty' ?
                    !(value === '') :
                    expressions.getExpression(validation).test(value);
            }


            validationObject[targetId] = validationState
            inputStateHandler(target, message, validationState)

            validityState = !Object.values(validationObject).includes(false)
            submitButtonStateHandler()
        }
    }

    const inputStateHandler = (input, message, validation) => {
        validation ? successfulInputStateHandler(input) : inputErrorStateHandler(input, message)
    }

    const inputErrorStateHandler = (input, message) => {
        const formControl = input.parentElement,
            small = formControl.querySelector('.feedback-message')

        small.innerText = message
        formControl.className = 'form-control error'
    }

    const successfulInputStateHandler = input => {
        input.parentElement.className = 'form-control success'
    }

    const submitButtonStateHandler = () => {
        submitButton.disabled = !validityState
        validityState ? submitButton.classList.remove('disabled') : submitButton.classList.add('disabled')
    }

    // -------------------------------

    return ({
        init: () => {
            submitButton.disabled = true

            formInputs.forEach(input => {
                input.addEventListener('input', e => {
                    validationHandler(e.target)
                })

                input.addEventListener('focus', e => {
                    validationHandler(e.target)
                })
            })
        },
        getValidityState: () => validityState
    })
}
