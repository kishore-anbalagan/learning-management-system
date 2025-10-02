const express = require('express')
const app = express();

// packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// connection to DB and cloudinary
const { connectDB } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');
const dashboardRoutes = require('./routes/dashboard');
const demoContentRoutes = require('./routes/demoContent');
const catalogRoutes = require('./routes/catalog');


// middleware 
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(
    cors({
        // origin: 'http://localhost:5173', // frontend link
        origin: "*",
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)


const DEFAULT_PORT = 4000;
const PORT = process.env.PORT || DEFAULT_PORT;
const MAX_PORT = 65535;
const MAX_PORT_ATTEMPTS = 10;

// Function to start server with port conflict handling
const startServer = (port, attempt = 1) => {
    // Ensure port is a number and within valid range
    port = parseInt(port, 10);
    if (isNaN(port) || port < 0 || port >= MAX_PORT) {
        port = DEFAULT_PORT;
    }

    const server = app.listen(port)
        .on('listening', () => {
            console.log(`Server Started Successfully on PORT ${port}`);
            
            // connections
            connectDB();
            cloudinaryConnect();
        })
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE' && attempt <= MAX_PORT_ATTEMPTS) {
                // Try the next port (ensure it's within range)
                const nextPort = port + 1 < MAX_PORT ? port + 1 : DEFAULT_PORT;
                console.log(`Port ${port} is busy, trying port ${nextPort}...`);
                server.close();
                startServer(nextPort, attempt + 1);
            } else {
                console.error('Server failed to start:', err);
            }
        });
};

// Start the server
startServer(PORT);

// mount route
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/demo', demoContentRoutes);
app.use('/api/v1/catalog', catalogRoutes);




// Default Route
app.get('/', (req, res) => {
    // console.log('Your server is up and running..!');
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
})