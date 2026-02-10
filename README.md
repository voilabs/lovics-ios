<img src="./lovics_header.png" alt="Lovics Header">

<p align="center">
<strong>Privacy-First, End-to-End Encrypted Cloud Storage Solution</strong>
</p>

<p align="center">
<a href="#features">Features</a> •
<a href="#architecture--security">Architecture</a> •
<a href="#tech-stack">Tech Stack</a> •
<a href="#getting-started">Getting Started</a>
</p>

---

## 📖 About

**Lovics** is a secure file vault application built on a **Zero-Knowledge** architecture. Unlike traditional cloud storage providers, Lovics ensures that your files are encrypted **before** they ever leave your device.

The server only stores encrypted, meaningless binary chunks. Your encryption keys are generated and stored exclusively on your device, meaning we cannot see, read, or access your data—even if we wanted to.

## Features

### Security & Privacy

- **Zero-Knowledge Architecture:** The Master Key is never sent to the server in plain text. Decryption occurs strictly on the user's device.
- **Client-Side Encryption:** All files are encrypted using **AES-256-GCM** before upload.
- **PBKDF2 Key Derivation:** User passwords are hardened with **310,000 iterations** of SHA-256 to prevent brute-force attacks.
- **Root & Jailbreak Detection:** Prevents the app from running on compromised devices (via `jail-monkey`).
- **Screen Capture Protection:** Sensitive content is hidden from screenshots and screen recording (via `expo-screen-capture`).

### Core Features

- **Vault Management:** Create, delete, and customize vaults with icons, colors, and themes.
- **Member Management:** Securely invite users to your private vaults via email. Manage owner and member roles.
- **Media Support:** Encrypted upload and playback for images and videos. Custom media viewer with zoom/pan support.
- **Favorites & Search:** Quickly access important vaults and search through your encrypted content.
- **Internationalization (i18n):** Fully localized in **Turkish (tr-TR)** and **English (en-US)**.

### Performance & Usability

- **Stream Encryption:** Large files are encrypted and uploaded in chunks (Multipart Upload), keeping RAM usage low.
- **Metadata Obfuscation:** File names, MIME types, and folder structures are fully encrypted.
- **Secure Sharing:** Share vaults securely using public-key cryptography (RSA/ECC) without exposing the Master Key.
- **Modern UI:** Built with **HeroUI** and **Uniwind** for a native, responsive experience.

## Architecture & Security

Lovics employs a hybrid encryption model detailed in `apps/mobile/src/lib/encrypter.ts`:

1. **KEK (Key Encryption Key):** Derived from the user's password using `PBKDF2` (SHA-256, 310,000 iterations, random 16-byte salt).
2. **DEK (Data Encryption Key / Master Key):** A random 32-byte key generated for each vault. This is the actual key used to encrypt files via **AES-256-GCM**.
3. **Envelope Encryption:** The DEK is encrypted (wrapped) with the KEK and stored on the server. The server never sees the raw DEK.
4. **Identity:** User identity includes public/private key pairs managed via `Better Auth` extensions (`encryptedPrivateKey`, `publicKey`).

## Tech Stack

### Backend (`apps/server`)

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [ElysiaJS](https://elysiajs.com/)
- **Database:** PostgreSQL (with Drizzle ORM & Drizzle Kit)
- **Authentication:** [Better Auth](https://www.better-auth.com/) (with Expo plugin)
- **Storage:** AWS S3 SDK (Configured for DigitalOcean Spaces)
- **Caching/Rate Limit:** Redis

### Mobile (`apps/mobile`)

- **Framework:** React Native, Expo (Managed Workflow), Expo Router
- **Cryptography:** `react-native-quick-crypto` (High performance C++ binding)
- **Styling:** `uniwind` (Tailwind CSS for RN), `heroui-native`
- **Security:** `jail-monkey`, `expo-secure-store`
- **Internationalization:** `i18next`, `react-i18next`
- **Media:** `expo-video`, `react-native-image-viewing`

### Web (`apps/web`)

- _Currently planning._

## Getting Started

### 1. Server Setup

Prerequisites: **Bun**, **PostgreSQL**, **Redis**.

```bash
cd apps/server

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env

```

**Required `.env` Variables:**

```env
# Database & Cache
DATABASE_URL="postgresql://user:password@localhost:5432/lovics_db"
REDIS_URL="redis://localhost:6379"
BASE_URL="http://localhost:3000"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="generate_a_secure_random_string"
BETTER_AUTH_BASE_URL="http://localhost:3000"

# Storage (DigitalOcean Spaces / S3)
SPACES_ACCESS_KEY="your_do_access_key"
SPACES_SECRET_KEY="your_do_secret_key"
# Endpoint is hardcoded to fra1.digitaloceanspaces.com in s3.ts, modify if needed.

# Email Sending
RESEND_API_KEY="re_"

```

```bash
# Run Database Migrations
bun run db:up

# Start Development Server (Watch Mode)
bun run dev

# Start Production Server
bun run prod

```

### 2. Mobile Setup

Prerequisites: **Node.js**, **Expo CLI**.

```bash
cd apps/mobile

# Install dependencies
npm install

# Configure API Endpoint
# Create .env inside the mobile root

```

```bash
# Start the App
npx expo start

# Run on Android/iOS
npx expo run:android
npx expo run:ios

```

## 📄 License

For license details, please see the [LICENSE](./LICENSE) file.
