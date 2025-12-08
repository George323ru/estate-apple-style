const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Setup
const upload = multer({ dest: 'uploads/' });

// Database Connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'estate_db',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.json({
            status: 'ok',
            message: 'Backend is running and connected to DB',
            time: result.rows[0].now
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Backend is running but DB connection failed',
            error: err.message
        });
    }
});

// --- AUTHENTICATION ---

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- ESTATES API ---

// Get all estates
app.get('/api/estates', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM estates ORDER BY id ASC');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching estates:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV (Protected)
app.post('/api/estates/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const client = await pool.connect();

                // Clear existing data before upload? 
                // User didn't explicitly ask to clear, but usually bulk upload implies replace or append.
                // Let's append for now to be safe, or maybe we should truncate?
                // Given the schema change, we probably started empty anyway.

                for (const row of results) {
                    // Parse complex fields
                    let imageUrls = [];
                    try {
                        // Try parsing as JSON array
                        imageUrls = JSON.parse(row.image_urls.replace(/'/g, '"')); // simple fix for single quotes
                    } catch (e) {
                        // Fallback: split by comma or just use as single string
                        imageUrls = row.image_urls ? row.image_urls.split(',').map(s => s.trim()) : [];
                    }

                    let tags = [];
                    if (row.house_type) tags.push(row.house_type);
                    if (row.finishing) tags.push(row.finishing);

                    // Map to DB Schema
                    const estateData = {
                        // Frontend columns
                        title: row.jk_name || 'Без названия',
                        price: 'По запросу', // Placeholder, logic to extract from JSON can be added later
                        image: imageUrls.length > 0 ? imageUrls[0] : 'https://placehold.co/600x400?text=No+Image',
                        location: 'Москва', // Default
                        specs: `${row.house_type || ''} ${row.floors ? row.floors + ' эт.' : ''}`.trim(),
                        tags: tags,

                        // CSV columns
                        jk_name: row.jk_name,
                        source_url: row.source_url,
                        developer: row.developer,
                        deadline: row.deadline,
                        buildings_for_sale: row.buildings_for_sale,
                        objects_for_sale: row.objects_for_sale,
                        deadline_keys: row.deadline_keys,
                        registration: row.registration,
                        floors: row.floors,
                        house_type: row.house_type,
                        finishing: row.finishing,
                        parking: row.parking,
                        ceiling_height: row.ceiling_height,
                        contract_type: row.contract_type,
                        escrow_bank: row.escrow_bank,
                        payment_options: row.payment_options,
                        description: row.description,
                        price_details_json: row.price_details_json, // Pass as string, PG handles JSONB
                        image_count: parseInt(row.image_count) || 0,
                        image_urls: imageUrls,
                        local_folder: row.local_folder,
                        grid_price_info_json: row.grid_price_info_json,

                        // Filter fields
                        type: 'apartment', // Default to apartment for now
                        area: null, // Can be extracted from specs or grid_price_info_json later
                        price_val: null, // Can be extracted from price_details_json later
                        district: null,
                        city: 'Москва' // Default
                    };

                    await client.query(
                        `INSERT INTO estates (
              title, price, image, location, specs, tags,
              jk_name, source_url, developer, deadline, buildings_for_sale, objects_for_sale,
              deadline_keys, registration, floors, house_type, finishing, parking, ceiling_height,
              contract_type, escrow_bank, payment_options, description, price_details_json,
              image_count, image_urls, local_folder, grid_price_info_json,
              type, area, price_val, district, city
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10, $11, $12,
              $13, $14, $15, $16, $17, $18, $19,
              $20, $21, $22, $23, $24,
              $25, $26, $27, $28,
              $29, $30, $31, $32, $33
            )`,
                        [
                            estateData.title, estateData.price, estateData.image, estateData.location, estateData.specs, estateData.tags,
                            estateData.jk_name, estateData.source_url, estateData.developer, estateData.deadline, estateData.buildings_for_sale, estateData.objects_for_sale,
                            estateData.deadline_keys, estateData.registration, estateData.floors, estateData.house_type, estateData.finishing, estateData.parking, estateData.ceiling_height,
                            estateData.contract_type, estateData.escrow_bank, estateData.payment_options, estateData.description, estateData.price_details_json,
                            estateData.image_count, estateData.image_urls, estateData.local_folder, estateData.grid_price_info_json,
                            estateData.type, estateData.area, estateData.price_val, estateData.district, estateData.city
                        ]
                    );
                }

                client.release();
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.json({ message: `Successfully uploaded ${results.length} properties` });
            } catch (err) {
                console.error('CSV processing error:', err);
                res.status(500).json({ error: 'Failed to process CSV' });
            }
        });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
