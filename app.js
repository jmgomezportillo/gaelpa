/**
 * Gaelpa App - Main Controller
 */

// Firebase Configuration is loaded from firebase-config.js
if (typeof firebaseConfig !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error('Firebase configuration not found.');
}

const db = firebase.database();
const patientsRef = db.ref('gaelpa/patients');
const usersRef = db.ref('gaelpa/users');

const App = {
    state: {
        user: null,
        currentView: 'login',
        patients: [],
        users: [],
        isLoading: true
    },

    init() {
        console.log('Gaelpa App initializing...');
        this.renderLoader();

        // Load data from cloud
        this.loadInitialData();

        this.attachEvents();
    },

    async loadInitialData() {
        console.log('Fetching data from Firebase...');

        try {
            // Check session
            const savedUser = localStorage.getItem('gaelpa_user');
            if (savedUser) {
                this.state.user = JSON.parse(savedUser);
            }

            // Load Users
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
                    this.state.users.forEach(u => usersRef.child(u.usuario).set(u));
                }
            }

            // Load Patients
            const patientsSnapshot = await patientsRef.once('value');
            const firebasePatients = patientsSnapshot.val();

            if (firebasePatients) {
                this.state.patients = Object.values(firebasePatients);
            } else {
                console.log('No patients in Firebase. Checking legacy patients...');
                this.state.patients = typeof LEGACY_PATIENTS !== 'undefined' ? LEGACY_PATIENTS : [];
                // Only migrate if it's a small set to avoid performance issues on first load
                if (this.state.patients.length > 0 && this.state.patients.length < 500) {
                    this.state.patients.forEach((p, index) => {
                        const id = p.id || `patient_${Date.now()}_${index}`;
                        patientsRef.child(id).set(p);
                    });
                }
            }

            console.log(`Loaded ${this.state.patients.length} patients and ${this.state.users.length} users.`);

            // UI Flow
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
        if (main) {
            main.innerHTML = `
                <div id="loader" class="loader-container">
                    <div class="spinner"></div>
                    <p>Cargando información clínica...</p>
                </div>
            `;
        }
    },

    showLogin() {
        const header = document.getElementById('main-header');
        const footer = document.getElementById('main-footer');
        header?.classList.add('hidden');
        footer?.classList.add('hidden');

        Auth.render(document.getElementById('main-content'));
    },

    showMainUI() {
        const header = document.getElementById('main-header');
        const footer = document.getElementById('main-footer');
        const userName = document.getElementById('user-name');

        header?.classList.remove('hidden');
        footer?.classList.remove('hidden');
        if (userName) userName.textContent = this.state.user.nombre;

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
        if (container) {
            container.innerHTML = '';
            container.classList.add('fade-in');
            setTimeout(() => container.classList.remove('fade-in'), 400);

            switch (view) {
                case 'form': ClinicalForm.render(container); break;
                case 'list': PatientListing.render(container, this.state.patients, this.state.user); break;
                case 'dashboard': Dashboard.render(container, this.state.patients); break;
                case 'users': UserManagement.render(container, this.state.users); break;
                case 'profile': UserProfile.render(container, this.state.user); break;
            }
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
