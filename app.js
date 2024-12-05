// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onChildAdded } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = 'black';

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e);
        sendDrawing(e.clientX, e.clientY, currentColor);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

function draw(e) {
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 5, 0, Math.PI * 2);
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function sendDrawing(x, y, color) {
    push(ref(db, 'drawings/'), {
        x: x,
        y: y,
        color: color
    });
}

// Listen for drawing events
onChildAdded(ref(db, 'drawings'), (data) => {
    const point = data.val();
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc(point.x - rect.left, point.y - rect.top, 5, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.fill();
});

function changeColor(color) {
    currentColor = color;
}
