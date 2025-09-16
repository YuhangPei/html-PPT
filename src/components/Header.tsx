import React, { useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {
  FolderOpen as FolderOpenIcon,
  Folder as FolderIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Slideshow as SlideshowIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface HeaderProps {
  onImportHtml: (files: FileList) => void;
  onImportZip: (file: File) => void;
  onOpenFolder: (files: FileList) => void;
  onConfig: () => void;
  onSaveProject: () => void;
  onExportZip: () => void;
  onPlay: () => void;
  onStop: () => void;
  hasSlides: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onImportHtml,
  onImportZip,
  onOpenFolder,
  onConfig,
  onSaveProject,
  onExportZip,
  onPlay,
  onStop,
  hasSlides
}) => {
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleHtmlImportClick = () => {
    htmlInputRef.current?.click();
  };

  const handleZipImportClick = () => {
    zipInputRef.current?.click();
  };

  const handleFolderOpenClick = () => {
    folderInputRef.current?.click();
  };

  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImportHtml(files);
    }
  };

  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportZip(file);
    }
  };

  const handleFolderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onOpenFolder(files);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <SlideshowIcon sx={{ mr: 2, fontSize: 28 }} />
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              PPT 演示系统
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              专业的HTML幻灯片管理工具
            </Typography>
          </Box>
        </Box>

        {/* Import Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1, opacity: 0.8 }}>
            导入:
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<UploadIcon />}
            onClick={handleHtmlImportClick}
            sx={{ mr: 1 }}
          >
            HTML
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<FolderOpenIcon />}
            onClick={handleZipImportClick}
          >
            ZIP
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<FolderIcon />}
            onClick={handleFolderOpenClick}
            sx={{ ml: 1 }}
          >
            打开文件夹
          </Button>

          <input
            ref={htmlInputRef}
            type="file"
            accept=".html"
            multiple
            onChange={handleHtmlFileChange}
            style={{ display: 'none' }}
          />
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            onChange={handleZipFileChange}
            style={{ display: 'none' }}
          />
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: '', directory: '' } as any)}
            multiple
            onChange={handleFolderFileChange}
            style={{ display: 'none' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Save & Export Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <Typography variant="body2" sx={{ mr: 1, opacity: 0.8 }}>
            保存:
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={onSaveProject}
            disabled={!hasSlides}
            sx={{
              mr: 1,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }}
          >
            保存项目
          </Button>
          <Typography variant="body2" sx={{ mr: 1, opacity: 0.8 }}>
            导出:
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={onExportZip}
            disabled={!hasSlides}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }}
          >
            独立播放包
          </Button>
        </Box>

        {/* Playback Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={onPlay}
            disabled={!hasSlides}
            sx={{ mr: 1 }}
          >
            <PlayIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onStop}
            disabled={!hasSlides}
          >
            <StopIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onConfig}
            disabled={!hasSlides}
            sx={{ ml: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;