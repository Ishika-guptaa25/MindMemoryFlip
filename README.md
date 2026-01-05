# FlipMind Memory Card Game

A modern memory card matching game built with pure JavaScript, featuring multiple difficulty levels, animations, timer, and score tracking.

## Features

- Three difficulty levels (Easy, Medium, Hard)
- Smooth card flip animations
- Timer countdown system
- Move counter
- Score tracking with local storage
- Best score persistence
- Responsive design
- Pure vanilla JavaScript (no frameworks)

## Demo

Play the live version at: https://mind-memory-flip.vercel.app/

## Installation

1. Clone the repository:
```bash
git https://github.com/Ishika-guptaa25/MindMemoryFlip.git
cd MindMemoryFlip
```

2. Open `index.html` in your web browser or serve with a local server:
```bash
python -m http.server 8000
# or
npx serve
```

## Game Rules

1. Click any card to flip it and reveal the symbol
2. Click a second card to find its match
3. If the cards match, they stay flipped
4. If they don't match, both cards flip back
5. Complete all pairs before time runs out
6. Lower scores are better (moves + remaining time)

## Difficulty Levels

- **Easy**: 6 pairs, 60 seconds
- **Medium**: 10 pairs, 90 seconds
- **Hard**: 16 pairs, 120 seconds

## Project Structure
```
flipmind-game/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── game.js         # Game logic and functionality
└── README.md       # Project documentation
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to GitHub Pages

1. Push code to GitHub
2. Go to repository Settings > Pages
3. Select branch and root folder
4. Save and wait for deployment

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The game uses pure JavaScript with no build tools or dependencies required. Simply edit the files and refresh your browser to see changes.

## License

MIT License - feel free to use this project for learning or personal use.

## Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

## Acknowledgments

Built as a demonstration of vanilla JavaScript game development with modern CSS animations.
