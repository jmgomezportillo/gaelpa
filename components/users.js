/**
 * User Management Component - Admin only
 */

const UserManagement = {
    render(container, users) {
        container.innerHTML = `
            <div class="users-view">
                <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2>Gestión de Médicos</h2>
                        <p>Administre el personal autorizado para el estudio Gaelpa</p>
                    </div>
                    <button id="add-doctor-btn" class="btn-primary" style="width: auto; padding: 0.5rem 1.5rem;">+ Agregar Médico</button>
                </div>

                <div id="add-doctor-form-container" class="hidden form-section fade-in" style="margin-bottom: 2rem;">
                    <h3>Nuevo Usuario</h3>
                    <form id="new-doctor-form">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="doc-name">Nombre Completo</label>
                                <input type="text" id="doc-name" required placeholder="Ej: Elena Rossi">
                            </div>
                            <div class="form-group">
                                <label for="doc-user">Nombre de Usuario</label>
                                <input type="text" id="doc-user" required placeholder="Ex: erossi">
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="doc-pass">Contraseña Inicial</label>
                                <input type="password" id="doc-pass" required placeholder="••••••••">
                            </div>
                            <div class="form-group">
                                <label for="doc-role">Rol</label>
                                <select id="doc-role">
                                    <option value="Investigador">Investigador</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="cancel-doc-btn" class="btn-secondary">Cancelar</button>
                            <button type="submit" class="btn-primary" style="width: auto;">Guardar Usuario</button>
                        </div>
                    </form>
                </div>

                <div id="users-list-container">
                    ${this.renderUserList(users)}
                </div>

                <!-- Maintenance Section -->
                <div class="form-section" style="margin-top: 4rem; border-top: 2px solid #fee2e2; padding-top: 2rem; background: #fffaf0;">
                    <h3 style="color: #991b1b;">⚠️ Mantenimiento del Sistema</h3>
                    <p style="font-size: 0.875rem; color: #7f1d1d; margin-bottom: 1.5rem;">
                        Utilice estas herramientas con precaución. Las acciones son permanentes.
                    </p>
                    <div style="display: flex; gap: 1rem;">
                        <button id="reset-patients-btn" class="btn-secondary" style="border-color: #f87171; color: #b91c1c;">
                            Reiniciar Base de Datos de Pacientes
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachEvents(container);
    },

    renderUserList(users) {
        if (users.length === 0) {
            return `<div class="patient-card" style="justify-content: center;">No hay usuarios registrados.</div>`;
        }

        return users.map(user => `
            <div class="patient-card fade-in">
                <div class="patient-info">
                    <h4>${user.nombre}</h4>
                    <div class="patient-meta">
                        <span><strong>Usuario:</strong> @${user.usuario}</span>
                        <span><strong>Rol:</strong> ${user.rol}</span>
                    </div>
                </div>
                <div class="actions">
                    ${user.usuario === App.state.user.usuario ? `
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">(Tú)</span>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    attachEvents(container) {
        const addBtn = document.getElementById('add-doctor-btn');
        const formContainer = document.getElementById('add-doctor-form-container');
        const cancelBtn = document.getElementById('cancel-doc-btn');
        const form = document.getElementById('new-doctor-form');

        addBtn.addEventListener('click', () => {
            formContainer.classList.toggle('hidden');
            addBtn.textContent = formContainer.classList.contains('hidden') ? '+ Agregar Médico' : 'Cerrar Formulario';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            addBtn.textContent = '+ Agregar Médico';
            form.reset();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
        });


        // Reset database button
        const resetBtn = document.getElementById('reset-patients-btn');
        resetBtn?.addEventListener('click', () => {
            if (confirm('¿ESTÁ SEGURO? Esta acción ELIMINARÁ PERMANENTEMENTE todos los pacientes actuales.')) {
                if (confirm('CONFIRMACIÓN FINAL: Se borrarán todos los registros de pacientes para iniciar con la nueva estructura.')) {
                    this.handleResetPatients();
                }
            }
        });
    },

    handleResetPatients() {
        patientsRef.remove()
            .then(() => {
                App.state.patients = [];
                alert('Base de datos de pacientes reiniciada con éxito.');
                App.switchView('list');
            })
            .catch(error => {
                console.error('Error resetting patients:', error);
                alert('Error al reiniciar la base de datos.');
            });
    },

    handleAddUser() {
        const newUser = {
            nombre: document.getElementById('doc-name').value,
            usuario: document.getElementById('doc-user').value.toLowerCase(),
            password: document.getElementById('doc-pass').value,
            rol: document.getElementById('doc-role').value
        };

        // Save to Firebase
        usersRef.child(newUser.usuario).set(newUser)
            .then(() => {
                App.state.users.push(newUser);
                alert('Usuario agregado correctamente');
                App.switchView('users'); // Refresh view
            })
            .catch(error => {
                console.error('Error adding user to Firebase:', error);
                alert('Error al agregar usuario.');
            });
    },

    handleDeleteUser(username) {
        // Remove from Firebase
        usersRef.child(username).remove()
            .then(() => {
                App.state.users = App.state.users.filter(u => u.usuario !== username);
                App.switchView('users'); // Refresh view
            })
            .catch(error => {
                console.error('Error deleting user from Firebase:', error);
                alert('Error al eliminar usuario.');
            });
    }
};
