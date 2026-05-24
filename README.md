<div align="center">
  <div style="background-color: #F26522; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: white; margin-bottom: 20px;">
    SO
  </div>

  <h1>Smart Offers Platform</h1>
  <p><strong>A cinematic, Awwwards-worthy booking & reservation SaaS platform.</strong></p>

  <p>
    <b>🌍 Website Live Link:</b> <a href="https://smart-offer-willovate.vercel.app">https://smart-offer-willovate.vercel.app</a>
  </p>

  <br />

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

<br />

## 🌟 Overview

Smart Offers is a premium, frictionless platform designed to bridge the gap between businesses and consumers for limited-time experiences. We strip away the complexity of traditional reservation systems and replace it with a hyper-fluid, dynamic cinematic interface.

### The Flow
* **For Customers:** Publicly browse curated active offers, view real-time capacities, and instantly reserve a time slot seamlessly. No sign-up wall required.
* **For Businesses:** A secured, authenticated dashboard to track real-time bookings, manage campaigns, and instantly create beautiful new offers.

---

## ✨ Key Features

* **Cinematic Aesthetics:** Custom WebGL shaders, CSS marquees, smooth micro-animations, and a cohesive pastel-peach (`#FEF2ED`) and vibrant orange (`#F26522`) color palette.
* **Frictionless Booking System:** Intelligent state-management dynamically updates slot availability and prevents double bookings.
* **Fallbacks & Resiliency:** Integrated smart fallback data ensures the UI never breaks, allowing for a flawless presentation even if the database is unseeded.
* **Role-Based Access Control:** Strict architectural boundaries between standard public consumers and authenticated Business Partners. 
* **Dynamic Dashboards:** Business Partners can launch new offers, inject custom cover image URLs, and monitor their active customer bookings in real-time.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 + Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS + Vanilla CSS (for advanced keyframe animations)
* **Icons:** Lucide React
* **Backend / Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth (Email / Password)

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) (v20.19+ or v22.12+) installed on your machine.

### 1. Clone & Install
```bash
git clone https://github.com/yashkatari/smart-offer-willovate.git
cd smart-offer-willovate/frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `frontend` directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to see the application running.

---

## 🗄️ Database Setup (Supabase)

To fully utilize the authentication and dashboard features, you must run the included SQL schema in your Supabase SQL Editor.

1. Open your Supabase Dashboard.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `frontend/supabase_schema.sql` and run it. 
4. (Optional) Run `frontend/supabase_seed.sql` if you want to prepopulate dummy data.

**Note:** The application uses Row Level Security (RLS) to ensure Businesses can only see and manage their own bookings and offers.

---

<div align="center">
  <i>Crafted with precision. Designed for conversion.</i>
</div>
