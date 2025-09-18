# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for managing and presenting HTML slides. The system allows users to import HTML slide files, organize them through drag-and-drop, preview content, and export complete presentation projects as ZIP files.

**Key Features:**
- Import individual HTML slide files or complete ZIP projects
- Drag-and-drop slide reordering
- Real-time slide preview
- Full-screen presentation mode with keyboard controls
- Export presentations as self-contained ZIP packages
- Support for multiple aspect ratios (16:9, 4:3)
- Global theme system with CSS variables

## Technology Stack

### Frontend Framework
- **React 18** with TypeScript
- **Create React App** (react-scripts 5.0.1)
- **Material-UI (MUI)** v7.3.2 for UI components (@mui/material, @mui/icons-material)
- **Emotion** for styling (@emotion/react, @emotion/styled)

### Core Dependencies
- **JSZip 3.10.1** - For ZIP file import/export operations
- **React DnD 16.0.1** - For drag-and-drop functionality (react-dnd, react-dnd-html5-backend)
- **Testing Libraries** - Jest, React Testing Library, User Event

### Build & Development
- **TypeScript 4.9.5** with strict mode enabled
- **ESLint** with React App configuration
- **Web Vitals** for performance monitoring

## Project Structure

```
/Users/yuhangpei/projects/textword/
├── src/                          # Main React application source
│   ├── components/               # React components
│   │   ├── Header.tsx           # Navigation and action buttons
│   │   ├── SlideList.tsx        # Drag-and-drop slide management
│   │   ├── PreviewPanel.tsx     # Slide preview with aspect ratio control
│   │   └── PlaybackModal.tsx    # Full-screen presentation mode
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Project, Slide, Asset)
│   ├── utils/
│   │   ├── slideParser.ts       # HTML file parsing logic
│   │   └── zipHandler.ts        # ZIP import/export functionality
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global application styles
│   ├── index.tsx                # Application entry point
│   └── index.css                # Root styles
├── styles/                       # Global theme system
│   └── theme.css                # CSS variables and base styles for slides
├── public/                       # Static assets
├── examples/                     # Example slides and templates
├── example-presentation/         # Complete example project structure
│   ├── theme.css                # Project-specific theme
│   ├── config.json              # Project metadata
│   ├── slides/                  # Individual slide HTML files
│   └── README.md               # Project documentation
├── template.html                 # HTML template for creating new slides
├── assets/                       # Static assets directory
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                    # User documentation
```

## Available Commands

### Development
```bash
npm install        # Install all dependencies
npm start          # Start development server (localhost:3000) with TSC_COMPILE_ON_ERROR=true
npm run build      # Create production build in /build directory
npm test           # Run tests with Jest + React Testing Library
npm run eject      # Eject from Create React App (caution: irreversible)
```

### Development Environment Setup
- Uses `TSC_COMPILE_ON_ERROR=true` to allow TypeScript compilation with errors during development
- Hot reload enabled for development workflow
- ESLint warnings are shown but don't prevent compilation
- Current TypeScript errors exist in SlideList component (unused imports, missing props)

## Key Architectural Patterns

### 1. Component Architecture
- **Functional Components** with TypeScript interfaces
- **Custom Hooks** for state management (useState extensively used)
- **Prop-based Communication** between components
- **Event Delegation** for user interactions

### 2. State Management
- **React useState** for local component state
- **Lifting State Up** pattern for shared state (App.tsx is the state hub)
- **Immutable Updates** following React best practices

### 3. File Processing Architecture
- **SlideParser utility** handles HTML file parsing and asset extraction
- **ZipHandler utility** manages ZIP import/export with JSZip
- **Blob-based Downloads** for file exports

### 4. Theme System
- **CSS Custom Properties** for global color and spacing variables
- **Multiple Theme Support**: light, dark, minimal, business themes
- **Responsive Design** with CSS Grid and Flexbox
- **BEM-like Naming Convention** for CSS classes

## Data Models

