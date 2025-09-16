import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  MenuItem
} from '@mui/material';
import {
  Colorize as ColorIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { ProjectConfig } from '../types';

interface ProjectConfigDialogProps {
  open: boolean;
  config?: ProjectConfig;
  onClose: () => void;
  onSave: (config: ProjectConfig) => void;
}

const ProjectConfigDialog: React.FC<ProjectConfigDialogProps> = ({
  open,
  config,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState<ProjectConfig>({
    title: '',
    description: '',
    author: '',
    company: '',
    version: '1.0.0',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
    themeColors: {
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      accentColor: '#00bcd4',
      backgroundColor: '#ffffff',
      surfaceColor: '#f5f5f5',
      textPrimary: '#212121',
      textSecondary: '#757575',
      borderColor: '#e0e0e0'
    },
    settings: {
      autoPlay: false,
      loop: false,
      showControls: true,
      transition: 'fade'
    },
    slides: []
  });

  React.useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev,
        ...config,
        themeColors: {
          ...prev.themeColors,
          ...config.themeColors
        },
        settings: {
          ...prev.settings,
          ...config.settings
        }
      }));
    }
  }, [config]);

  const handleChange = (field: keyof ProjectConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      modified: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSettingsChange = (field: keyof ProjectConfig['settings'], value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      },
      modified: new Date().toISOString().split('T')[0]
    }));
  };

  const handleColorChange = (colorField: keyof ProjectConfig['themeColors'], value: string) => {
    setFormData(prev => ({
      ...prev,
      themeColors: {
        ...prev.themeColors,
        [colorField]: value
      },
      modified: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">项目配置</Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 基本信息 */}
          <Typography variant="subtitle1" fontWeight="bold">基本信息</Typography>
          <TextField
            label="项目标题"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="项目描述"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="作者"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              fullWidth
            />
            <TextField
              label="公司"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              fullWidth
            />
          </Box>
          <TextField
            label="版本"
            value={formData.version}
            onChange={(e) => handleChange('version', e.target.value)}
            fullWidth
          />

          <Divider sx={{ my: 2 }} />

          {/* 主题颜色配置 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PaletteIcon />
            <Typography variant="subtitle1" fontWeight="bold">主题颜色</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="主色调"
                value={formData.themeColors.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.primaryColor;
                    input.onchange = (e) => handleColorChange('primaryColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.primaryColor }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="次色调"
                value={formData.themeColors.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.secondaryColor;
                    input.onchange = (e) => handleColorChange('secondaryColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.secondaryColor }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="强调色"
                value={formData.themeColors.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.accentColor;
                    input.onchange = (e) => handleColorChange('accentColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.accentColor }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="背景色"
                value={formData.themeColors.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.backgroundColor;
                    input.onchange = (e) => handleColorChange('backgroundColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.backgroundColor }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="容器背景"
                value={formData.themeColors.surfaceColor}
                onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.surfaceColor;
                    input.onchange = (e) => handleColorChange('surfaceColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.surfaceColor }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="主要文字"
                value={formData.themeColors.textPrimary}
                onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.textPrimary;
                    input.onchange = (e) => handleColorChange('textPrimary', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.textPrimary }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="次要文字"
                value={formData.themeColors.textSecondary}
                onChange={(e) => handleColorChange('textSecondary', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.textSecondary;
                    input.onchange = (e) => handleColorChange('textSecondary', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.textSecondary }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="边框颜色"
                value={formData.themeColors.borderColor}
                onChange={(e) => handleColorChange('borderColor', e.target.value)}
                fullWidth
                size="small"
              />
              <Tooltip title="选择颜色">
                <IconButton
                  size="small"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.themeColors.borderColor;
                    input.onchange = (e) => handleColorChange('borderColor', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                >
                  <ColorIcon sx={{ color: formData.themeColors.borderColor }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 播放设置 */}
          <Typography variant="subtitle1" fontWeight="bold">播放设置</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="切换效果"
              value={formData.settings.transition}
              onChange={(e) => handleSettingsChange('transition', e.target.value)}
              fullWidth
              select
            >
              <MenuItem value="fade">淡入淡出</MenuItem>
              <MenuItem value="slide">滑动</MenuItem>
              <MenuItem value="none">无效果</MenuItem>
            </TextField>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectConfigDialog;