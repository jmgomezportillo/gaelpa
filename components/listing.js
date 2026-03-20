const PATIENT_EXPORT_MAP = {
    "marca_temporal": "Marca temporal",
    "investigador_principal": "Investigador Principal",
    "region": "Región",
    "paciente_id": "Nombre y Apellido (dos primeras letras del nombre y del apellido + 3 últimos números del DNI)",
    "dni": "DNI",
    "cod_postal": "Código Postal (del paciente en caso de no disponer del mismo, poner el del centro)",
    "telefono": "Teléfono",
    "email": "Correo Electrónico",
    "edad": "Edad",
    "genero": "Género",
    "peso": "Peso (Kg)",
    "altura": "Altura (Cm)",
    "tas": "TAS (mmHg)",
    "tad": "TAD (mmHg)",
    "raza_etnia": "Raza/etnia",
    "tabaquismo": "Tabaquismo",
    "diabetes": "Diabetes Mellitus",
    "hipertension": "Hipertensión arterial",
    "menopausia": "Menopausia",
    "hipotiroidismo": "Hipotiroidismo",
    "medicado_hipotiroidismo": "Medicado (Hipotiroidismo)",
    "enf_autoinmunes": "Enfermedades Autoinmunes - Inflamatorias",
    "hf": "Hipercolesterolemia Familiar",
    "af_ecv_precoz": "Antecedentes Heredofamiliares de ECV precoz (Mujer < 65 años - Hombre < 55)",
    "antec_isquemia": "Antecedentes Cardiopatía isquémica (IAM-ACV-AI-ATC-CRM)",
    "enf_art_periferica": "Enfermedad Arterial Periférica (Lesión carotídea > 50% o Revascularización carotídea. Arteriopatía periférica sintomática clínicamente significativa, y/o amputación o revascularización del miembro debido a isquémia o lesión >70%)",
    "acv_previo": "ACV isquémico previo",
    "ateromatosis": "Ateromatosis subclínica",
    "score_calcio": "Score de Calcio",
    "score_calcio_valor": "Score de Calcio Valor",
    "ateromatosis_carotidea": "Ateromatosis subclínica Carotídea",
    "ateromatosis_femoral": "Ateromatosis subclínica femoral",
    "estenosis_aortica": "Estenosis Aórtica",
    "hba1c": "Hba1c",
    "lpa": "Lp(a)",
    "lpa_unit": "Concentracion Lp (a) Unidades",
    "apob": "Apo B",
    "apob_unit": "Unidad de Apo B",
    "col_total": "Col total (mg/dL)",
    "hdl": "C-HDL (mg/dL)",
    "ldl": "c-LDL (mg/dL)",
    "trigliceridos": "TG (mg/dL)",
    "creatinina": "Creatinina (mg/dL)",
    "tsh": "TSH",
    "antiagregacion": "Antiagregación - ACO",
    "toma_estatina": "Toma Estatina",
    "estatina_tipo": "Cuál?",
    "estatina_dosis": "Dosis de acuerdo a la estatina utilizada",
    "niacina": "Niacina",
    "ezetimibe": "Ezetimibe",
    "acid_bempedoico": "Acido Bempedoico",
    "icosapento": "Icosapento de Etilo",
    "ipcsk9": "iPCSK9",
    "inclisiran": "Inclisiran"
};

