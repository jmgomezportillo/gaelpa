/**
 * Gaelpa App - Main Controller
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzB-dLZnskB3_xqeHw77bCHpDSfWLRcsc",
    authDomain: "gaelpa-efba4.firebaseapp.com",
    databaseURL: "https://gaelpa-efba4-default-rtdb.firebaseio.com",
    projectId: "gaelpa-efba4",
    storageBucket: "gaelpa-efba4.firebasestorage.app",
    messagingSenderId: "596533202803",
    appId: "1:596533202803:web:cba27b1316630819d5bf06",
    measurementId: "G-TJRKL89TW6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const patientsRef = db.ref('gaelpa/patients');
const usersRef = db.ref('gaelpa/users');

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

        // Load mock data or data from storage
        this.loadInitialData();

        // Check session (mock)
        const savedUser = localStorage.getItem('gaelpa_user');
        if (savedUser) {
            this.state.user = JSON.parse(savedUser);
            this.state.currentView = 'form'; // Default view for logged in
            this.showMainUI();
        } else {
            this.state.currentView = 'login';
            this.showLogin();
        }

        this.attachEvents();
    },

    async loadInitialData() {
        console.log('Fetching data from Firebase...');

        try {
            // Load Users from Firebase
            const usersSnapshot = await usersRef.once('value');
            const firebaseUsers = usersSnapshot.val();

            if (firebaseUsers) {
                // Convert object to array if necessary (Firebase often returns objects with IDs as keys)
                this.state.users = Object.values(firebaseUsers);
            } else {
                // Initial migration: If Firebase is empty, use legacy data
                console.log('No users in Firebase. Migrating legacy users...');
                this.state.users = typeof LEGACY_USERS !== 'undefined' ? LEGACY_USERS : [
                    { nombre: 'Admin Gaelpa', usuario: 'admin', password: 'admin', rol: 'Administrador' }
                ];
                // Save to Firebase for the first time
                this.state.users.forEach(u => {
                    usersRef.child(u.usuario).set(u);
                });
            }

            // Load Patients from Firebase
            const patientsSnapshot = await patientsRef.once('value');
            const firebasePatients = patientsSnapshot.val();

            if (firebasePatients) {
                this.state.patients = Object.values(firebasePatients);
            } else {
                // Initial migration for patients
                console.log('No patients in Firebase. Migrating legacy patients...');
                this.state.patients = typeof LEGACY_PATIENTS !== 'undefined' ? LEGACY_PATIENTS : [];

                // Optional: Migrate legacy patients to Firebase on first load
                // (Warning: this could be slow for 3200 records, but it's a one-time thing)
                if (this.state.patients.length > 0) {
                    this.state.patients.forEach((p, index) => {
                        // Use a unique ID or index for now
                        const id = p.id || `patient_${Date.now()}_${index}`;
                        patientsRef.child(id).set(p);
                    });
                }
            }

            console.log(`Loaded ${this.state.patients.length} patients and ${this.state.users.length} users from cloud.`);

            // Re-render current view if data changes
            if (this.state.currentView !== 'login') {
                this.switchView(this.state.currentView);
            }
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            // Fallback to local if error (though cloud is the source of truth now)
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
