import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"

barba.use(barbaCss)
barba.init({
    transitions: [{
        name: 'cover',
        to: {
            namespace: ['login', 'signup', 'dashboard']
        },
        enter() {},
        leave() {}
    }]
})
