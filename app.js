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
        isLoading: true,
        isPatientsLoading: false
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
            // 1. FAST LOAD: Check session and users
            const savedUser = localStorage.getItem('gaelpa_user');
            if (savedUser) {
                this.state.user = JSON.parse(savedUser);
            }

            // Load Users (Essential for auth)
            const usersSnapshot = await usersRef.once('value');
            const firebaseUsers = usersSnapshot.val();
            if (firebaseUsers) {
                // Flatten users if nested (edge case fix)
                const usersList = [];
                const flatten = (obj) => {
                    Object.values(obj).forEach(val => {
                        if (val && val.usuario) usersList.push(val);
                        else if (typeof val === 'object' && val !== null) flatten(val);
                    });
                };
                flatten(firebaseUsers);
                this.state.users = usersList;

                // 2. REFRESH SESSION: Update logged in user with fresh data from DB
                if (this.state.user) {
                    const freshUser = this.state.users.find(u => u.usuario === this.state.user.usuario);
                    if (freshUser) {
                        this.state.user = freshUser;
                        localStorage.setItem('gaelpa_user', JSON.stringify(freshUser));
                        console.log('Session refreshed with fresh DB data.');
                    }
                }
            }

            // 2. INITIAL UI FLOW: Show app structure immediately if user is logged in
            if (this.state.user) {
                this.state.isLoading = false;
                this.showMainUI();
            } else {
                this.state.currentView = 'login';
                this.state.isLoading = false;
                this.showLogin();
            }

        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            this.state.isLoading = false;
            this.showLogin();
        }
    },

    async loadPatients() {
        if (!this.state.user) return;

        console.log(`Starting data fetch for ${this.state.user.rol}...`);
        this.state.isPatientsLoading = true;

        try {
            let query;
            if (this.state.user.rol === 'Administrador') {
                // Admins see everything (background load)
                query = patientsRef;
            } else {
                // Medicos only see their own - FAST FILTERED LOAD
                query = patientsRef.orderByChild('investigador_principal').equalTo(this.state.user.nombre);
            }

            const snapshot = await query.once('value');
            const data = snapshot.val();

            this.state.isPatientsLoading = false;

            if (data) {
                this.state.patients = Object.values(data);
                console.log(`Loaded ${this.state.patients.length} patients.`);
            } else if (this.state.user.rol !== 'Administrador') {
                // Fallback if index missing or query failed
                console.warn('Selective query returned no data. Falling back to full fetch for Medico...');
                const fullSnapshot = await patientsRef.once('value');
                const allData = fullSnapshot.val();
                if (allData) {
                    this.state.patients = Object.values(allData).filter(p =>
                        (p.investigador_principal || p.original_investigador) === this.state.user.nombre
                    );
                    console.log(`Loaded ${this.state.patients.length} patients via fallback.`);
                }
            }

            // Refresh current view if it depends on patients
            if (['list', 'dashboard'].includes(this.state.currentView)) {
                this.switchView(this.state.currentView);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            this.state.isPatientsLoading = false;
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
        
        // Trigger patient load for the current user
        this.loadPatients();
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
                case 'list':
                    PatientListing.render(container, this.state.patients, this.state.user);
                    if (this.state.user.rol === 'Administrador') {
                        PatientListing.attachExportEvents(this.state.patients, this.state.users);
                    }
                    break;
                case 'dashboard': Dashboard.render(container, this.state.patients, this.state.users); break;
                case 'users': UserManagement.render(container, this.state.users); break;
                case 'profile': UserProfile.render(container, this.state.user); break;
            }
        }
    },

    logout() {
        localStorage.removeItem('gaelpa_user');
        this.state.user = null;
        this.state.patients = [];
        this.state.users = [];
        this.state.currentView = 'login';
        this.showLogin();
    }
};

// Start app on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
