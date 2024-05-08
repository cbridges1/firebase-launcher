require('dotenv').config();

const fs = require('fs');

const address = "0.0.0.0";

let file = { 
    firestore: {
        rules: "firestore.rules",
        indexes: "firestore.indexes.json"
    },
    storage: {
        rules: "storage.rules"
    },
    emulators: {
        auth: {
            host: address,
            port: process.env.AUTH_PORT
        },
        storage: {
            host: address,
            port: process.env.STORAGE_PORT
        },
        firestore: {
            host: address,
            port: process.env.FIRESTORE_PORT
        },
        ui: {
            enabled: true,
            host: address,
            port: process.env.UI_PORT
        },
        singleProjectMode: true
    }
};
 
let data = JSON.stringify(file, null, 2);
fs.writeFileSync('firebase.json', data);