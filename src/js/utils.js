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

    if (file.size == 0) obs = 'El tamaño del archivo debe ser mayor a 0.'
    else if (file.size > IMAGE_SIZE_MAX) obs = 'El tamaño del archivo no puede ser mayor a ' + SIZE_MAX + 'Mb.'
    else if (file.type.split('/')[0] != 'image') obs = 'El formato del archivo cargado no es una imágen.'

    let url = ''
    if (obs) {
        this.value = ''
    } else url = URL.createObjectURL(file)

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
