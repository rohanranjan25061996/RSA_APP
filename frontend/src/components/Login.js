import React from 'react'
import Axios from "axios"
import css from "./styles/index.module.css"
import * as forge from "node-forge"
import { LoginContext } from '../context/Check'


const init = {
    userName: '',
    password : ''
}

let URL = 'http://localhost:4000/login'

const Login = () => {

    const [form, setForm] = React.useState(init)
    const {handelLogin, handelLogout} = React.useContext(LoginContext)

    React.useEffect(() => {
      getKey()
    }, [])

    const getKey = () => {
      Axios.get(URL)
      .then((res) => {
        const {key} = res.data
        if(key){
          localStorage.setItem('key', JSON.stringify(key))
        }
      })
      .catch((err) => {
        console.log('Error => ', err)
      })
    }

    const onChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    const handelSubmit = (e) => {
        e.preventDefault()
        if(form.userName != '' && form.password != ''){
          let key = localStorage.getItem('key')
          key = JSON.parse(key)
          let rsa = forge.pki.publicKeyFromPem(key)
          let encryptPassword = window.btoa(rsa.encrypt(form.password))
          let payLoad = {
            userName: form.userName,
            password: encryptPassword
          }

          Axios.post(URL, payLoad)
          .then((resp) => {
            const {res} = resp.data
            if(res == 'login successfull'){
              handelLogin()
            }
          })
          .catch((err) => {
            window.alert(`Invalid username or password`)
            setForm(init)
            handelLogout()
          })
        }else{
          window.alert('Invalid username or password')
          setForm(init)
          handelLogout()
        }
        
    }

    return (
        <>
       <div className={css.login_page}>
        <div className={css.form}>
    <form className={css.register_form}>
      <input type="text" placeholder="name"/>
      <input type="password" placeholder="password"/>
      <input type="text" placeholder="email address"/>
      <button>create</button>
    </form>
    <form className={css.login-form}>
      <input type="text" placeholder="username" value = {form.userName} name = 'userName' onChange = {onChange} />
      <input type="password" placeholder="password" value = {form.password} name = 'password' onChange = {onChange}/>
      <button onClick={handelSubmit}>login</button>
    </form>
  </div>
</div>
        </>
    )
}

export default Login