/**
 * Auth Component - Login and Session Management
 */

const Auth = {
    render(container) {
        container.innerHTML = `
            <div class="auth-box fade-in">
                <div class="auth-container">
                    <div class="logo" style="justify-content: center; margin-bottom: 1.5rem;">
                        <img src="logo_lpa.avif" alt="Gaelpa Logo" class="logo-img" style="height: 48px;">
                        <span class="logo-text" style="font-size: 2rem;">Gaelpa</span>
                    </div>
                    <h2>Iniciar Sesión</h2>
                    <p>Acceso exclusivo para investigadores del estudio Gaelpa</p>
                    
                    <div id="auth-error" class="error-msg">Credenciales incorrectas. Intente de nuevo.</div>
                    
                    <form id="login-form" autocomplete="on">
                        <div class="form-group">
                            <label for="username">Usuario</label>
                            <input type="text" id="username" name="username" autocomplete="username" placeholder="Tu nombre de usuario" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" autocomplete="current-password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn-primary">Entrar al Sistema</button>
                    </form>
                    
                    <div style="margin-top: 2rem; font-size: 0.8rem; color: var(--text-muted);">
                        <p>¿Problemas de acceso? Contacte al administrador.</p>
                    </div>
                </div>
            </div>
        `;

        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    },

    handleLogin() {
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('auth-error');

        // Check against app state (which now contains legacy users)
        const user = App.state.users.find(u => u.usuario === username && u.password === password);

        if (user) {
            errorMsg.style.display = 'none';
            // Save session
            const sessionUser = { ...user };
            delete sessionUser.password;
            localStorage.setItem('gaelpa_user', JSON.stringify(sessionUser));

            App.state.user = sessionUser;

            // Give the browser a moment to record the form submission for the password manager
            setTimeout(() => {
                App.showMainUI();
            }, 100);
        } else {
            errorMsg.style.display = 'block';
            errorMsg.classList.add('fade-in');
        }
    }
};
