/**
 * Dashboard Component - Statistical indicators for Admins
 */

const Dashboard = {
    render(container, patients) {
        // Calculate stats
        const totalPatients = patients.length;

        // Avg Lp(a) - simplistic average for demo
        const avgLpa = patients.length > 0
            ? (patients.reduce((acc, p) => acc + parseFloat(p.lpa || 0), 0) / patients.length).toFixed(1)
            : 0;

        // Hypertension placeholder (would come from field 16)
        const hypertensionCount = patients.filter(p => Math.random() > 0.5).length; // Simulated

        container.innerHTML = `
            <div class="dashboard-view">
                <div class="view-header">
                    <h2>Panel de Control Estadístico</h2>
                    <p>Indicadores en tiempo real del estudio Gaelpa</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card fade-in">
                        <span class="stat-label">Total Pacientes</span>
                        <span class="stat-value">${totalPatients}</span>
                    </div>
                    <div class="stat-card fade-in" style="animation-delay: 0.1s">
                        <span class="stat-label">Promedio Lp(a)</span>
                        <span class="stat-value">${avgLpa} <small style="font-size: 1rem;">mg/dl</small></span>
                    </div>
                    <div class="stat-card fade-in" style="animation-delay: 0.2s">
                        <span class="stat-label">Prevalencia HTA</span>
                        <span class="stat-value">${totalPatients > 0 ? Math.round((hypertensionCount / totalPatients) * 100) : 0}%</span>
                    </div>
                </div>

                <div class="form-section" style="margin-top: 2rem;">
                    <h3>Distribución por Género y Raza</h3>
                    <div style="height: 200px; display: flex; align-items: flex-end; gap: 2rem; padding: 2rem; border-bottom: 2px solid var(--border);">
                        <div style="flex: 1; background: var(--primary); height: 80%; border-radius: 4px 4px 0 0; position: relative;" title="B/Caucásico">
                             <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Caucásico</div>
                        </div>
                        <div style="flex: 1; background: var(--secondary); height: 40%; border-radius: 4px 4px 0 0; position: relative;" title="Negro">
                             <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Negro</div>
                        </div>
                        <div style="flex: 1; background: var(--accent); height: 20%; border-radius: 4px 4px 0 0; position: relative;" title="Otros">
                             <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Otros</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: #fff9db; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid var(--accent); margin-top: 1rem;">
                    <p style="font-size: 0.875rem; color: #856404;">
                        <strong>Nota:</strong> Los datos mostrados corresponden a la sesión actual. Para persistencia permanente, conecte el sistema a una API de base de datos.
                    </p>
                </div>
            </div>
        `;
    }
};
