const express = require("express");
const mysql = require("mysql2");
var bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const port = 3000;

var app = express();

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'mech2'
});

con.connect();

app.use(session({
    secret: 'clave_secreta',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/iniciarsesion', (req, res) => {
    const correo_i = req.body.correo_i;
    const contra_i = req.body.contra_i;

    if (!correo_i || !contra_i) {
        return res.status(400).json({ error: "Por favor, completa todos los campos." });
    }

    // Consultamos si el correo y la contraseña coinciden
    con.query('SELECT id_persona, correo, tipo_usuario FROM persona WHERE correo = ? AND contraseña = ?', [correo_i, contra_i], (err, respuesta) => {
        if (err) {
            console.log('ERROR: ', err);
            return res.status(500).json({ error: "Error al consultar la base de datos" });
        }

        if (respuesta.length > 0) {
            req.session.userId = respuesta[0].id_persona; 

            // Revisamos el tipo de usuario
            if (respuesta[0].tipo_usuario === 'mecanico') {
                res.status(200).json({ message: "Inicio de sesión exitoso", redirectTo: "/mecanico" }); 
            } else {
                res.status(200).json({ message: "Inicio de sesión exitoso", redirectTo: "/cliente" }); 
            }
        } else {
            res.status(400).json({ error: "Credenciales incorrectas" });
        }
    });
});




app.post('/registrarus', (req, res) => {
    const correo_i = req.body.correo;
    const contra_i = req.body.contra;
    const usuario_i = req.body.usuario;
    const rol_i = req.body.rol; // Se recibe como 'cliente' o 'mecanico'

    if (!correo_i || !contra_i || !usuario_i || !rol_i) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    // Verificar si el correo ya está registrado
    con.query('SELECT * FROM persona WHERE correo = ?', [correo_i], (err, result) => {
        if (err) {
            console.log("ERROR: ", err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO persona (usuario, correo, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)';
        con.query(query, [usuario_i, correo_i, contra_i, rol_i], (err, result) => {
            if (err) {
                console.log("ERROR: ", err);
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }

            // Responder con éxito
            res.status(200).json({ success: true });
        });
    });
});


app.post('/cerrarsesion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
});


app.get('/dashboard', (req, res) => {
    
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); 
    } else {
        res.redirect('/iniciar-sesion'); 
    }
});

app.get('/iniciar-sesion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  
});

app.get('/mecanico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mecanico','inicio_mecanico.html')); 
});

app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','cliente', 'inicio_cliente.html')); 
});



app.listen(port,()=>{
    console.log(`servidor escuchando  http://localhost:${port}`);
})
