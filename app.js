/**
 * Gaelpa App - Main Controller
 */

// Firebase Configuration Loader
let firebaseConfig = window.firebaseConfig;

// Fallback to localStorage if not defined by firebase-config.js
if (!firebaseConfig) {
    const savedConfig = localStorage.getItem('gaelpa_firebase_config');
    if (savedConfig) {
        try {
            firebaseConfig = JSON.parse(savedConfig);
            window.firebaseConfig = firebaseConfig;
        } catch (e) {
            console.error('Error parsing saved Firebase config:', e);
        }
    }
}

// Global references (will be initialized in App.init or loadInitialData)
let db, patientsRef, usersRef;

const App = {
    state: {
        user: null,
        currentView: 'login',
        patients: [],
        users: [], // Added users list
        isLoading: true
    },

    init() {
        console.log('Gaelpa App initializing...');
        this.renderLoader();

        // Check if configuration is missing
        if (!window.firebaseConfig) {
            this.showSetupAssistant();
            return;
        }

        // Load data from storage or cloud
        this.loadInitialData();

        this.attachEvents();
    },

    async loadInitialData() {
        console.log('Fetching data from Firebase...');

        try {
            // Late initialization of Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(window.firebaseConfig);
            }
            db = firebase.database();
            patientsRef = db.ref('gaelpa/patients');
            usersRef = db.ref('gaelpa/users');

            // Check session while loading data
            const savedUser = localStorage.getItem('gaelpa_user');
            if (savedUser) {
                this.state.user = JSON.parse(savedUser);
            }

            // Load Users from Firebase
            const usersSnapshot = await usersRef.once('value');
            const firebaseUsers = usersSnapshot.val();

            if (firebaseUsers) {
                this.state.users = Object.values(firebaseUsers);
            } else {
                console.log('No users in Firebase. Checking legacy data...');
                const legacyUsers = typeof LEGACY_USERS !== 'undefined' ? LEGACY_USERS : [
                    { nombre: 'Admin Gaelpa', usuario: 'admin', password: 'admin', rol: 'Administrador' }
                ];
                this.state.users = legacyUsers;

                if (this.state.users.length > 0) {
                    this.state.users.forEach(u => {
                        usersRef.child(u.usuario).set(u);
                    });
                }
            }

            // Load Patients from Firebase
            const patientsSnapshot = await patientsRef.once('value');
            const firebasePatients = patientsSnapshot.val();

            if (firebasePatients) {
                this.state.patients = Object.values(firebasePatients);
            } else {
                console.log('No patients in Firebase. Checking legacy patients...');
                this.state.patients = typeof LEGACY_PATIENTS !== 'undefined' ? LEGACY_PATIENTS : [];

                if (this.state.patients.length > 0 && this.state.patients.length < 500) {
                    this.state.patients.forEach((p, index) => {
                        const id = p.id || `patient_${Date.now()}_${index}`;
                        patientsRef.child(id).set(p);
                    });
                }
            }

            console.log(`Loaded ${this.state.patients.length} patients and ${this.state.users.length} users.`);

            // Redirect based on session
            if (this.state.user) {
                this.state.currentView = 'form';
                this.showMainUI();
            } else {
                this.state.currentView = 'login';
                this.showLogin();
            }

        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            this.state.currentView = 'login';
            this.showLogin();
        } finally {
            this.state.isLoading = false;
        }
    },

    showSetupAssistant() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="auth-box fade-in">
                <div class="auth-container" style="max-width: 500px;">
                    <div class="logo" style="justify-content: center; margin-bottom: 1.5rem;">
                        <img src="logo_lpa.avif" alt="Gaelpa Logo" class="logo-img" style="height: 48px;">
                        <span class="logo-text" style="font-size: 2rem;">Gaelpa</span>
                    </div>
                    <h2>Configuración Inicial</h2>
                    <p>No se encontró la configuración de Firebase en el servidor. Por favor, pega tu objeto de configuración aquí para empezar.</p>
                    
                    <div class="form-group">
                        <label for="fb-config-input">Objeto firebaseConfig (JSON)</label>
                        <textarea id="fb-config-input" rows="8" placeholder='{ "apiKey": "...", "authDomain": "...", ... }' style="font-family: monospace; font-size: 0.85rem;"></textarea>
                    </div>
                    
                    <div id="config-error" class="error-msg" style="display:none;">El formato del objeto no es válido. Asegúrate de que sea un JSON válido.</div>
                    
                    <button id="save-config-btn" class="btn-primary">Guardar y Continuar</button>
                    
                    <div style="margin-top: 1.5rem; text-align: left; font-size: 0.85rem; color: var(--text-muted);">
                        <p><strong>Nota:</strong> Esta configuración se guardará solo en este navegador (localStorage). Esto permite que la web funcione de forma privada en servidores públicos como GitHub Pages.</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('save-config-btn').addEventListener('click', () => {
            const input = document.getElementById('fb-config-input').value;
            try {
                const config = JSON.parse(input);
                localStorage.setItem('gaelpa_firebase_config', JSON.stringify(config));
                window.location.reload();
            } catch (e) {
                document.getElementById('config-error').style.display = 'block';
            }
        });
    },

    attachEvents() {
        document.getElementById('nav-form')?.addEventListener('click', () => this.switchView('form'));
        document.getElementById('nav-list')?.addEventListener('click', () => this.switchView('list'));
        document.getElementById('nav-dashboard')?.addEventListener('click', () => this.switchView('dashboard'));
        document.getElementById('nav-users')?.addEventListener('click', () => this.switchView('users'));
        document.getElementById('user-profile-info')?.addEventListener('click', () => this.switchView('profile'));
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    },

    renderLoader() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div id="loader" class="loader-container">
                <div class="spinner"></div>
                <p>Cargando información clínica...</p>
            </div>
        `;
    },

    showLogin() {
        const header = document.getElementById('main-header');
        const footer = document.getElementById('main-footer');
        header.classList.add('hidden');
        footer.classList.add('hidden');

        Auth.render(document.getElementById('main-content'));
    },

    showMainUI() {
        const header = document.getElementById('main-header');
        const footer = document.getElementById('main-footer');
        const userName = document.getElementById('user-name');

        header.classList.remove('hidden');
        footer.classList.remove('hidden');
        userName.textContent = this.state.user.nombre;

        // Role based UI elements
        const dashBtn = document.getElementById('nav-dashboard');
        const usersBtn = document.getElementById('nav-users');
        if (this.state.user.rol === 'Administrador') {
            dashBtn?.classList.remove('hidden');
            usersBtn?.classList.remove('hidden');
        } else {
            dashBtn?.classList.add('hidden');
            usersBtn?.classList.add('hidden');
        }

        this.switchView(this.state.currentView);
    },

    switchView(view) {
        this.state.currentView = view;

        // Update nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `nav-${view}`) btn.classList.add('active');
        });

        const container = document.getElementById('main-content');
        container.innerHTML = '';
        container.classList.add('fade-in');
        setTimeout(() => container.classList.remove('fade-in'), 400);

        switch (view) {
            case 'form':
                ClinicalForm.render(container);
                break;
            case 'list':
                PatientListing.render(container, this.state.patients, this.state.user);
                break;
            case 'dashboard':
                Dashboard.render(container, this.state.patients);
                break;
            case 'users':
                UserManagement.render(container, this.state.users);
                break;
            case 'profile':
                UserProfile.render(container, this.state.user);
                break;
        }
    },

    logout() {
        localStorage.removeItem('gaelpa_user');
        this.state.user = null;
        this.state.currentView = 'login';
        this.showLogin();
    }
};

// Start app on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
