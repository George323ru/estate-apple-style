const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'estate_db',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

const MOCK_PROPERTIES = [
    { title: "ЖК 'Футурист'", price: "15.5 млн ₽", image: "https://picsum.photos/1200/800?random=1", location: "Москва, ЦАО", specs: "2-к кв, 65 м²", tags: ["Бизнес", "Парк"] },
    { title: "Резиденция Холл", price: "22.1 млн ₽", image: "https://picsum.photos/1200/800?random=2", location: "Санкт-Петербург", specs: "3-к кв, 92 м²", tags: ["Премиум", "Вид"] },
    { title: "Квартал Событие", price: "11.2 млн ₽", image: "https://picsum.photos/1200/800?random=3", location: "Казань", specs: "1-к кв, 42 м²", tags: ["Комфорт"] },
    { title: "ЖК 'Акватория'", price: "18.9 млн ₽", image: "https://picsum.photos/1200/800?random=4", location: "Сочи", specs: "2-к кв, 58 м²", tags: ["Бизнес", "Море"] },
    { title: "ЖК 'Высота'", price: "14.5 млн ₽", image: "https://picsum.photos/1200/800?random=5", location: "Екатеринбург", specs: "2-к кв, 60 м²", tags: ["Центр"] },
];

const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        const client = await pool.connect();

        console.log('Creating tables...');

        // Estates Table - Updated for CSV Schema
        // We keep legacy columns (title, price, image, location, specs, tags) for frontend compatibility
        // and populate them from the new CSV columns where possible.
        await client.query(`
      DROP TABLE IF EXISTS estates;
      CREATE TABLE estates (
        id SERIAL PRIMARY KEY,
        -- Frontend required columns
        title TEXT,
        price TEXT,
        image TEXT,
        location TEXT DEFAULT 'Москва',
        specs TEXT,
        tags TEXT[],
        
        -- CSV columns
        jk_name TEXT,
        source_url TEXT,
        developer TEXT,
        deadline TEXT,
        buildings_for_sale TEXT,
        objects_for_sale TEXT,
        deadline_keys TEXT,
        registration TEXT,
        floors TEXT,
        house_type TEXT,
        finishing TEXT,
        parking TEXT,
        ceiling_height TEXT,
        contract_type TEXT,
        escrow_bank TEXT,
        payment_options TEXT,
        description TEXT,
        price_details_json JSONB,
        image_count INTEGER,
        image_urls TEXT[],
        local_folder TEXT,
        grid_price_info_json JSONB,
        
        -- Filter columns
        type TEXT,
        area NUMERIC,
        price_val NUMERIC,
        district TEXT,
        city TEXT
      );
    `);

        // Users Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

        // Seed Estates (Mock Data mapped to new schema)
        console.log('Seeding estates...');
        for (const prop of MOCK_PROPERTIES) {
            await client.query(
                `INSERT INTO estates (
          title, price, image, location, specs, tags, 
          jk_name, house_type,
          type, area, price_val, district, city
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    prop.title,
                    prop.price,
                    prop.image,
                    prop.location,
                    prop.specs,
                    prop.tags,
                    prop.title, // jk_name
                    'Квартира',  // house_type
                    'apartment', // type
                    60,          // area (mock)
                    15000000,    // price_val (mock)
                    'ЦАО',       // district (mock)
                    'Москва'     // city (mock)
                ]
            );
        }
        // Seed Admin User
        const usersRes = await client.query('SELECT COUNT(*) FROM users');
        if (parseInt(usersRes.rows[0].count) === 0) {
            console.log('Seeding admin user...');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('admin123', salt);
            await client.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
                ['admin', hash]
            );
        }

        console.log('Seeding complete!');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
