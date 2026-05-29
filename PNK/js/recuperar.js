
// RECUPERAR.JS - Recuperar contraseña //

document.getElementById('formRecuperar')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value;
    
    if (!correo) {
        Swal.fire('Error', 'Ingrese su correo electrónico', 'error');
        return;
    }
    
    Swal.fire({ title: 'Enviando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    fetch('backend/recuperarPassword.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Revisa tu correo!', 'Te hemos enviado un enlace para recuperar tu contraseña', 'success')
                .then(() => window.location.href = 'login.html');
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => Swal.fire('Error', 'Error de conexión', 'error'));
});