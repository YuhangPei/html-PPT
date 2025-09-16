export interface Slide {
  id: string;
  name: string;
  html: string;
  order: number;
  assets: Asset[];
  thumbnail?: string;
}

export interface Asset {
  filename: string;
  content: string | ArrayBuffer;
  type: 'image' | 'css' | 'js' | 'other';
}

export interface Project {
  id: string;
  name: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
  config?: ProjectConfig;
  theme?: string;
  filePath?: string;
}

export interface PlaybackOptions {
  autoPlay: boolean;
  interval: number;
  loop: boolean;
  fullscreen: boolean;
}

export interface ProjectConfig {
  title: string;
  description: string;
  author: string;
  company: string;
  version: string;
  created: string;
  modified: string;
  themeColors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
  };
  settings: {
    autoPlay: boolean;
    loop: boolean;
    showControls: boolean;
    transition: string;
  };
  slides: Array<{
    file: string;
    title: string;
    duration: number;
  }>;
}