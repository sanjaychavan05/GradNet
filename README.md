# GradNet

> **Connecting AITM Across Generations**

GradNet is a robust, web-based alumni networking platform designed to bridge the gap between current students, faculty, and alumni. Built with a distinctive **Retro Terminal (Black & White)** aesthetic, it facilitates professional networking, mentorship, job sharing, and community discussions in real-time.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## Features

### Authentication & Onboarding

- **USN-based Login**: Secure authentication using University Serial Numbers
- **OTP Verification**: Email-based One-Time Password authentication powered by SendGrid
- **Pre-verified Student Database**: Ensures only authorized alumni and students can register
- **Profile Creation**: Custom handle selection and profile setup upon first login

### Social Feed & Interaction

- **Multimedia Posts**: Create posts with text, images, videos, and PDF attachments
- **Real-time Updates**: New posts appear instantly via Socket.io
- **Bookmarks**: Save interesting posts, jobs, or forum topics for later reference

### Job Portal

- **Job Board**: Alumni and faculty can post job openings and internships
- **Detailed Listings**: Includes salary range, job type, location, and application links
- **Search & Filter**: *(Planned)* Find relevant opportunities easily

### Discussion Forums

- **Categorized Discussions**: Organized forum categories (e.g., Tech, Career, General)
- **Threaded Topics**: Create topics within categories for focused discussions
- **Role-Based Access**: Only Admins and Faculty can create new forum categories

### Real-time Messaging

- **Private Chat**: Instant messaging between users
- **Inbox**: View conversation history and start new chats via user search
- **Socket.io Integration**: Instant message delivery and status updates

### Alumni Dashboard

- **Directory**: Searchable database of alumni by name or USN
- **Rich Profiles**: View graduation year, current company, bio, and social links (LinkedIn, GitHub, X)

---

## Tech Stack

### Frontend

- **Framework**: React (Vite)
- **UI Library**: Lucide icons, tailwindcss
- **Routing**: React Router DOM
- **Real-time**: Socket.io Client
- **Utilities**: React PDF, React Easy Crop, React Infinite Scroll Component

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via pg pool)
- **Real-time**: Socket.io
- **Authentication**: Express Session, Custom Middleware
- **File Handling**: Multer (Image/Document uploads)
- **Email Service**: Resend

---

## Project Structure

```
GradNet/
├── backend/                    # Express Server & API
│   ├── config/                 # DB and Email configuration
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth & Validation middleware
│   ├── models/                 # SQL Query abstractions
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic (Auth, Email)
│   └── index.js                # Entry point
│
├── frontend/                   # React Client
│   ├── src/
│   │   ├── assets/             # Images & Icons
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global state (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Main Application Pages
│   │   ├── services/           # API fetch wrappers
│   │   ├── styles/             # CSS 
│   │   └── App.jsx             # Main Component
│   └── vite.config.js          # Vite configuration
│
├── uploads/                    # Server-side file storage
├── .gitignore
└── package.json                # Root script for concurrent execution
```

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Resend API Key (for email services)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GradNet.git
cd GradNet
```

### 2. Database Setup

Create a PostgreSQL database named `gradnet` (or your preferred name).

Execute the SQL scripts to create the necessary tables:

- `users`
- `pre_verified_students`
- `otp_verifications`
- `events`
- `event_files`
- `bookmarks`
- `job_posts`
- `alumni_master_data`
- `forum_categories`
- `forum_topics`
- `forum_posts`
- `conversations`
- `conversation_participants`
- `messages`

### 3. Backend Configuration

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Port
PORT=3000

# Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=gradnet_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Session Secret
SESSION_SECRET=your_super_secret_key

# Email (SendGrid)
RESEND_API_KEY=your_resend_api_key
RESEND_EMAIL=your_verified_sender_email

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Frontend Configuration

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## Running the Application

### Concurrent Mode (Recommended)

Run both the backend and frontend concurrently from the root directory:

```bash
# From the root project directory
npm install
npm run dev
```

### Separate Mode

Alternatively, run them separately:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at **http://localhost:5173**

---

## Design System

GradNet features a **professional Modern Enterprise aesthetic**, focused on clarity, accessibility, and subtle visual depth.

---

## Typography

- **Primary Font:** Google Sans Flex (Sans-Serif)  
  Chosen for its clean, modern, and highly readable appearance.

- **Font Weights & Usage:**
  - **Bold:** Page titles, section headers
  - **Medium / Semibold:** Navigation, buttons, labels
  - **Regular:** Body content and long-form text

This weight hierarchy establishes clear visual structure and scannability.

---

## Color Palette

- **Adaptive Theme System:**  
  Implemented using CSS HSL variables:
  - `--background`
  - `--foreground`
  - `--card`
  - `--border`
  - `--primary`

- **Theme Modes:**
  - Native **Light** and **Dark** mode support
  - User preference persisted via `localStorage`

- **Primary Accent Color:**
  - Used for primary actions, active states, highlights, and identity badges
  - Reinforces brand identity while maintaining visual restraint

---

## Visual Style

- **Adaptive Layouts:**
  - Mobile-first, edge-to-edge layouts
  - Transitions to contained, card-based layouts on larger screens

- **Soft Professionalism:**
  - Consistent large border radii (`rounded-2xl`)
  - Applied to cards, modals, and profile identity elements

- **Glassmorphism:**
  - `backdrop-blur-md` effects on sticky headers and navigation
  - Adds depth without visual noise

- **Subtle Elevation:**
  - Thin, low-opacity borders (`border-border/50`)
  - Soft shadows instead of heavy outlines

---

## Motion & Interactions

- **Micro-interactions:**
  - Smooth scale, translate, and fade animations
  - Applied to modals, menus, buttons, and hover states

- **Transitions:**
  - Consistent easing and duration for a polished, responsive feel

---

## Iconography

- **Icon Set:** Lucide React
  - Clean, sharp, vector-based icons
  - Consistent stroke width and visual language across the applicatio

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Team Members

 - Sanjay Prakash Chavan
 - Satyanarayan Munje

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

For questions, suggestions, or support, please open an issue on the repository.

---

**HAPPY CODING! 🚀**
