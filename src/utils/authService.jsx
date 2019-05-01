import Cookies from 'js-cookie' 

const CookieDomain = process.env.VUE_APP_CookieDomain

let cookieConfig = {}
if (CookieDomain !== '') {
  cookieConfig = { domain: CookieDomain } // path:'/',maxAge:365*24*60*60
}

export function saveCookie(name, value) {
  Cookies.set(name, value, cookieConfig)
}

export function getCookie(name) {
  return Cookies.get(name)
}

export function removeCookie(name) {
  Cookies.remove(name, cookieConfig)
}

export function signOut() {
  Cookies.remove('token', cookieConfig)
}

export function isLogin() {
  return !!Cookies.get('token')
}
