/**
 * Clinical Form Component - 50 Data Entry Fields
 */

const ClinicalForm = {
    render(container) {
        container.innerHTML = `
            <div class="form-view">
                <div class="view-header">
                    <h2>Registro de Nuevo Paciente</h2>
                    <p>Complete todos los campos del estudio Gaelpa</p>
                </div>

                <form id="clinical-entry-form" class="clinical-form">
                    <!-- Section 1: Identificación -->
                    <div class="form-section">
                        <h3><span class="section-number">1</span> Identificación y Demografía</h3>
                        <div class="grid-3">
                             <div class="form-group">
                                <label for="investigador">Investigador Principal*</label>
                                <select id="investigador" required>
                                    <option value="">Seleccione...</option>
                                    <option>Aranguren Florencia</option>
                                    <option>Garcia Zamora Sebastian</option>
                                    <option>Lozada Andrea</option>
                                    <option>Masson Walter</option>
                                    <option>Vitrella Gabriel</option>
                                    <option>Waitman Pablo</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="region">Región</label>
                                <select id="region">
                                    <option value="">Seleccione...</option>
                                    <option>NOA</option><option>NEA</option>
                                    <option>Centro Prov BsAs</option><option>Centro CABA</option>
                                    <option>Cuyo</option><option>Patagónica</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="paciente_id">ID Paciente (Initials+DNI)*</label>
                                <input type="text" id="paciente_id" placeholder="Ex: JGP123" required>
                                <small>Primeras 2 nombre, 2 apellido, últimos 3 DNI</small>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="telefono">Teléfono*</label>
                                <input type="tel" id="telefono" required>
                            </div>
                            <div class="form-group">
                                <label for="email_paciente">Email</label>
                                <input type="email" id="email_paciente">
                            </div>
                            <div class="form-group">
                                <label for="edad">Edad*</label>
                                <input type="number" id="edad" required>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="genero">Género</label>
                                <select id="genero">
                                    <option>Femenino</option>
                                    <option>Masculino</option>
                                    <option>Otros</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="raza">Raza</label>
                                <select id="raza">
                                    <option>Blanco/Caucásico</option>
                                    <option>Negro</option>
                                    <option>Asiático</option>
                                    <option>Indígena Americano</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Biometría -->
                    <div class="form-section">
                        <h3><span class="section-number">2</span> Antropometría y Signos Vitales</h3>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="peso">Peso (kg)*</label>
                                <input type="number" id="peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="altura">Altura (cm)*</label>
                                <input type="number" id="altura" required>
                            </div>
                            <div class="form-group">
                                <label for="bmi">BMI (Calculado)</label>
                                <input type="text" id="bmi" readonly style="background: #f1f5f9; font-weight: bold;">
                            </div>
                        </div>
                        <div class="grid-2">
                             <div class="form-group">
                                <label for="tas">Presión Arterial Sistólica (TAS)*</label>
                                <input type="number" id="tas" required>
                            </div>
                            <div class="form-group">
                                <label for="tad">Presión Arterial Diastólica (TAD)*</label>
                                <input type="number" id="tad" required>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Laboratorio -->
                    <div class="form-section">
                        <h3><span class="section-number">3</span> Perfil Lipídico y Laboratorio</h3>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="lpa_val">Concentración Lp(a)</label>
                                <input type="number" id="lpa_val" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="lpa_unit">Unidades Lp(a)</label>
                                <select id="lpa_unit">
                                    <option>mg/dl</option>
                                    <option>nmol/l</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="col_total">Colesterol Total (mg/dl)</label>
                                <input type="number" id="col_total">
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="ldl">LDL (mg/dl)</label>
                                <input type="number" id="ldl">
                            </div>
                            <div class="form-group">
                                <label for="hdl">HDL (mg/dl)</label>
                                <input type="number" id="hdl">
                            </div>
                            <div class="form-group">
                                <label for="trigliceridos">Triglicéridos (mg/dl)</label>
                                <input type="number" id="trigliceridos">
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="reset" class="btn-secondary">Limpiar Formulario</button>
                        <button type="submit" class="btn-primary" style="width: auto; padding: 0.875rem 3rem;">Guardar Registro</button>
                    </div>
                </form>
            </div>
        `;

        this.attachLogic();
    },

    attachLogic() {
        const pesoInput = document.getElementById('peso');
        const alturaInput = document.getElementById('altura');
        const bmiInput = document.getElementById('bmi');

        const calculateBMI = () => {
            const peso = parseFloat(pesoInput.value);
            const altura = parseFloat(alturaInput.value) / 100; // cm to m
            if (peso > 0 && altura > 0) {
                const bmi = (peso / (altura * altura)).toFixed(2);
                bmiInput.value = bmi;
            } else {
                bmiInput.value = '';
            }
        };

        pesoInput.addEventListener('input', calculateBMI);
        alturaInput.addEventListener('input', calculateBMI);

        document.getElementById('clinical-entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSave();
        });
    },

    handleSave() {
        // Collect data
        const id = `patient_${Date.now()}`;
        const patient = {
            id: id,
            name: document.getElementById('paciente_id').value,
            doctor: App.state.user.nombre,
            original_investigador: App.state.user.nombre,
            age: document.getElementById('edad').value,
            lpa: document.getElementById('lpa_val').value,
            unit: document.getElementById('lpa_unit').value,
            bmi: document.getElementById('bmi').value,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        // Save to Firebase
        patientsRef.child(id).set(patient)
            .then(() => {
                App.state.patients.push(patient);
                alert('Registro guardado exitosamente en la nube');
                App.switchView('list');
            })
            .catch(error => {
                console.error('Error saving to Firebase:', error);
                alert('Error al guardar en la nube. Verifique su conexión.');
            });
    }
};
