import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  Box,
  Chip,
  Button,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Add as AddIcon,
  Slideshow as SlideIcon
} from '@mui/icons-material';
import { Project, Slide } from '../types';
import { ThemeUtils } from '../utils/themeUtils';
import './SlideList.css';

interface SlideListProps {
  project: Project | null;
  selectedSlide: Slide | null;
  onSlideSelect: (slide: Slide) => void;
  onReorderSlides: (slides: Slide[]) => void;
  onImportHtml: (files: FileList) => void;
}

const SlideList: React.FC<SlideListProps> = ({
  project,
  selectedSlide,
  onSlideSelect,
  onReorderSlides,
  onImportHtml
}) => {
  const [draggedSlide, setDraggedSlide] = useState<Slide | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1);

  const getThumbnailHtml = (slide: Slide): string => {
    // 优先使用用户主题，然后使用系统主题配置
    if (project?.theme) {
      return ThemeUtils.generateHtmlWithUserTheme(slide.html, project.theme);
    } else if (project?.config?.themeColors) {
      return ThemeUtils.generateHtmlWithTheme(slide.html, project.config.themeColors);
    }
    return slide.html;
  };

  const handleDragStart = (e: React.DragEvent, slide: Slide) => {
    setDraggedSlide(slide);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (!draggedSlide || !project) return;

    const slides = [...project.slides];
    const draggedIndex = slides.findIndex(s => s.id === draggedSlide.id);

    if (draggedIndex !== targetIndex) {
      const [removed] = slides.splice(draggedIndex, 1);
      slides.splice(targetIndex, 0, removed);

      const reorderedSlides = slides.map((slide, index) => ({
        ...slide,
        order: index
      }));

      onReorderSlides(reorderedSlides);
    }

    setDraggedSlide(null);
    setDragOverIndex(-1);
  };

  const handleDragEnd = () => {
    setDraggedSlide(null);
    setDragOverIndex(-1);
  };

  const handleAddSlide = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onImportHtml(files);
      }
    };
    input.click();
  };

  const handleDeleteSlide = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project) return;

    const updatedSlides = project.slides.filter(slide => slide.id !== slideId);
    onReorderSlides(updatedSlides);
  };

  return (
    <Box sx={{
      width: 350,
      borderRight: '1px solid #e0e0e0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f5f5'
    }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            幻灯片列表
          </Typography>
          <Chip
            label={`${project?.slides.length || 0} 页`}
            size="small"
            color="primary"
          />
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddSlide}
        >
          添加幻灯片
        </Button>
      </Box>

  
      {/* Slide List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {project && project.slides.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {project.slides.map((slide, index) => (
              <Box
                key={slide.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlideSelect(slide);
                }}
                onDragOver={(e: React.DragEvent) => handleDragOver(e, index)}
                onDrop={(e: React.DragEvent) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                  ...(selectedSlide?.id === slide.id && {
                    bgcolor: '#e3f2fd',
                    border: '1px solid #1976d2',
                  }),
                  ...(draggedSlide?.id === slide.id && {
                    opacity: 0.5,
                    transform: 'scale(0.95)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }),
                  ...(dragOverIndex === index && draggedSlide?.id !== slide.id && {
                    bgcolor: '#f0f7ff',
                    border: '1px dashed #1976d2',
                  }),
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    {slide.name}
                  </Typography>
                  <Box sx={{
                    width: 80,
                    height: 45,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <iframe
                      srcDoc={getThumbnailHtml(slide)}
                      title={slide.name}
                      sandbox="allow-same-origin"
                      style={{
                        width: '1280px',
                        height: '720px',
                        border: 'none',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(0.0625)',
                        transformOrigin: 'center center'
                      }}
                    />
                  </Box>
                </Box>

                <IconButton
                  edge="end"
                  onClick={(e) => handleDeleteSlide(slide.id, e)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>

                <div
                  draggable
                  onDragStart={(e: React.DragEvent) => handleDragStart(e, slide)}
                  style={{
                    cursor: 'move',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: draggedSlide?.id === slide.id ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: '#999',
                      '&:hover': { color: '#1976d2' }
                    }}
                  >
                    <DragIcon />
                  </IconButton>
                </div>
              </Box>
            ))}
          </List>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            p: 3,
            textAlign: 'center'
          }}>
            <SlideIcon sx={{ fontSize: 64, color: '#999', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
              暂无幻灯片
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              点击"添加幻灯片"按钮导入HTML文件
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSlide}
            >
              导入第一个幻灯片
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SlideList;