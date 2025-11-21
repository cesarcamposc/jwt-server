const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config() // Cargar variables de entorno desde el archivo .env

const app = express()
const port = 3000

app.use(express.json()) // Middleware para parsear el cuerpo de las peticiones
//app.use(bodyParser.json()) // Middleware para parsear el cuerpo de las peticiones

// ruta de login(para generar el JWT)
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Validar que el usuario y la contraseña sean correctos
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {expiresIn: '10s'})
    res.json({ token })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

// ruta protegida(Ruta que requiere autenticacion de un jwt válido)
app.get('/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ message: 'Protected route', user: decoded })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
