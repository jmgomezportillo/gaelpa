/**
 * Profile Component - User Settings
 */

const UserProfile = {
    render(container, user) {
        container.innerHTML = `
            <div class="form-section fade-in" style="max-width: 600px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                    <div class="logo-icon" style="font-size: 2.5rem; background: #eff6ff; padding: 1rem; border-radius: 1rem;">👤</div>
                    <div>
                        <h2>Mi Perfil</h2>
                        <p>Gestione sus datos de acceso al sistema</p>
                    </div>
                </div>

                <div id="profile-msg" class="error-msg" style="display: none; background: #ecfdf5; color: #059669; border: 1px solid #cefade;">
                    Cambios guardados con éxito.
                </div>
                
                <div id="profile-error" class="error-msg"></div>

                <form id="profile-form">
                    <div class="form-group">
                        <label for="prof-name">Nombre Completo</label>
                        <input type="text" id="prof-name" value="${user.nombre}" readonly tabindex="-1" style="background-color: #f1f5f9; cursor: not-allowed; pointer-events: none;">
                        <small>El nombre completo no puede ser modificado por el usuario.</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="prof-user">Nombre de Usuario</label>
                        <input type="text" id="prof-user" value="${user.usuario}" required>
                        <small>Este es el nombre con el que ingresa al sistema.</small>
                    </div>

                    <div class="form-group">
                        <label for="prof-pass">Nueva Contraseña</label>
                        <input type="password" id="prof-pass" placeholder="Dejar en blanco para no cambiar">
                        <small>Si no desea cambiar su contraseña, deje este campo vacío.</small>
                    </div>

                    <div class="form-actions" style="margin-top: 2rem;">
                        <button type="submit" class="btn-primary" style="width: auto; padding-left: 2rem; padding-right: 2rem;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;

        this.attachEvents(user);
    },

    attachEvents(currentUser) {
        const form = document.getElementById('profile-form');
        const successMsg = document.getElementById('profile-msg');
        const errorMsg = document.getElementById('profile-error');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const newUser = document.getElementById('prof-user').value.trim().toLowerCase();
            const newPass = document.getElementById('prof-pass').value;

            console.log('Guardando cambios de perfil:', { newUser, newPass });

            // Basic validation
            if (!newUser) {
                this.showError('El Usuario es requerido.');
                return;
            }

            // Check if username is taken by another user
            const isTaken = App.state.users.some(u => u.usuario === newUser && u.usuario !== currentUser.usuario);
            if (isTaken) {
                this.showError('El nombre de usuario ya está en uso.');
                return;
            }

            // Update user in state
            const userIndex = App.state.users.findIndex(u => u.usuario === currentUser.usuario);
            if (userIndex !== -1) {
                const updatedUser = { ...App.state.users[userIndex] };
                updatedUser.usuario = newUser;

                if (newPass) {
                    updatedUser.password = newPass;
                }

                console.log('Usuario actualizado final:', updatedUser);

                App.state.users[userIndex] = updatedUser;
                // Save to Firebase
                usersRef.child(currentUser.usuario).update(updatedUser)
                    .then(() => {
                        App.state.users[userIndex] = updatedUser;
                        App.state.user = {
                            nombre: updatedUser.nombre,
                            usuario: updatedUser.usuario,
                            rol: updatedUser.rol
                        };

                        // Persist session
                        localStorage.setItem('gaelpa_user', JSON.stringify(App.state.user));

                        // UI Update
                        const userNameEl = document.getElementById('user-name');
                        if (userNameEl) userNameEl.textContent = updatedUser.nombre;

                        successMsg.style.display = 'block';
                        errorMsg.style.display = 'none';

                        // Clear pass field
                        document.getElementById('prof-pass').value = '';

                        setTimeout(() => {
                            if (successMsg) successMsg.style.display = 'none';
                        }, 3000);
                    })
                    .catch(error => {
                        console.error('Error updating profile in Firebase:', error);
                        this.showError('Error al guardar cambios en la nube.');
                    });
            }
        });
    },

    showError(msg) {
        const errorMsg = document.getElementById('profile-error');
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        errorMsg.classList.add('fade-in');
    }
};