### Core Types
```typescript
interface Slide {
  id: string;
  name: string;
  html: string;
  order: number;
  assets: Asset[];
  thumbnail?: string;
}

interface Asset {
  filename: string;
  content: string | ArrayBuffer;
  type: 'image' | 'css' | 'js' | 'other';
}

interface Project {
  id: string;
  name: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Key Features Implementation

### 1. Slide Import System
- Supports multiple HTML file selection
- Extracts embedded assets (images, CSS, JS)
- Generates thumbnails for preview
- Maintains original HTML structure

### 2. Drag & Drop Reordering
- Uses React DnD HTML5 backend
- Maintains slide order indices
- Smooth visual feedback during dragging
- Updates project state on drop

### 3. Presentation Mode
- Full-screen modal overlay
- Keyboard navigation (arrow keys, ESC, F)
- Automatic aspect ratio adaptation
- No UI chrome for clean presentation

### 4. Export System
- Creates self-contained ZIP packages
- Includes all slides, assets, and a standalone player
- Preserves theme and styling
- Generates downloadable blob URLs

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled, proper typing for all components
- **React**: Functional components with hooks, avoid classes
- **CSS**: Use CSS variables from theme system, avoid hardcoded values
- **File Names**: PascalCase for components, camelCase for utilities

### Component Development
- **Single Responsibility**: Each component has one clear purpose
- **Prop Validation**: Use TypeScript interfaces for type safety
- **Error Boundaries**: Add error handling for file operations
- **Performance**: Use React.memo and useCallback for optimization

### Testing Approach
- **Jest + React Testing Library** for unit tests
- **User Event** for realistic interaction testing
- **Component Tests** for UI interactions
- **Utility Tests** for file processing logic

### File Structure for New Features
1. Add new types in `/src/types/index.ts`
2. Create utilities in `/src/utils/`
3. Build components in `/src/components/`
4. Add corresponding CSS files
5. Update main App.tsx to integrate

## Configuration & Build

### TypeScript Configuration
- Target: ES5 for maximum compatibility
- Module: ESNext with Node resolution
- Strict mode enabled for type safety
- React JSX transform enabled

### Browser Support
- Production: >0.2%, not dead, not op_mini all
- Development: Latest versions of Chrome, Firefox, Safari

### Build Output
- Static files in `/build` directory
- Optimized and minified for production
- Service Worker support for offline capability

## Important Notes

### Security Considerations
- File processing happens client-side
- No server-side dependencies
- Sanitize HTML content when parsing user files
- Validate file types before processing

### Performance Considerations
- Large files are processed asynchronously
- Images and assets are optimized during export
- Lazy loading for slide previews
- Efficient state updates to prevent re-renders

### Internationalization
- Currently Chinese language focused
- UI text is hardcoded in components
- Consider i18n library for multi-language support

## Future Development Areas

The project is actively developed with planned enhancements:
- User authentication and project persistence
- Advanced slide editing capabilities
- More export formats (PDF, video)
- Performance optimizations for large presentations
- Cloud integration for collaboration

## Troubleshooting

### Common Issues
- **TypeScript Errors**: Use `TSC_COMPILE_ON_ERROR=true` during development (already configured in npm start)
- **File Import Issues**: Check file encoding and HTML structure
- **ZIP Export Problems**: Ensure all assets are properly referenced
- **Styling Issues**: Verify CSS variables are properly used
- **Missing Props**: SlideList component expects `onImportHtml` prop that may be missing from App.tsx
- **Unused Imports**: ESLint warnings for unused imports in SlideList.tsx (useRef, fileInputRef, handleAddSlide, handleFileChange)

### Development Tips
- Use Chrome DevTools for debugging
- Test with different HTML slide structures
- Verify ZIP export includes all necessary files
- Check responsive design on multiple screen sizes
- 每次改完代码后，可以不用编译测试，节省时间
- 播放界面的翻页器需要在同侧都有,避免演讲者站在同侧无法点击另一侧的翻页