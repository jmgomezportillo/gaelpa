/**
 * Patient Listing Component - Searchable list with RLS
 */

const PatientListing = {
    render(container, patients, currentUser) {
        // Helper to compare names robustly (handles "Pablo Corral" vs "Corral Pablo")
        const namesMatch = (nameA, nameB) => {
            if (!nameA || !nameB) return false;
            const normalize = str => str.toLowerCase().trim().split(/\s+/).sort().join(' ');
            return normalize(nameA) === normalize(nameB);
        };

        // Apply Row-Level Security: Medicos only see their own patients
        const visiblePatients = currentUser.rol === 'Administrador'
            ? patients
            : patients.filter(p => namesMatch(p.original_investigador, currentUser.nombre));

        container.innerHTML = `
            <div class="listing-view">
                <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h2>${currentUser.rol === 'Admin' ? 'Todos los Pacientes' : 'Mis Pacientes'}</h2>
                        <p>${visiblePatients.length} pacientes encontrados</p>
                    </div>
                    <div class="search-box" style="flex: 0 0 300px;">
                        <input type="text" id="patient-search" placeholder="Buscar por Nombre o DNI...">
                    </div>
                </div>

                <div id="patients-container">
                    ${this.renderList(visiblePatients)}
                </div>
            </div>
        `;

        const searchInput = document.getElementById('patient-search');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = visiblePatients.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.dni?.toLowerCase().includes(query)
            );
            document.getElementById('patients-container').innerHTML = this.renderList(filtered);
        });
    },

    renderList(patients) {
        if (patients.length === 0) {
            return `
                <div style="text-align: center; padding: 4rem; background: white; border-radius: 1rem; color: var(--text-muted);">
                    <p>No se encontraron pacientes registrados.</p>
                </div>
            `;
        }

        return patients.map(p => `
            <div class="patient-card fade-in">
                <div class="patient-info">
                    <h4>${p.name}</h4>
                    <div class="patient-meta">
                        <span><strong>DNI:</strong> ${p.dni || 'N/A'}</span>
                        <span><strong>Edad:</strong> ${p.age} años</span>
                        <span><strong>Investigador:</strong> ${p.original_investigador || p.doctor}</span>
                    </div>
                </div>
                <div class="patient-stats" style="text-align: right;">
                    <div style="font-weight: 700; color: var(--primary); font-size: 1.25rem;">
                        ${p.lpa} <small>${p.unit}</small>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Lp(a) Concentración</div>
                </div>
            </div>
        `).join('');
    }
};
