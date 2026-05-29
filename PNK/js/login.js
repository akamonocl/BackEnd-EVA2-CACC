// LOGIN.JS - Inicio de sesión      //

document.getElementById('formLogin')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = document.getElementById('loginCorreo').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!correo || !password) {
        Swal.fire('Error', 'Complete todos los campos', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Iniciando sesión...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    fetch('backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso', 'success')
                .then(() => window.location.href = 'dashboard.html');
        } else {
            Swal.fire('Error', data.error || 'Credenciales incorrectas', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Error de conexión', 'error');
        console.error('Error:', error);
    });
});