const PatientListing = {
    render(container, patients, currentUser) {
        // Apply Row-Level Security: Medicos only see their own patients
        const visiblePatients = currentUser.rol === 'Administrador'
            ? patients
            : patients.filter(p => {
                const investigador = p.investigador_principal || p.original_investigador || p.doctor;
                return investigador === currentUser.nombre;
            });

        container.innerHTML = `
            <div class="listing-view">
                <div class="view-header">
                    <div>
                        <h2>${currentUser.rol === 'Administrador' ? 'Todos los Pacientes' : 'Mis Pacientes'}</h2>
                        <p>${visiblePatients.length} pacientes encontrados</p>
                    </div>
                    <div class="search-box">
                        <input type="text" id="patient-search" placeholder="Buscar por Nombre, Región o DNI...">
                        ${currentUser.rol === 'Administrador' ? `
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                <button id="export-patients-btn" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Exportar Pacientes</button>
                                <button id="export-users-btn" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Exportar Usuarios</button>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div id="patients-container">
                    ${this.renderList(visiblePatients.slice(0, 100))}
                </div>
                ${visiblePatients.length > 100 ? `
                    <div id="load-more-container" style="text-align: center; margin-top: 2rem;">
                        <button id="load-more-btn" class="btn-secondary">Mostrar todos los pacientes (${visiblePatients.length})</button>
                    </div>
                ` : ''}
            </div>
        `;

        const searchInput = document.getElementById('patient-search');
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = visiblePatients.filter(p => {
                const name = (p.paciente_id || p.name || "").toLowerCase();
                const region = (p.region || "").toLowerCase();
                const id = (p.id || "").toLowerCase();
                const dni = (p.dni || "").toLowerCase();
                return name.includes(query) || region.includes(query) || id.includes(query) || dni.includes(query);
            });
            const container = document.getElementById('patients-container');
            if (container) container.innerHTML = this.renderList(filtered.slice(0, 100));

            // Hide "load more" if searching
            const loadMore = document.getElementById('load-more-container');
            if (loadMore) loadMore.style.display = query ? 'none' : 'block';
        });

        document.getElementById('load-more-btn')?.addEventListener('click', (e) => {
            const container = document.getElementById('patients-container');
            if (container) container.innerHTML = this.renderList(visiblePatients);
            e.target.parentElement.style.display = 'none';
        });
    },

    attachExportEvents(patients, users) {
        document.getElementById('export-patients-btn')?.addEventListener('click', () => {
            this.exportToExcel(patients, 'Gaelpa_Pacientes_Completo', PATIENT_EXPORT_MAP);
        });

        document.getElementById('export-users-btn')?.addEventListener('click', () => {
            this.exportToExcel(users, 'Gaelpa_Usuarios');
        });
    },

    exportToExcel(data, filename, mapping = null) {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        try {
            let exportData = data;
            if (mapping) {
                exportData = data.map(record => {
                    const mapped = {};
                    Object.entries(mapping).forEach(([key, label]) => {
                        mapped[label] = record[key] || "S/D";
                    });
                    return mapped;
                });
            }

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Datos");

            // Generate filename with date
            const dateStr = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error al generar el archivo Excel.');
        }
    },

    renderList(patients) {
        if (App.state.isPatientsLoading) {
            return `
                <div style="text-align: center; padding: 4rem; background: white; border-radius: 1rem; color: var(--text-muted);">
                    <div class="spinner" style="margin: 0 auto 1rem;"></div>
                    <p>Descargando registros de pacientes (4,600+)...</p>
                </div>
            `;
        }

        if (patients.length === 0) {
            return `
                <div style="text-align: center; padding: 4rem; background: white; border-radius: 1rem; color: var(--text-muted);">
                    <p>No se encontraron pacientes registrados.</p>
                </div>
            `;
        }

        // Sort by timestamp (descending)
        const sorted = [...patients].sort((a, b) => {
            const tA = a.created_at || 0;
            const tB = b.created_at || 0;
            return tB - tA;
        });

        return sorted.map(p => {
            const name = p.paciente_id || p.name || p.id || "S/D";
            const age = p.edad || p.age || "S/D";
            const dni = p.dni || "";
            const lpa = p.lpa || "0";
            const unit = p.lpa_unit || p.unit || "mg/dl";
            const investigator = p.investigador_principal || p.original_investigador || p.doctor || "S/D";
            const region = p.region || "S/D";

            // Clean up possible "undefined" strings from old data
            const cleanStr = (val) => String(val).toLowerCase() === 'undefined' ? 'S/D' : val;

            return `
                <div class="patient-card fade-in">
                    <div class="patient-info">
                        <h4>${cleanStr(name)} ${dni && String(dni).toLowerCase() !== 'undefined' ? `<small style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">(DNI: ${dni})</small>` : ''}</h4>
                        <div class="patient-meta">
                            <span><strong>Región:</strong> ${cleanStr(region)}</span>
                            <span><strong>Edad:</strong> ${cleanStr(age)}</span>
                            <span><strong>Investigador:</strong> ${cleanStr(investigator)}</span>
                        </div>
                    </div>
                    <div class="patient-stats">
                        <div style="font-weight: 700; color: var(--primary); font-size: 1.25rem;">
                            ${lpa} <small>${unit}</small>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Lp(a)</div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
