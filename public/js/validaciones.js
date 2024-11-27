document.addEventListener("DOMContentLoaded", function() {

    // Validación y envío de inicio de sesión
    document.getElementById("form-inicio-sesion").addEventListener("submit", function(event) {
        event.preventDefault();
        const correo = document.getElementById("correo_i").value;
        const contra = document.getElementById("contra_i").value;
    
        if (valid_inicio_s(correo, contra)) {
            fetch('/iniciarsesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo_i: correo, contra_i: contra })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Mensaje de inicio exitoso
                    // Redirige según el rol
                    if (data.redirectTo) {
                        window.location.href = data.redirectTo;
                    }
                } else if (data.error) {
                    alert(data.error); // Mensaje de error
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al intentar iniciar sesión.');
            });
        }
    });

    // Validación y envío del registro
    document.getElementById('form-registro').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const usuario = document.getElementById('Usuario_r').value;
        const correo = document.getElementById('correo_r').value;
        const contra = document.getElementById('contra_r').value;
        const contraConfirm = document.getElementById('contra_r2').value;
        const rol = document.getElementById('role').value;
    
        // Validación de campos
        if (!val_regis(usuario, contra, contraConfirm, correo)) {
            return; // Si la validación falla, no enviamos los datos
        }
    
        const data = {
            usuario: usuario,
            correo: correo,
            contra: contra,
            rol: rol // Usamos directamente 'cliente' o 'mecanico'
        };
    
        // Enviar datos al servidor
        fetch('/registrarus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registro exitoso');
                window.location.href = '/iniciar-sesion'; // Redirige al login
            } else {
                alert('Hubo un error en el registro: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error al registrar:', error);
            alert('Error en el registro, por favor intente nuevamente');
        });
    });
});
// Función de validación para el inicio de sesión
function valid_inicio_s(correo, contraseña) {
    if (correo.length === 0 || contraseña.length === 0) {
        alert("Por favor, completa todos los campos.");
        return false;
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(correo)) {
        alert("El correo debe ser un correo de Gmail.");
        return false;
    } else {
        return true;
    }
}

// Función de validación para el registro
function val_regis(usuario, cont, cont2, correo) {
    if (!usuario) {
        alert('Por favor, ingresa un nombre de usuario.');
        return false;
    } else if (!correo || !correo.endsWith('@gmail.com')) {
        alert('El correo debe ser de tipo Gmail.');
        return false;
    } else if (cont.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    } else if (cont !== cont2) {
        alert('Las contraseñas no coinciden.');
        return false;
    } else if (document.getElementById('role').value === "") {
        alert('Por favor selecciona un rol (Cliente o Mecánico).');
        return false;
    } else {
        return true;
    }
}
