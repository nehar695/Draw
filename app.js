// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onChildAdded } from "firebase/database";

// Your Firebase configuration (from the Firebase Console)
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to the 'drawings' data in Firebase
const drawingsRef = ref(db, 'drawings');

// Get a reference to the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to save drawing data to Firebase
function saveDrawingData(x, y, color) {
  const newDrawingRef = push(drawingsRef);
  set(newDrawingRef, {
    x: x,
    y: y,
    color: color,
    timestamp: Date.now() // Store the timestamp for ordering events
  });
}

// Function to draw on the canvas
function drawOnCanvas(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2); // Draw a small circle (adjust size if needed)
  ctx.fill();
}

// Listen for drawing data updates in Firebase in real-time
onChildAdded(drawingsRef, (data) => {
  const drawing = data.val();
  drawOnCanvas(drawing.x, drawing.y, drawing.color);
});

// Event listener for user drawing on the canvas
canvas.addEventListener('mousemove', (event) => {
  if (event.buttons !== 1) return; // Only draw when the mouse button is held down
  
  const x = event.offsetX;
  const y = event.offsetY;
  const color = 'red'; // Set color (you could dynamically change this based on user input)

  // Save drawing data to Firebase
  saveDrawingData(x, y, color);
  
  // Draw immediately on the canvas for the local user
  drawOnCanvas(x, y, color);
});
