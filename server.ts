import express from 'express';
import { join } from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname, 'dist')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.get('/:name', (req, res) => {
    res.sendFile(join(__dirname, `${req.params.name}.json`));
})

// Start the server
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));