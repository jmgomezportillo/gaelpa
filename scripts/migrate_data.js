const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin initialization
// Since I don't have a service account key file, I'll use the public config if possible, 
// but usually admin requires a service account. 
// However, the user mentioned they haven't loaded it. 
// I will create a script that uses the provided Firebase Config manually.

const firebaseConfig = {
    apiKey: "AIzaSyBzB-dLZnskB3_xqeHw77bCHpDSfWLRcsc",
    authDomain: "gaelpa-efba4.firebaseapp.com",
    databaseURL: "https://gaelpa-efba4-default-rtdb.firebaseio.com",
    projectId: "gaelpa-efba4",
    storageBucket: "gaelpa-efba4.firebasestorage.app",
    messagingSenderId: "596533202803",
    appId: "1:596533202803:web:cba27b1316630819d5bf06",
};

// For a Node.js script without a service account, we can use the regular firebase package (v9+)
// as long as we are not using the Admin SDK functions. 
// But let's simplify: I will use 'https' to push data directly to the REST API of Firebase RTDB.
// This is the most robust way to do a quick migration without dependency hell.

const https = require('https');

const REQUIRED_FIELDS = [
    "investigador_principal", "region", "paciente_id", "cod_postal", "telefono",
    "edad", "genero", "raza_etnia", "peso", "altura", "tas", "tad",
    "tabaquismo", "diabetes", "hipertension", "menopausia", "hipotiroidismo",
    "medicado_hipotiroidismo", "enf_autoinmunes", "hf", "af_ecv_precoz",
    "antec_isquemia", "enf_art_periferica", "acv_previo", "ateromatosis",
    "score_calcio", "ateromatosis_carotidea", "ateromatosis_femoral",
    "estenosis_aortica", "lpa", "lpa_unit", "col_total", "hdl", "ldl",
    "trigliceridos", "creatinina", "tsh", "antiagregacion", "toma_estatina",
    "estatina_tipo", "estatina_dosis", "niacina", "ezetimibe", "acid_bempedoico",
    "icosapento", "ipcsk9", "inclisiran"
];

const CSV_PATH = path.join(__dirname, '..', 'Datos.csv');

function pushToFirebase(id, data) {
    return new Promise((resolve, reject) => {
        const url = `${firebaseConfig.databaseURL}/gaelpa/patients/${id}.json?auth=${firebaseConfig.apiKey}`;
        // Note: RTDB REST API usually needs a secret or token for auth, 
        // but if rules are open for testing, this might work. 
        // Given this is a local migration, I'll use a PUT request.

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(`${firebaseConfig.databaseURL}/gaelpa/patients/${id}.json`, options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve();
            } else {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        });

        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

async function runMigration() {
    console.log("Reading Datos.csv...");
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = content.split('\n');

    let migratedCount = 0;
    let sanitizedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = [];
        let current = "";
        let inQuotes = false;
        for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        if (values.length < 50) continue;

        const rawData = {
            marca_temporal: values[0],
            investigador_principal: values[1],
            region: values[2],
            paciente_id: values[3],
            dni: values[4],
            cod_postal: values[5],
            telefono: values[6],
            email: values[7],
            edad: values[8],
            genero: values[9],
            peso: values[10],
            altura: values[11],
            tas: values[12],
            tad: values[13],
            raza_etnia: values[14],
            tabaquismo: values[15],
            diabetes: values[16],
            hipertension: values[17],
            menopausia: values[18],
            hipotiroidismo: values[19],
            medicado_hipotiroidismo: values[20],
            enf_autoinmunes: values[21],
            hf: values[22],
            af_ecv_precoz: values[23],
            antec_isquemia: values[24],
            enf_art_periferica: values[25],
            acv_previo: values[26],
            ateromatosis: values[27],
            score_calcio: values[28],
            score_calcio_valor: values[29],
            ateromatosis_carotidea: values[30],
            ateromatosis_femoral: values[31],
            estenosis_aortica: values[32],
            hba1c: values[33],
            lpa: values[34],
            lpa_unit: values[35],
            apob: values[36],
            apob_unit: values[37],
            col_total: values[38],
            hdl: values[39],
            ldl: values[40],
            trigliceridos: values[41],
            creatinina: values[42],
            tsh: values[43],
            antiagregacion: values[44],
            toma_estatina: values[45],
            estatina_tipo: values[46],
            estatina_dosis: values[47],
            niacina: values[48],
            ezetimibe: values[49],
            acid_bempedoico: values[50],
            icosapento: values[51],
            ipcsk9: values[52],
            inclisiran: values[53]
        };

        // Sanitization
        for (const key in rawData) {
            if (REQUIRED_FIELDS.includes(key)) {
                if (!rawData[key] || rawData[key] === ".") {
                    rawData[key] = "S/D";
                    sanitizedCount++;
                }
            }
        }

        if (!rawData.investigador_principal || rawData.investigador_principal === "S/D") {
            rawData.investigador_principal = "S/D";
        }

        const id = rawData.marca_temporal.replace(/[\.\#\$\/\[\]]/g, "_");

        try {
            await pushToFirebase(id, rawData);
            migratedCount++;
            if (migratedCount % 50 === 0) console.log(`Uploaded ${migratedCount} patients...`);
        } catch (err) {
            console.error(`Error uploading ${id}: ${err.message}`);
        }
    }

    console.log("Migration finished!");
    console.log(`Patients migrated: ${migratedCount}`);
    console.log(`Fields sanitized: ${sanitizedCount}`);
}

runMigration();
