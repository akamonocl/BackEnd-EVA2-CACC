// ============================================
// CAMBIAR-PASSWORD.JS
// ============================================

document.getElementById('formCambiarPassword')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;
    
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
        Swal.fire('Error', 'Complete todos los campos', 'error');
        return;
    }
    
    if (nuevaPassword !== confirmarPassword) {
        Swal.fire('Error', 'Las contraseñas nuevas no coinciden', 'error');
        return;
    }
    
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passRegex.test(nuevaPassword)) {
        Swal.fire('Error', 'La nueva contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 carácter especial', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('passwordActual', passwordActual);
    formData.append('nuevaPassword', nuevaPassword);
    
    Swal.fire({ title: 'Cambiando contraseña...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    fetch('backend/cambiarPassword.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Éxito!', 'Contraseña actualizada correctamente', 'success')
                .then(() => window.location.href = 'mi-perfil.html');
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => Swal.fire('Error', 'Error de conexión', 'error'));
});

function cerrarSesion() {
    Swal.fire({
        title: 'Cerrar sesión',
        text: '¿Estás seguro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir'
    }).then(result => {
        if (result.isConfirmed) {
            fetch('backend/logout.php').then(() => window.location.href = 'index.html');
        }
    });
}