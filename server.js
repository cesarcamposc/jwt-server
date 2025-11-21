const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config() // Cargar variables de entorno desde el archivo .env

const app = express()
const port = 3000

app.use(bodyParser.json()) // Middleware para parsear el cuerpo de las peticiones
app.use(cors()) // Middleware para habilitar CORS

// usuario ficticio
const userDemo = {
  id: 1,
  name : 'Juan Perez',
  email: 'juan.perez@gmail.com',
  password: 'password123' }


// ruta de login(para generar el JWT)
app.post('/login', (req, res) => {
  const { email, password } = req.body

  // Validar que el usuario y la contraseña sean correctos
  if (email === userDemo.email && password === userDemo.password) {
    //generar el token
    const token = jwt.sign({ id: userDemo.id, name: userDemo.name }, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.json({ token })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

//Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// ruta protegida(Ruta que requiere autenticacion de un jwt válido)
app.get('/profile', verifyToken, (req, res) => {
  res.json({ 
    message: 'Acceso concedido', 
    user: req.user 
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server JWT running on http://localhost:${port}`);
});
