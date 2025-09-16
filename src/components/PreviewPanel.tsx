import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import { AspectRatio, Tv, Code as CodeIcon } from '@mui/icons-material';
import { Slide, ProjectConfig } from '../types';
import { ThemeUtils } from '../utils/themeUtils';

// 懒加载Monaco编辑器
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface PreviewPanelProps {
  slide: Slide | null;
  aspectRatio: '16:9' | '4:3';
  onAspectRatioChange: (ratio: '16:9' | '4:3') => void;
  themeConfig?: ProjectConfig['themeColors'];
  userTheme?: string;
  onSlideUpdate?: (slide: Slide) => void;
}

const ASPECT_RATIOS = {
  '16:9': { width: 16, height: 9 },
  '4:3': { width: 4, height: 3 },
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ slide, aspectRatio, onAspectRatioChange, themeConfig, userTheme, onSlideUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [previewMode, setPreviewMode] = useState<'preview' | 'source'>('preview');
  const [sourceCode, setSourceCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);

  const handleAspectRatioChange = (
    event: React.MouseEvent<HTMLElement>,
    newAspectRatio: keyof typeof ASPECT_RATIOS | null,
  ) => {
    if (newAspectRatio !== null) {
      onAspectRatioChange(newAspectRatio);
    }
  };

  const calculateScale = (containerWidth: number, containerHeight: number) => {
    const ratio = ASPECT_RATIOS[aspectRatio];
    const slideWidth = aspectRatio === '16:9' ? 1280 : 1024;
    const slideHeight = aspectRatio === '16:9' ? 720 : 768;

    // 计算可用空间（最小化padding）
    const availableWidth = containerWidth - 16; // 仅减去8px padding
    const availableHeight = containerHeight - 16; // 仅减去8px padding

    // 计算宽度和高度的缩放比例
    const widthScale = availableWidth / slideWidth;
    const heightScale = availableHeight / slideHeight;

    // 取较小的缩放比例，确保内容完全可见
    return Math.min(widthScale, heightScale, 1); // 最大缩放为1（100%）
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newScale = calculateScale(rect.width, rect.height);
        setScale(newScale);
      }
    };

    updateScale();

    // 使用 ResizeObserver 来监听容器大小变化
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateScale);
      };
    }

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [aspectRatio, slide]);

  // 当幻灯片变化时，更新源码编辑器的内容
  useEffect(() => {
    if (slide && previewMode === 'source') {
      setSourceCode(slide.html);
      setIsEditing(false);
    }
  }, [slide, previewMode]);

  // 当没有幻灯片时，清空源码编辑器
  useEffect(() => {
    if (!slide) {
      setSourceCode('');
      setIsEditing(false);
    }
  }, [slide]);

  // 当幻灯片变化时，强制重新渲染iframe
  useEffect(() => {
    if (slide) {
      setForceRenderKey(prev => prev + 1);
    }
  }, [slide]);

  return (
    <Box sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      borderLeft: '1px solid #e0e0e0'
    }}>
      {/* Header */}
      <Box sx={{
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#f5f5f5',
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            预览
          </Typography>
          <Paper sx={{ p: 0.5 }}>
            <ToggleButtonGroup
              value={previewMode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) {
                  // 如果从源码模式切换到预览模式，保存更改
                  if (previewMode === 'source' && newMode === 'preview' && isEditing && onSlideUpdate && slide) {
                    const updatedSlide = {
                      ...slide,
                      html: sourceCode,
                      updatedAt: new Date()
                    };
                    onSlideUpdate(updatedSlide);
                    setIsEditing(false);
                  }
                  setPreviewMode(newMode);
                  if (newMode === 'source' && slide) {
                    setSourceCode(slide.html);
                  }
                }
              }}
              size="small"
            >
              <ToggleButton value="preview" sx={{ px: 2 }}>
                <AspectRatio sx={{ mr: 1, fontSize: 18 }} />
                预览
              </ToggleButton>
              <ToggleButton value="source" sx={{ px: 2 }}>
                <CodeIcon sx={{ mr: 1, fontSize: 18 }} />
                源码
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          {previewMode === 'preview' && (
            <Paper sx={{ p: 0.5 }}>
              <ToggleButtonGroup
                value={aspectRatio}
                exclusive
                onChange={handleAspectRatioChange}
                size="small"
              >
                <ToggleButton value="16:9" sx={{ px: 2 }}>
                  16:9
                </ToggleButton>
                <ToggleButton value="4:3" sx={{ px: 2 }}>
                  4:3
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {slide ? slide.name : '选择幻灯片进行预览'}
        </Typography>
      </Box>

      {/* Preview Content */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.5,
          bgcolor: '#fafafa',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {slide ? (
          previewMode === 'preview' ? (
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 0,
                overflow: 'hidden',
                bgcolor: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                width: '100%',
                height: '100%',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  transformOrigin: 'center center',
                  width: aspectRatio === '16:9' ? '1280px' : '1024px',
                  height: aspectRatio === '16:9' ? '720px' : '768px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    key={`${slide?.id || slide.html}-${forceRenderKey}`} // 组合key确保强制重新渲染
                    srcDoc={
                      userTheme
                        ? ThemeUtils.generateHtmlWithUserTheme(sourceCode || slide.html, userTheme)
                        : themeConfig
                          ? ThemeUtils.generateHtmlWithTheme(sourceCode || slide.html, themeConfig)
                          : sourceCode || slide.html
                    }
                    title={`预览: ${slide.name}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  color: '#666',
                  fontSize: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                {aspectRatio} · {Math.round(scale * 100)}% · {isEditing ? '编辑中' : '已保存'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1
            }}>
              <Box sx={{
                flex: 1,
                border: '1px solid #4a4a4a',
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: '#282c34',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '32px',
                  bgcolor: '#21252b',
                  borderBottom: '1px solid #4a4a4a',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  zIndex: 10
                }}>
                  <Typography variant="caption" sx={{ color: '#abb2bf', fontSize: '12px' }}>
                    index.html
                  </Typography>
                </Box>
                <Box sx={{ height: '100%', pt: '32px' }}>
                  <Suspense fallback={
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: '#abb2bf'
                    }}>
                      <Typography>加载编辑器...</Typography>
                    </Box>
                  }>
                    <MonacoEditor
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      value={sourceCode}
                      onChange={(value) => {
                        setSourceCode(value || '');
                        setIsEditing(true);
                      }}
                      options={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        folding: true,
                        renderWhitespace: 'selection',
                        selectOnLineNumbers: true,
                        matchBrackets: 'always',
                        autoIndent: 'advanced',
                        formatOnPaste: true,
                        formatOnType: true,
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        parameterHints: { enabled: true },
                        wordBasedSuggestions: 'allDocuments'
                      }}
                      onMount={(editor, monaco) => {
                        // 添加快捷键支持
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                          if (onSlideUpdate && slide) {
                            const updatedSlide = {
                              ...slide,
                              html: sourceCode,
                              updatedAt: new Date()
                            };
                            onSlideUpdate(updatedSlide);
                            setIsEditing(false);
                          }
                        });

                        // 失去焦点时保存
                        editor.onDidBlurEditorText(() => {
                          if (isEditing && onSlideUpdate && slide) {
                            const updatedSlide = {
                              ...slide,
                              html: sourceCode,
                              updatedAt: new Date()
                            };
                            onSlideUpdate(updatedSlide);
                            setIsEditing(false);
                          }
                        });
                      }}
                    />
                  </Suspense>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#666',
                fontSize: '12px',
                px: 1,
                py: 0.5,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: '#2196F3' }}>
                    HTML 源码编辑器
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Ctrl+S 保存
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {sourceCode.length} 字符
                </Typography>
              </Box>
            </Box>
          )
        ) : (
          <Box sx={{
            textAlign: 'center',
            p: 4,
            color: '#666'
          }}>
            <Typography variant="h6" sx={{ color: '#999', mb: 2 }}>
              选择幻灯片进行预览
            </Typography>
            <Typography variant="body2">
              从左侧列表中选择一张幻灯片来预览其内容
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PreviewPanel;