---
title: PurePix
emoji: 🖼️
colorFrom: purple
colorTo: blue
sdk: docker
pinned: false
license: mit
app_port: 7860
---

<div align="center">
  <img src="https://github.com/ArdaBolukbasi/purepix-web/raw/main/favicon.png" width="100" alt="PurePix Logo">
  <h1>PurePix Web</h1>
  <p>
    <strong>High-Performance SEO Landing & Presentation Layer for PurePix</strong>
  </p>
</div>

<div align="center">
### AI Powered Image Optimization & Background Removal

**Squoosh.app inspired image compression tool with a modern, premium Dark UI.**
</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
 <a href="https:/pırepix.com.tr" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Click_Here-success?style=for-the-badge" />
  </a>

<br>
<div align="center">
    <a href="https://purepix.com.tr" target="_blank">
         <img src="https://github.com/ArdaBolukbasi/purepix-web/raw/main/mainpage.jpg" alt="PurePix Main Interface" width="50%" style="border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
   </a>
</div>

---

## ✨ Overview

**PurePix** is a high-performance image optimization tool designed for the modern web. Built with a robust **FastAPI** backend and a sleek **Next.js** frontend, it offers real-time image compression, resizing, and format conversion with a privacy-first approach.

The interface features a **Glassmorphism** design language with neon accents, providing a premium user experience comparable to native desktop applications.

---

## 📸 Features in Action

### 📉 Intelligent Compression
Interactive slider to compare Original vs. Compressed versions in real-time. Full support for **JPEG**, **PNG**, and **WebP**.

<div align="center">
  <a href="https://purepix.com.tr" target="_blank">
    <img src="https://github.com/ArdaBolukbasi/purepix-web/raw/main/compresspage.jpg" alt="Compression Interface" width="50%" style="border-radius: 8px; transition: transform 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
  </a>
</div>

<br>

### ✂️ AI Background Removal
Remove backgrounds instantly with AI precision and save as transparent PNGs.

<div align="center">
    <a href="https://purepix.com.tr" target="_blank">
  <img src="https://github.com/ArdaBolukbasi/purepix-web/raw/main/reamovepage.jpg" alt="Background Removal Interface" width="50%" style="border-radius: 8px;">
         </a>
</div>

---

## 🚀 Key Features List

* 🎨 **Premium Dark UI** - Glassmorphism aesthetics, gradient accents, and neon glow effects.
* ⚡ **Instant Preview** - See changes immediately as you adjust quality, size, and formats.
* 🎯 **Precise Controls** - Fine-tune dimensions, quality percentage, and maintain aspect ratio.
* 🔒 **Privacy First** - Images are processed in memory and never stored on the server.
* 📱 **Fully Responsive** - Flawless experience on both desktop workstations and mobile devices.

---

## 🛠️ Tech Stack

### **Frontend**
| Tech | Description |
| :--- | :--- |
| **Next.js 16** | App Router & Server Components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Modern utility-first styling |
| **Lucide React** | Beautiful & consistent icons |
| **React Compare Slider** | Smooth before/after visualization |

### **Backend**
| Tech | Description |
| :--- | :--- |
| **FastAPI** | High-performance Python framework |
| **Python 3.11+** | Core logic language |
| **Pillow (PIL)** | Advanced image processing library |
| **Uvicorn** | Lightning-fast ASGI server |

---
## 📡 API Reference
PurePix exposes a RESTful API for image processing.

### POST /process
Process image with specific parameters.

**Body: JSON**
```json
{
  "image": "base64_string",
  "quality": 80,
  "format": "webp",
  "width": 1920,
  "height": 1080
}
```

## 📁 Project Structure
```plaintext
purepix/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router Pages
│   │   ├── components/       # UI Components
│   │   └── lib/              # API Utils
│   └── package.json
│
└── backend/                  # FastAPI Application
    ├── main.py               # API Entry Point
    ├── requirements.txt      # Python Dependencies
    └── utils/
        └── image_processor.py # Core Processing Logic
```

## 🤝 Contributing
Contributions are always welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

## ⚡ Quick Start

Follow these steps to set up the project locally.

### Prerequisites
* **Node.js** v18 or higher
* **Python** v3.11 or higher
* **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ardabolukbasi/purepix.git
    cd purepix
    ```

2.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    ```

3.  **Setup Backend**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```
### Running the Application

You need to run both the backend and frontend terminals simultaneously.

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Server runs on: http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on: http://localhost:3000
```


<div align="center">

Developed by **Arda Bölükbaşı**

Made with ❤️ using Next.js and FastAPI

</div>
