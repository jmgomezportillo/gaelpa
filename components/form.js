const ClinicalForm = {
    render(container) {
        container.innerHTML = `
            <div class="form-view">
                <div class="view-header">
                    <h2>Registro de Nuevo Paciente</h2>
                    <p>Complete todos los campos del estudio Gaelpa (Estructura 2026.2)</p>
                </div>

                <form id="clinical-entry-form" class="clinical-form">
                    <!-- Section 1: Identificación y Demografía -->
                    <div class="form-section">
                        <h3><span class="section-number">1</span> Identificación y Demografía</h3>
                        <div class="grid-3">
                             <div class="form-group">
                                <label for="investigador">Investigador Principal</label>
                                <input type="text" id="investigador" value="${App.state.user.nombre}" readonly style="background: #f5f5f5; cursor: not-allowed;">
                            </div>
                            <div class="form-group">
                                <label for="region">Región</label>
                                <select id="region" required>
                                    <option value="">Seleccione...</option>
                                    <option>Región NOA (Coordina Dr. Aldo Prado)</option>
                                    <option>Región NEA (+ Santa Fe y Entre Rios - Coordina Dr. Juan Patricio Nogueira)</option>
                                    <option>Región Centro (Provincia Bs As - Coordina Dr. Santiago Lynch)</option>
                                    <option>Región Centro (CABA - Coordina Dr. Walter Masson)</option>
                                    <option>Región Cuyo (Coordina Dr. Sergio Gimenez)</option>
                                    <option>Región Patagónica (Coordina Dr. Juan Bautista Soumoulou)</option>
                                    <option>Córdoba (Coordina Dr. Alberto Lorenzatti)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="paciente_id">Nombre y Apellido (ID)*</label>
                                <input type="text" id="paciente_id" placeholder="2 letras nom + 2 letras ape + 3 DNI" required>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="dni">DNI</label>
                                <input type="text" id="dni">
                            </div>
                            <div class="form-group">
                                <label for="cod_postal">Código Postal</label>
                                <input type="number" id="cod_postal" required>
                            </div>
                            <div class="form-group">
                                <label for="telefono">Teléfono</label>
                                <input type="tel" id="telefono" required>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="email">Correo electrónico</label>
                                <input type="email" id="email">
                            </div>
                            <div class="form-group">
                                <label for="edad">Edad (años)*</label>
                                <input type="number" id="edad" required>
                            </div>
                            <div class="form-group">
                                <label for="genero">Género</label>
                                <select id="genero" required>
                                    <option value="">Seleccione...</option>
                                    <option>Femenino</option>
                                    <option>Masculino</option>
                                    <option>Otros</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="max-width: 32%;">
                            <label for="raza">Raza/etnia</label>
                            <select id="raza" required>
                                <option value="">Seleccione...</option>
                                <option>Blanco/Caucásico</option>
                                <option>Negro</option>
                                <option>Asiático</option>
                                <option>Hispánico Latino</option>
                                <option>Otros</option>
                            </select>
                        </div>
                    </div>

                    <!-- Section 2: Biometría -->
                    <div class="form-section">
                        <h3><span class="section-number">2</span> Biometría y Signos Vitales</h3>
                        <div class="grid-4">
                            <div class="form-group">
                                <label for="peso">Peso (Kg)</label>
                                <input type="number" id="peso" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="altura">Altura (Cm)</label>
                                <input type="number" id="altura" required>
                            </div>
                            <div class="form-group">
                                <label for="tas">TAS (mmHg)</label>
                                <input type="number" id="tas" required>
                            </div>
                            <div class="form-group">
                                <label for="tad">TAD (mmHg)</label>
                                <input type="number" id="tad" required>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Antecedentes -->
                    <div class="form-section">
                        <h3><span class="section-number">3</span> Antecedentes y Factores de Riesgo</h3>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="tabaquismo">Tabaquismo</label>
                                <select id="tabaquismo" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                    <option>Extabaquista</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="diabetes">Diabetes Mellitus</label>
                                <select id="diabetes" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si - Tipo 1</option>
                                    <option>Si - Tipo 2</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="hta">Hipertensión arterial</label>
                                <select id="hta" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="menopausia">Menopausia</label>
                                <select id="menopausia" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="hipotiroidismo">Hipotiroidismo</label>
                                <select id="hipotiroidismo" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-2">
                             <div class="form-group">
                                <label for="medicado_hipo">Medicado (Hipotiroidismo)</label>
                                <select id="medicado_hipo" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="hf_ecv">Hipercolest. Familiar</label>
                                <select id="hf_ecv" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Enfermedades Autoinmunes (Casillas)</label>
                            <div class="checkbox-group grid-3">
                                <label><input type="checkbox" name="autoinmune" value="HIV"> HIV</label>
                                <label><input type="checkbox" name="autoinmune" value="EII"> Enf. Inflamatoria intestinal</label>
                                <label><input type="checkbox" name="autoinmune" value="LES"> Colagenopatías (LES)</label>
                                <label><input type="checkbox" name="autoinmune" value="AR"> Artritis Reumatoidea</label>
                                <label><input type="checkbox" name="autoinmune" value="Psoriasis"> Psoriasis</label>
                                <label><input type="checkbox" name="autoinmune" value="Ninguna"> Ninguna</label>
                            </div>
                        </div>
                        <div class="grid-2">
                             <div class="form-group">
                                <label for="heredo_ecv">Ant. Heredofamiliares ECV precoz</label>
                                <select id="heredo_ecv" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                             <div class="form-group">
                                <label for="isquemia">Ant. Cardiopatía isquémica</label>
                                <select id="isquemia" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="art_periferica">Enfermedad Arterial Periférica</label>
                                <select id="art_periferica" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="acv_previo">ACV isquémico previo</label>
                                <select id="acv_previo" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Section 4: Ateromatosis -->
                    <div class="form-section">
                        <h3><span class="section-number">4</span> Ateromatosis y Score de Calcio</h3>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="ateromatosis">Ateromatosis subclínica</label>
                                <select id="ateromatosis" required>
                                    <option value="">Seleccione...</option>
                                    <option>No evaluada</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="sc_calcio">Score de Calcio</label>
                                <select id="sc_calcio" required>
                                    <option value="">Seleccione...</option>
                                    <option>No evaluada</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="sc_valor">Score de Calcio Valor</label>
                                <select id="sc_valor">
                                    <option value="">Seleccione...</option>
                                    <option>0</option>
                                    <option>1-10 UA</option>
                                    <option>11-100 UA</option>
                                    <option>101-300 UA</option>
                                    <option>+ 300 UA</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-3">
                             <div class="form-group">
                                <label for="ater_carotida">Aterom. subclínica Carotídea</label>
                                <select id="ater_carotida" required>
                                    <option value="">Seleccione...</option>
                                    <option>No evaluada</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="ater_femoral">Aterom. subclínica femoral</label>
                                <select id="ater_femoral" required>
                                    <option value="">Seleccione...</option>
                                    <option>No evaluada</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="estenosis_ao">Estenosis Aórtica</label>
                                <select id="estenosis_ao" required>
                                    <option value="">Seleccione...</option>
                                    <option>No evaluada</option>
                                    <option>Sin Valvulopatía</option>
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Severa</option>
                                    <option>Otra Valvulopatía</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Section 5: Laboratorio -->
                    <div class="form-section">
                        <h3><span class="section-number">5</span> Laboratorio</h3>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="hba1c">Hba1c (%)</label>
                                <input type="number" id="hba1c" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="lpa">Lp(a)</label>
                                <input type="number" id="lpa" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="lpa_unit">Unidades Lp(a)</label>
                                <select id="lpa_unit" required>
                                    <option value="">Seleccione...</option>
                                    <option>mg/dl</option>
                                    <option>nmol/l</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="apob">Apo B</label>
                                <input type="number" id="apob" step="0.1">
                            </div>
                            <div class="form-group">
                                <label for="apob_unit">Unidad Apo B</label>
                                <select id="apob_unit">
                                    <option value="">Seleccione...</option>
                                    <option>mg/dl</option>
                                    <option>g/l</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="col_total">Col total (mg/dL)</label>
                                <input type="number" id="col_total" required>
                            </div>
                        </div>
                        <div class="grid-4">
                            <div class="form-group">
                                <label for="hdl">C-HDL (mg/dL)</label>
                                <input type="number" id="hdl" required>
                            </div>
                            <div class="form-group">
                                <label for="ldl">c-LDL (mg/dL)</label>
                                <input type="number" id="ldl" required>
                            </div>
                            <div class="form-group">
                                <label for="tg">TG (mg/dL)</label>
                                <input type="number" id="tg" required>
                            </div>
                            <div class="form-group">
                                <label for="creatinina">Creatinina (mg/dL)</label>
                                <input type="number" id="creatinina" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-group" style="max-width: 25%;">
                            <label for="tsh">TSH</label>
                            <input type="number" id="tsh" step="0.01" required>
                        </div>
                    </div>

                    <!-- Section 6: Tratamiento -->
                    <div class="form-section">
                        <h3><span class="section-number">6</span> Tratamiento y Medicación</h3>
                        <div class="form-group">
                            <label>Antiagregación - ACO (Casillas)</label>
                            <div class="checkbox-group grid-3">
                                <label><input type="checkbox" name="antiagregacion" value="Aspirina"> Aspirina</label>
                                <label><input type="checkbox" name="antiagregacion" value="Clopidogrel"> Clopidogrel</label>
                                <label><input type="checkbox" name="antiagregacion" value="Prasugrel"> Prasugrel</label>
                                <label><input type="checkbox" name="antiagregacion" value="Ticagrelor"> Ticagrelor</label>
                                <label><input type="checkbox" name="antiagregacion" value="Acenocumarol"> Acenocumarol</label>
                                <label><input type="checkbox" name="antiagregacion" value="DOACs"> DOACs</label>
                                <label><input type="checkbox" name="antiagregacion" value="Ninguna"> Ninguna</label>
                            </div>
                        </div>
                        <div class="grid-3">
                            <div class="form-group">
                                <label for="estatina">Toma Estatina</label>
                                <select id="estatina" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="estatina_tipo">Cuál?</label>
                                <select id="estatina_tipo" required>
                                    <option value="">Seleccione...</option>
                                    <option>Ninguna</option>
                                    <option>Simvastatina</option>
                                    <option>Atorvastatina</option>
                                    <option>Rosuvastatina</option>
                                    <option>Pitavastatina</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="estatina_dosis">Dosis</label>
                                <select id="estatina_dosis" required>
                                    <option value="">Seleccione...</option>
                                    <option>Ninguna</option>
                                    <option>2</option><option>4</option><option>5</option>
                                    <option>10</option><option>20</option><option>40</option><option>80</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-4">
                            <div class="form-group">
                                <label for="niacina">Niacina</label>
                                <select id="niacina" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="ezetimibe">Ezetimibe</label>
                                <select id="ezetimibe" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="bempedoico">Ácido Bempedoico</label>
                                <select id="bempedoico" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="icosapento">Icosapento de Etilo</label>
                                <select id="icosapento" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="ipcsk9">iPCSK9</label>
                                <select id="ipcsk9" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="inclisiran">Inclisiran</label>
                                <select id="inclisiran" required>
                                    <option value="">Seleccione...</option>
                                    <option>No</option>
                                    <option>Si</option>
                                </select>
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
        document.getElementById('clinical-entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSave();
        });
    },

    getCheckedValues(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value).join(', ');
    },

    handleSave() {
        // Collect data according to CSV structure
        const now = new Date();
        const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const patient = {
            "marca_temporal": timestamp,
            "investigador_principal": document.getElementById('investigador').value.trim() || "S/D",
            "region": document.getElementById('region').value || "S/D",
            "paciente_id": document.getElementById('paciente_id').value.trim() || "S/D",
            "dni": document.getElementById('dni').value.trim() || "S/D",
            "cod_postal": document.getElementById('cod_postal').value.trim() || "S/D",
            "telefono": document.getElementById('telefono').value.trim() || "S/D",
            "email": document.getElementById('email').value.trim() || "S/D",
            "edad": document.getElementById('edad').value || "S/D",
            "genero": document.getElementById('genero').value || "S/D",
            "raza_etnia": document.getElementById('raza').value || "S/D",
            "peso": document.getElementById('peso').value || "S/D",
            "altura": document.getElementById('altura').value || "S/D",
            "tas": document.getElementById('tas').value || "S/D",
            "tad": document.getElementById('tad').value || "S/D",
            "tabaquismo": document.getElementById('tabaquismo').value || "S/D",
            "diabetes": document.getElementById('diabetes').value || "S/D",
            "hipertension": document.getElementById('hta').value || "S/D",
            "menopausia": document.getElementById('menopausia').value || "S/D",
            "hipotiroidismo": document.getElementById('hipotiroidismo').value || "S/D",
            "medicado_hipotiroidismo": document.getElementById('medicado_hipo').value || "S/D",
            "enf_autoinmunes": this.getCheckedValues('autoinmune') || "Ninguna",
            "hf": document.getElementById('hf_ecv').value || "S/D",
            "af_ecv_precoz": document.getElementById('heredo_ecv').value || "S/D",
            "antec_isquemia": document.getElementById('isquemia').value || "S/D",
            "enf_art_periferica": document.getElementById('art_periferica').value || "S/D",
            "acv_previo": document.getElementById('acv_previo').value || "S/D",
            "ateromatosis": document.getElementById('ateromatosis').value || "S/D",
            "score_calcio": document.getElementById('sc_calcio').value || "S/D",
            "score_calcio_valor": document.getElementById('sc_valor').value || "S/D",
            "ateromatosis_carotidea": document.getElementById('ater_carotida').value || "S/D",
            "ateromatosis_femoral": document.getElementById('ater_femoral').value || "S/D",
            "estenosis_aortica": document.getElementById('estenosis_ao').value || "S/D",
            "hba1c": document.getElementById('hba1c').value || "S/D",
            "lpa": document.getElementById('lpa').value || "S/D",
            "lpa_unit": document.getElementById('lpa_unit').value || "S/D",
            "apob": document.getElementById('apob').value || "S/D",
            "apob_unit": document.getElementById('apob_unit').value || "S/D",
            "col_total": document.getElementById('col_total').value || "S/D",
            "hdl": document.getElementById('hdl').value || "S/D",
            "ldl": document.getElementById('ldl').value || "S/D",
            "trigliceridos": document.getElementById('tg').value || "S/D",
            "creatinina": document.getElementById('creatinina').value || "S/D",
            "tsh": document.getElementById('tsh').value || "S/D",
            "antiagregacion": this.getCheckedValues('antiagregacion') || "Ninguna",
            "toma_estatina": document.getElementById('estatina').value || "S/D",
            "estatina_tipo": document.getElementById('estatina_tipo').value || "S/D",
            "estatina_dosis": document.getElementById('estatina_dosis').value || "S/D",
            "niacina": document.getElementById('niacina').value || "S/D",
            "ezetimibe": document.getElementById('ezetimibe').value || "S/D",
            "acid_bempedoico": document.getElementById('bempedoico').value || "S/D",
            "icosapento": document.getElementById('icosapento').value || "S/D",
            "ipcsk9": document.getElementById('ipcsk9').value || "S/D",
            "inclisiran": document.getElementById('inclisiran').value || "S/D",
            // Internal metadata
            id: timestamp.replace(/[/\s:]/g, '_'),
            doctor: App.state.user.nombre,
            original_investigador: document.getElementById('investigador').value.trim() || "S/D",
            created_at: firebase.database.ServerValue.TIMESTAMP
        };

        // Save to Firebase using "Marca temporal" as key (sanitized for path)
        const firebaseKey = patient.id;
        patientsRef.child(firebaseKey).set(patient)
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
