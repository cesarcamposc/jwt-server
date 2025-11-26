const express = require('express');
const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv')
const cors = require('cors');

//dotenv.config() // Cargar variables de entorno desde el archivo .env

const app = express();
const port = 3000;
const SECRET_KEY = 'mi_clave_secreta';

app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones
app.use(cors()); // Middleware para habilitar CORS

// usuario ficticio
const userDemo = {
  id: 1,
  name : 'Juan Perez 3',
  email: 'juan.perez@gmail.com',
  password: '123456'};


// ruta de login(para generar el JWT)
app.post('/login', (req, res) => {
  const { email, password } = req.body

  // Validar que el usuario y la contraseña sean correctos
  if (email === userDemo.email && password === userDemo.password) {
    //generar el token
    const token = jwt.sign({ id: userDemo.id, name: userDemo.name }, SECRET_KEY, {expiresIn: '1h'})
    return res.json({ token })
  } else {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
})

//Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
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
