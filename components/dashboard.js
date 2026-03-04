/**
 * Dashboard Component - Statistical indicators for Admins
 */

const Dashboard = {
    render(container, patients, users) {
        if (App.state.isPatientsLoading) {
            container.innerHTML = `
                <div class="dashboard-view">
                    <div class="view-header">
                        <h2>Panel de Control Estadístico</h2>
                        <p>Cargando indicadores...</p>
                    </div>
                    <div style="text-align: center; padding: 5rem; background: white; border-radius: 1rem;">
                        <div class="spinner" style="margin: 0 auto 1rem;"></div>
                        <p>Analizando base de datos completa para estadísticas...</p>
                    </div>
                </div>
            `;
            return;
        }

        // --- Lp(a) Unified Analysis ---
        const calculateQuartiles = (arr) => {
            if (arr.length === 0) return { q1: 0, median: 0, q3: 0 };
            const sorted = arr.sort((a, b) => a - b);
            const pos = (q) => (sorted.length - 1) * q;
            const base = (q) => Math.floor(pos(q));
            const rest = (q) => pos(q) - base(q);
            const getQ = (q) => {
                const b = base(q);
                if (sorted[b + 1] !== undefined) return sorted[b] + rest(q) * (sorted[b + 1] - sorted[b]);
                return sorted[b];
            };
            return {
                q1: getQ(0.25).toFixed(1),
                median: getQ(0.5).toFixed(1),
                q3: getQ(0.75).toFixed(1)
            };
        };

        const mgDlValues = [];
        const nmolLValues = [];

        patients.forEach(p => {
            const valStr = (p.lpa || "0").toString().replace(',', '.');
            const val = parseFloat(valStr);
            if (isNaN(val) || val <= 0) return;

            let unit = (p.lpa_unit || "mg/dl").toLowerCase().trim();
            if (unit === 'nml/l') unit = 'nmol/l'; // Fix common typo

            if (unit === 'mg/dl') {
                mgDlValues.push(val);
                nmolLValues.push(val * 2.4);
            } else if (unit === 'nmol/l') {
                nmolLValues.push(val);
                mgDlValues.push(val / 2.4);
            }
        });

        const quartilesMgDl = calculateQuartiles(mgDlValues);
        const quartilesNmolL = calculateQuartiles(nmolLValues);

        // --- Other Stats ---
        const totalPatients = patients.length;
        const hypertensionCount = patients.filter(p => p.hipertension === 'Si' || p.hipertension === '1' || p.hipertension === 1).length;

        // Researcher Contribution
        const userStats = users.map(u => {
            const count = patients.filter(p => (p.investigador_principal || p.original_investigador) === u.nombre).length;
            return { ...u, count };
        }).sort((a, b) => b.count - a.count);

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
                        <span class="stat-label">Registros con Lp(a)</span>
                        <span class="stat-value">${mgDlValues.length}</span>
                    </div>
                    <div class="stat-card fade-in" style="animation-delay: 0.2s">
                        <span class="stat-label">Prevalencia HTA</span>
                        <span class="stat-value">${totalPatients > 0 ? Math.round((hypertensionCount / totalPatients) * 100) : 0}%</span>
                    </div>
                </div>

                <div class="form-section" style="margin-top: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>Distribución de Lp(a) (Cuartiles)</h3>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Conversión estándar: 1 mg/dL ≈ 2.4 nmol/L</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div style="background: white; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid var(--border);">
                            <h4 style="margin-bottom: 1rem; color: var(--primary);">Escala en mg/dL</h4>
                            <div style="display: flex; justify-content: space-around; text-align: center;">
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Q1 (P25)</div><div style="font-size: 1.25rem; font-weight: 700;">${quartilesMgDl.q1}</div></div>
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Mediana (P50)</div><div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary);">${quartilesMgDl.median}</div></div>
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Q3 (P75)</div><div style="font-size: 1.25rem; font-weight: 700;">${quartilesMgDl.q3}</div></div>
                            </div>
                        </div>
                        <div style="background: white; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid var(--border);">
                            <h4 style="margin-bottom: 1rem; color: var(--primary);">Escala en nmol/L</h4>
                            <div style="display: flex; justify-content: space-around; text-align: center;">
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Q1 (P25)</div><div style="font-size: 1.25rem; font-weight: 700;">${quartilesNmolL.q1}</div></div>
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Mediana (P50)</div><div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary);">${quartilesNmolL.median}</div></div>
                                <div><div style="font-size: 0.75rem; color: var(--text-muted);">Q3 (P75)</div><div style="font-size: 1.25rem; font-weight: 700;">${quartilesNmolL.q3}</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                    <div class="form-section">
                        <h3>Contribución por Investigador</h3>
                        <div class="contribution-list" style="max-height: 400px; overflow-y: auto; background: white; border-radius: 0.75rem; border: 1px solid var(--border);">
                             <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
                                <thead style="position: sticky; top: 0; background: var(--bg-body); border-bottom: 2px solid var(--border);">
                                    <tr>
                                        <th style="padding: 1rem; text-align: left;">Nombre</th>
                                        <th style="padding: 1rem; text-align: center;">Registros</th>
                                        <th style="padding: 1rem; text-align: center;">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${userStats.map(u => `
                                        <tr style="border-bottom: 1px solid var(--bg-body);">
                                            <td style="padding: 0.75rem 1rem;">${u.nombre || 'N/A'}</td>
                                            <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 600;">${u.count}</td>
                                            <td style="padding: 0.75rem 1rem; text-align: center; color: var(--text-muted);">
                                                ${totalPatients > 0 ? Math.round((u.count / totalPatients) * 100) : 0}%
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Distribución de Datos</h3>
                        <div style="height: 300px; display: flex; align-items: flex-end; gap: 2rem; padding: 2rem; border-bottom: 2px solid var(--border);">
                            <div style="flex: 1; background: var(--primary); height: 85%; border-radius: 4px 4px 0 0; position: relative;" title="Caucásico">
                                 <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Caucásico</div>
                            </div>
                            <div style="flex: 1; background: var(--secondary); height: 45%; border-radius: 4px 4px 0 0; position: relative;" title="Mestizo/Otros">
                                 <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Mestizo/Otros</div>
                            </div>
                            <div style="flex: 1; background: var(--accent); height: 15%; border-radius: 4px 4px 0 0; position: relative;" title="Afrodescendiente">
                                 <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.7rem;">Afro</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: var(--primary-light); color: var(--primary); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid var(--primary); margin-top: 2rem; font-size: 0.875rem;">
                    <strong>Información del Sistema:</strong> Los datos se actualizan automáticamente en tiempo real desde Firebase.
                </div>
            </div>
        `;
    }
};
