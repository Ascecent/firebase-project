import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"
import Authentication from './firebase/Auth'
import Firestore from './firebase/Firestore'
import Login from "./Login"
import SignUp from "./SignUp"
import "@fortawesome/fontawesome-free/js/all"

const authentication = Authentication(),
    firestore = Firestore()

barba.use(barbaCss)
barba.init({
    views: [{
            namespace: 'login',
            beforeEnter() {
                Login(authentication)
            }
        },
        {
            namespace: 'signup',
            beforeEnter() {
                console.log('signup')
                SignUp(authentication, firestore)
            }
        }
    ],
    transitions: [{
        name: 'clip',
        to: {
            namespace: ['login', 'signup', 'dashboard']
        },
        enter() {},
        leave() {}
    }]
})
