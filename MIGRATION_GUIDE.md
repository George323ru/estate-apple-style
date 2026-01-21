# Headless WordPress Migration - Walkthrough

We have successfully migrated your backend from Node.js/PostgreSQL to a Headless WordPress architecture.

## 🚀 Quick Start

1.  **Start the Environment**:
    ```bash
    docker-compose up -d
    ```
    This starts:
    *   **WordPress** (http://localhost:8000)
    *   **MySQL** (Database for WP)
    *   **Frontend** (http://localhost:8080) - *Note: If running `npm run dev` locally, use localhost:3000*
    *   *Legacy Backend/Postgres are still running but largely unused.*

2.  **Access WordPress Admin**:
    *   URL: http://localhost:8000/wp-admin
    *   User: `admin`
    *   Pass: `password`
    *   *Use this to add/edit Estates.*

3.  **Frontend**:
    *   Go to http://localhost:3000 (if running `npm run dev`).
    *   Navigate to **Home** or **Catalog**. You should see the test estates fetched from WordPress.
    *   **Login**: Use the `/login` page with the admin credentials above.

## 🏗 What Changed?

### 1. Backend Layer
*   **Replaced**: Node.js custom API -> **WordPress REST API**.
*   **New Services**:
    *   `src/services/wpApi.ts`: Handles all communication with WordPress.
    *   `estates-setup.php` (in WP): Automatically registers the **Estate** Post Type and **ACF Fields** (Price, Location, Specs, etc.).

### 2. Frontend Layer
*   **Refactored**: `Home.tsx`, `BuyPrimary.tsx`, `AdminDashboard.tsx` now pull data from WordPress.
*   **Authentication**: `Login.tsx` now authenticates against WordPress JWT.

### 3. Data Model
Your data is now stored in WordPress "Posts" of type `estates`.
*   **Admins**: Manage content via the user-friendly WP Dashboard.
*   **Developers**: Data is exposed via `http://localhost:8000/wp-json/wp/v2/estates`.

## ✅ Verification

We performed the following checks:
1.  **API Connectivity**: Validated that React can talk to WP API.
2.  **Data Write**: Created test estates via CLI/API.
3.  **Auth**: Verified JWT token generation for the `admin` user.

## 🔜 Next Steps
*   **Import Data**: Use "WP All Import" or a custom script to migrate your old CSV data fully into WordPress.
*   **Production**: When deploying, simply point `VITE_API_URL` to your production WordPress URL.
