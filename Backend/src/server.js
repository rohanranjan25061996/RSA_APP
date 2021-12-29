const express = require('express');
const app = express();
const Nodersa = require('node-rsa');
const fs = require('fs')
const path = require('path')

const publicKeyPath = path.join(__dirname, 'public.key')
const privateKeyPath = path.join(__dirname, 'private.key')

const publicKey = fs.readFileSync(publicKeyPath, 'utf-8')
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8')

const start = async () => {
    app.listen(4000, () => {
        console.log("Listening on port http://localhost:4000/ ")
    })
}

app.use(express.json())

app.get('/login', (req, res) => {
    try {
        return res.send({key: publicKey})

    }catch(err){
        return res.status(500).json({error: err.message})
    }
})

app.post('/login', (req, res) => {
    try {
        const {userName, password} = req.body
        let key = new Nodersa(privateKey)
        key.setOptions({encryptionScheme: 'pkcs1'})
        const pass = key.decrypt(password, 'utf8')
        if(userName == 'admin' && pass == 'admin'){
            return res.status(200).json({res: 'login successfull'})
        }else{
            return res.status(400).json({res: 'Invalid user'})
        }

    }catch(err){
        return res.status(500).json({error: err.message})
    }
    
})
module.exports = start