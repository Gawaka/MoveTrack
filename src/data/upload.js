import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function uploadData() {
    const rawData = fs.readFileSync('db.json');
    const data = JSON.parse(rawData);

    if (data.exercises) {
        console.log('--- Початок завантаження вправ ---');
        for (const exercise of data.exercises) {
            const docRef = db.collection('exercises').doc(exercise.id);
            await docRef.set(exercise);
            console.log(`Успішно завантажено вправу: [${exercise.id}] ${exercise.name}`);
        }
    }

    if (data.equipment) {
        console.log('\n--- Початок завантаження інвентарю ---');
        for (const item of data.equipment) {
            const docRef = db.collection('equipment').doc(item.id);
            await docRef.set(item);
            console.log(`Успішно завантажено інвентар: [${item.id}] ${item.name}`);
        }
    }

    console.log('\nУсі дані успішно імпортовано!');
}

uploadData().catch(console.error);
