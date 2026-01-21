# Headless WordPress Deployment Guide

## 1. Architecture Overview
*   **Frontend**: React (Static SPA) served via Nginx.
*   **Backend**: WordPress (Headless CMS) + MySQL.
*   **Connection**: Frontend talks to Backend via REST API (`/wp-json`).

## 2. Deploying Backend (WordPress)
1.  **Hosting**: Use a dedicated WordPress host (Beget, Timeweb) or a VPS.
2.  **Setup**:
    *   Install WordPress.
    *   Upload `estate-setup.php` to `wp-content/mu-plugins/`.
    *   Install Plugins: **ACF**, **JWT Authentication for WP-API**.
    *   Configure `wp-config.php` for JWT.
3.  **Domain**: Note your new URL (e.g., `https://api.my-estate.ru`).

## 3. Deploying Frontend (React)
1.  **Code**: Push your repository to GitHub.
2.  **Hosting**: Connect GitHub to your VPS/Docker Platform.
3.  **Configuration**:
    *   Your hosting will use the `Dockerfile` in the root.
    *   **CRITICAL**: Set the Environment Variable in your hosting panel:
        *   `VITE_API_URL` = `https://api.my-estate.ru/wp-json` (No trailing slash)

## 4. Troubleshooting
*   **CORS Error**: If the frontend cannot fetch data, check header settings in WordPress (JWT Auth plugin setup handles most of this).
*   **404 on Refresh**: The Nginx config in `Dockerfile` handles SPA routing (`try_files $uri /index.html`), so refresh should work.
