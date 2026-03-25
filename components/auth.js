/**
 * Auth Component - Login and Session Management
 */

const Auth = {
    render(container) {
        const isError = App.state.isDatabaseError;
        const noUsers = App.state.users.length === 0;

        container.innerHTML = `
            <div class="auth-box fade-in">
                <div class="auth-container">
                    <div class="logo" style="justify-content: center; margin-bottom: 1.5rem;">
                        <img src="logo_lpa.avif" alt="Gaelpa Logo" class="logo-img" style="height: 48px;">
                        <span class="logo-text" style="font-size: 2rem;">Gaelpa</span>
                    </div>
                    <h2>Iniciar Sesión</h2>
                    <p>Acceso exclusivo para investigadores del estudio Gaelpa</p>
                    
                    ${isError || (noUsers && !App.state.isLoading) ? `
                        <div class="error-msg" style="display:block; background: #fffbeb; color: #92400e; border: 1px solid #fcd34d;">
                            <strong>⚠️ Error de conexión:</strong> No se pudo cargar la base de datos de usuarios. Verifique su conexión o contacte al administrador.
                        </div>
                    ` : ''}

                    <div id="auth-error" class="error-msg">Credenciales incorrectas. Intente de nuevo.</div>
                    
                    <form id="login-form" method="POST" action="#" target="hidden_iframe" autocomplete="on">
                        <div class="form-group">
                            <label for="username">Usuario</label>
                            <input type="text" id="username" name="username" autocomplete="username" placeholder="Tu nombre de usuario" required ${isError ? 'disabled' : ''}>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" autocomplete="current-password" placeholder="••••••••" required ${isError ? 'disabled' : ''}>
                        </div>
                        <button type="submit" id="login-btn" class="btn-primary" ${isError ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Entrar al Sistema</button>
                    </form>
                    
                    <iframe name="hidden_iframe" id="hidden_iframe" style="display:none"></iframe>
                    
                    <div style="margin-top: 2rem; font-size: 0.8rem; color: var(--text-muted);">
                        <p>¿Problemas de acceso? Contacte al administrador.</p>
                    </div>
                </div>
            </div>
        `;

        if (isError) return;

        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            const usernameInput = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            console.log('Intento de inicio de sesión:', usernameInput);

            // Robust comparison: lowercase and remove accents
            const normalize = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
            
            const normalizedInput = normalize(usernameInput);
            
            const user = App.state.users.find(u => {
                const normalizedDbUser = normalize(u.usuario);
                return normalizedDbUser === normalizedInput && u.password === password;
            });

            if (user) {
                console.log('Inicio de sesión exitoso para:', user.usuario);
                // SUCCESS: DO NOT prevent default to allow browser to see a "real" submission to the iframe
                this.handleSuccess(user);
            } else {
                console.warn('Credenciales incorrectas para:', usernameInput);
                if (App.state.users.length === 0) {
                    console.error('ERROR CRÍTICO: La lista de usuarios en memoria está vacía.');
                }
                // FAILURE: Prevent submission and show error
                e.preventDefault();
                this.showError();
            }
        });
    },

    handleSuccess(user) {
        const errorMsg = document.getElementById('auth-error');
        const loginBtn = document.getElementById('login-btn');
        
        if (errorMsg) errorMsg.style.display = 'none';
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Iniciando sesión...';
        }

        // Save session
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem('gaelpa_user', JSON.stringify(sessionUser));
        App.state.user = sessionUser;

        // Transition with delay to allow browser to process the submission
        setTimeout(() => {
            App.showMainUI();
        }, 600);
    },

    showError() {
        const errorMsg = document.getElementById('auth-error');
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.classList.add('fade-in');
        }
    }
};
