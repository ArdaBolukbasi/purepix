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

# PurePix
> Squoosh.app inspired image compression tool with a modern, premium UI
<div align="center">
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)
</div>
## ✨ Features
- 🎨 **Premium Dark UI** - Glassmorphism, gradient accents, neon glow effects
- 🖼️ **Before/After Comparison** - Interactive slider to compare original vs compressed
- ⚡ **Real-time Preview** - See changes as you adjust quality, size, and format
- 📦 **Multiple Formats** - JPEG, PNG, WebP support
- 🎯 **Precise Controls** - Fine-tune dimensions, quality, and aspect ratio
- 🔒 **Privacy First** - Images processed on server but never stored
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔍 **Zoom Controls** - Inspect image details at different zoom levels
## 🚀 Quick Start
### Prerequisites
- Node.js 18+ 
- Python 3.11+
- npm or yarn
### Installation
1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mb
```
2. **Setup Frontend**
```bash
cd frontend
npm install
```
3. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
```
### Running the Application
**Terminal 1 - Start Backend:**
```bash
cd backend
python main.py
```
Backend runs on: `http://localhost:8000`
**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`
### Usage
1. Open `http://localhost:3000` in your browser
2. Upload an image (drag & drop or click to browse)
3. Adjust compression settings:
   - **Resize**: Change dimensions with aspect ratio lock
   - **Format**: Choose between JPEG, PNG, or WebP
   - **Quality**: Slide between 1-100%
4. Compare original vs compressed using the slider
5. Download your optimized image
## 🛠️ Tech Stack
### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom-built with 21st.dev design patterns
- **Comparison**: react-compare-slider
- **Icons**: Lucide React
### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Image Processing**: Pillow (PIL)
- **Server**: Uvicorn with hot reload
## 📁 Project Structure
```
mb/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── globals.css        # Global styles
│   │   ├── components/
│   │   │   ├── upload-zone.tsx    # Drag & drop upload
│   │   │   ├── image-editor.tsx   # Main editor
│   │   │   ├── comparison-slider.tsx
│   │   │   ├── stats-card.tsx
│   │   │   ├── resize-controls.tsx
│   │   │   ├── format-selector.tsx
│   │   │   ├── quality-slider.tsx
│   │   │   └── download-button.tsx
│   │   └── lib/
│   │       ├── utils.ts           # Utilities
│   │       └── api.ts             # API client
│   └── package.json
│
└── backend/
    ├── main.py                    # FastAPI app
    ├── requirements.txt           # Dependencies
    └── utils/
        └── image_processor.py     # Image processing logic
```
## 🎨 Design Highlights
- **Dark Theme**: Modern dark color palette with carefully selected accent colors
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Neon Accents**: Gradient borders and glow effects on interactive elements
- **Smooth Animations**: Slide-up, fade, and pulse animations
- **Custom Components**: Tailored sliders, buttons, and controls
- **Responsive Layout**: Adapts seamlessly from mobile to desktop
## 📡 API Endpoints
### `POST /upload`
Upload an image and get metadata
- **Max Size**: 10MB
- **Returns**: Base64 image + dimensions, format, size
### `POST /process`
Process image with specified parameters
- **Parameters**: width, height, format, quality, keep_aspect_ratio
- **Returns**: Base64 processed image + metadata
### `POST /download`
Download processed image as file
- **Parameters**: Same as `/process`
- **Returns**: Binary image file with appropriate content-type
### `GET /`
Health check endpoint
## 🔧 Development
### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```
### Backend Development
```bash
cd backend
python main.py              # Start with hot reload
uvicorn main:app --reload  # Alternative start method
```
## 🐛 Troubleshooting
### Port Already in Use
- **Frontend (3000)**: Change port in `package.json` dev script: `next dev -p 3001`
- **Backend (8000)**: Change port in `main.py`: `uvicorn.run("main:app", port=8001)`
### CORS Issues
If you change the frontend port, update CORS settings in `backend/main.py`:
```python
allow_origins=["http://localhost:YOUR_PORT"]
```
### Image Not Updating
- Clear browser cache
- Check browser console for errors
- Verify both servers are running
## 🌟 Future Enhancements
- [ ] Batch processing (multiple images)
- [ ] Image format conversion without compression
- [ ] Save/load compression presets
- [ ] History of processed images
- [ ] AVIF and JPEG XL support
- [ ] PWA support for offline usage
- [ ] WebSocket for real-time updates
- [ ] Mobile app (React Native)
## 📝 License
This project is open source and available under the MIT License.
## 🙏 Acknowledgments
- Inspired by [Squoosh](https://squoosh.app/) by Google Chrome Labs
- UI design patterns from [21st.dev](https://21st.dev)
- Icons by [Lucide](https://lucide.dev)
---
<div align="center">
Made with ❤️ using Next.js and FastAPI
</div>