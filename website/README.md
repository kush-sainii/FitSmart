# FitSmart - Your Personal Fitness Coach

A modern, minimal React-based fitness application with personalized workout plans, food scanning capabilities, and an integrated AI assistant.

## Features

- **Landing Page**: Clean hero section with quick action buttons
- **Exercise Planner**: 6 pre-built workout plans with detailed exercises
  - Weight Loss Program
  - Muscle Building
  - Flexibility & Mobility
  - Cardio Endurance
  - Core Strengthening
  - Beginner Full Body

- **Food Scanner**: Camera integration to capture food photos (UI ready for backend integration)
- **AI Assistant Bot**: Floating bot chat in the corner (ready to integrate your bot URL)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Minimal, clean aesthetic with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd fitness-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
fitness-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── BotChat.jsx
│   │   └── BotChat.css
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ExercisePlanner.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── LandingPage.css
│   │   └── ExercisePlanner.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Integration Guide

### Adding Your Bot URL

1. Open `src/App.jsx`
2. Find the line: `const BOT_URL = 'https://your-bot-url-here.com'`
3. Replace with your bot's actual URL:
```javascript
const BOT_URL = 'https://your-bot-api.com/chat'
```

### Food Scanner Integration

The food scanner camera is ready to capture images. To integrate with your backend:

1. Open `src/pages/LandingPage.jsx`
2. Look for the `capturePhoto()` function
3. Replace the console.log and alert with your API call:
```javascript
const imageData = canvasRef.current.toDataURL('image/jpeg')
// Send to your backend for analysis
const response = await fetch('/api/analyze-food', {
  method: 'POST',
  body: JSON.stringify({ image: imageData })
})
```

## Customization

### Colors & Branding

Edit `src/styles/globals.css` to modify the color scheme:
```css
:root {
  --primary: #667eea;        /* Main gradient start */
  --primary-dark: #764ba2;   /* Main gradient end */
  --success: #48bb78;
  --warning: #ed8936;
  --danger: #f56565;
  /* ... more colors ... */
}
```

### Exercise Plans

Add or modify exercise plans in `src/pages/ExercisePlanner.jsx` in the `exercisePlans` array.

### Navigation

The app uses React Router. To add new pages:
1. Create a new page component in `src/pages/`
2. Add a route in `src/App.jsx`
3. Update navigation links in `src/components/Navbar.jsx`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Optimized React components with hooks
- Lazy loading ready for future enhancements
- CSS animations for smooth UX
- Minimal external dependencies

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.

---

Built with ❤️ for fitness enthusiasts
