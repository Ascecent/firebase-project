import Swal from "sweetalert2";

const IMAGE_SIZE_MAX = 10485760; //10MB

export const createSpinnerLoader = type => {
    const loader = document.createElement('div')
    loader.className = 'loader-background'
    loader.innerHTML = `<div class="${type}"></div>`

    return loader
}

export const previewImage = input => {
    const file = input.files[0]
    let obs = null

    if (file.size == 0) {
        obs = 'File size must be larger than zero'
    } else if (file.size > IMAGE_SIZE_MAX) {
        obs = `File size cannot be larger than ${IMAGE_SIZE_MAX/1000} MB`
    } else if (file.type.split('/')[0] != 'image') {
        obs = "File format isn't supported"
    }

    let url = ''

    if (obs) {
        input.value = ''
    } else {
        url = URL.createObjectURL(file)
    }

    if (obs) {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: obs,
            confirmButtonText: 'Got it',
            confirmButtonColor: '#e74c3c'
        })
    }

    return {
        url: url,
        validation: obs == null
    }
}
