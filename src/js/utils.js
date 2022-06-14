export const createSpinnerLoader = type => {
    const loader = document.createElement('div')
    loader.className = 'loader-background'
    loader.innerHTML = `<div class="${type}"></div>`

    return loader
}
