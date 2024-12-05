// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdf3kFzWrNkTq9bp0gzYYQJz8opFjksLE",
    authDomain: "sample-firebase-ai-app-525fc.firebaseapp.com",
    databaseURL: "https://sample-firebase-ai-app-525fc-default-rtdb.firebaseio.com",
    projectId: "sample-firebase-ai-app-525fc",
    storageBucket: "sample-firebase-ai-app-525fc.firebasestorage.app",
    messagingSenderId: "1050232474601",
    appId: "1:1050232474601:web:1614494c278cd6e3b2d978"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const drawingsRef = database.ref('drawings');

// Get the canvas and set its size
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up initial drawing state
let drawing = false;
let lastX = 0;
let lastY = 0;
let color = 'black';
let size = 5;

// Set up mouse event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Start drawing
function startDrawing(e) {
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

// Draw on canvas and save the data to Firebase
function draw(e) {
    if (!drawing) return;
    const x = e.clientX;
    const y = e.clientY;

    // Draw on the local canvas
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Save the drawing data to Firebase
    saveDrawing(lastX, lastY, x, y, color, size);

    // Update last position
    lastX = x;
    lastY = y;
}

// Stop drawing
function stopDrawing() {
    drawing = false;
}

// Save drawing to Firebase
function saveDrawing(x1, y1, x2, y2, color, size) {
    const newDrawingRef = drawingsRef.push();
    newDrawingRef.set({
        x1, y1, x2, y2, color, size, timestamp: Date.now()
    });
}

// Sync new drawings from Firebase in real-time
drawingsRef.on('child_added', function(snapshot) {
    const drawing = snapshot.val();
    drawOnCanvas(drawing.x1, drawing.y1, drawing.x2, drawing.y2, drawing.color, drawing.size);
});

// Draw on canvas from Firebase data
function drawOnCanvas(x1, y1, x2, y2, color, size) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
}
