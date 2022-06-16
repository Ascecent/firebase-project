import "Styles"
import barba from "@barba/core"
import barbaCss from "@barba/css"

import Authentication from './firebase/Auth'
import Firestore from './firebase/Firestore'
import Storage from "./firebase/Storage"

import Login from "./Login"
import SignUp from "./SignUp"
import Home from './Home'

import "@fortawesome/fontawesome-free/js/all"

const authentication = Authentication(),
    firestore = Firestore(),
    storage = Storage()

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
                SignUp(authentication, firestore, storage)
            }
        },
        {
            namespace: 'home',
            beforeEnter() {
                Home()
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
