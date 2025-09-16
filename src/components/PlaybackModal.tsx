import React, { useState, useEffect, useCallback } from 'react';
import { Project, Slide } from '../types';
import { ThemeUtils } from '../utils/themeUtils';
import './PlaybackModal.css';

interface PlaybackModalProps {
  project: Project;
  onClose: () => void;
  aspectRatio: '16:9' | '4:3';
  onSlideChange?: (slide: Slide) => void;
}

const PlaybackModal: React.FC<PlaybackModalProps> = ({ project, onClose, aspectRatio, onSlideChange }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showRedDot, setShowRedDot] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#ff0000');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // 存储每页的绘制内容
  const [slideDrawings, setSlideDrawings] = useState<{[key: number]: ImageData}>({});

  const currentSlide = project.slides[currentSlideIndex];

  // 保存当前页面的绘制内容
  const saveCurrentSlideDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setSlideDrawings(prev => ({
      ...prev,
      [currentSlideIndex]: imageData
    }));
  }, [currentSlideIndex]);

  // 恢复当前页面的绘制内容
  const restoreSlideDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除当前画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 恢复保存的绘制内容
    const savedDrawing = slideDrawings[currentSlideIndex];
    if (savedDrawing) {
      ctx.putImageData(savedDrawing, 0, 0);
    }
  }, [currentSlideIndex, slideDrawings]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < project.slides.length - 1) {
      saveCurrentSlideDrawing();
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      // 通知父组件幻灯片变化
      if (onSlideChange) {
        onSlideChange(project.slides[nextIndex]);
      }
    }
  }, [project.slides.length, currentSlideIndex, saveCurrentSlideDrawing, onSlideChange, project.slides]);

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      saveCurrentSlideDrawing();
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      // 通知父组件幻灯片变化
      if (onSlideChange) {
        onSlideChange(project.slides[prevIndex]);
      }
    }
  }, [currentSlideIndex, saveCurrentSlideDrawing, onSlideChange, project.slides]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // 初始化画布
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const slideWrapper = canvas.parentElement;
    if (!slideWrapper) return;

    // 检查是否需要重新设置画布大小
    const newWidth = slideWrapper.clientWidth;
    const newHeight = slideWrapper.clientHeight;

    // 只有在大小改变时才重新设置画布
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      // 获取当前上下文并保存内容
      const ctx = canvas.getContext('2d');
      const imageData = canvas.width > 0 && canvas.height > 0 && ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;

      // 设置新的画布大小
      canvas.width = newWidth;
      canvas.height = newHeight;

      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // 应用当前绘制设置
        if (drawMode === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 20;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = penColor;
          ctx.lineWidth = 3;
        }

        // 恢复之前的内容（如果存在）
        if (imageData) {
          ctx.putImageData(imageData, 0, 0);
        }
      }
    } else {
      // 如果大小没变，只更新绘制设置
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 应用当前绘制设置
        if (drawMode === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 20;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = penColor;
          ctx.lineWidth = 3;
        }
      }
    }
  }, []); // 移除依赖项，只在需要时更新设置

  // 开始绘制
  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsMouseDown(true);
    // 应用当前绘制设置
    if (drawMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, drawMode, penColor]);

  // 绘制中
  const draw = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing || !isMouseDown) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, isMouseDown]);

  // 更新鼠标位置
  const updateMousePosition = useCallback((e: React.MouseEvent) => {
    const slideWrapper = e.currentTarget as HTMLElement;
    const rect = slideWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  }, []);

  // 清除当前页面的画布
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 同时清除保存的绘制数据
      setSlideDrawings(prev => {
        const newDrawings = { ...prev };
        delete newDrawings[currentSlideIndex];
        return newDrawings;
      });
    }
  }, [currentSlideIndex]);

  // 切换绘制模式
  const toggleDrawMode = useCallback(() => {
    setDrawMode(prev => prev === 'pen' ? 'eraser' : 'pen');
  }, []);

  // 选择颜色
  const selectColor = useCallback((color: string) => {
    setPenColor(color);
    setDrawMode('pen');
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        nextSlide();
        break;
      case 'ArrowLeft':
        previousSlide();
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  }, [nextSlide, previousSlide, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initCanvas]);

  // 页面切换时恢复绘制内容
  useEffect(() => {
    const timer = setTimeout(() => {
      restoreSlideDrawing();
    }, 100); // 延迟恢复，确保画布已经初始化完成

    return () => {
      clearTimeout(timer);
    };
  }, [currentSlideIndex, restoreSlideDrawing]);

  return (
    <div className="playback-modal">
      <div className="playback-content">

        {/* 幻灯片容器 */}
        <div className="slide-container">
          {currentSlide && (
            <div
              className="slide-wrapper"
              onMouseMove={updateMousePosition}
              style={{
                aspectRatio: aspectRatio === '16:9' ? '16/9' : '4/3',
                maxWidth: aspectRatio === '16:9' ? '90vw' : '80vw',
                maxHeight: aspectRatio === '16:9' ? '50.625vw' : '60vw'
              }}
            >
              <iframe
                srcDoc={
                  project.theme
                    ? ThemeUtils.generateHtmlWithUserTheme(currentSlide.html, project.theme)
                    : project.config?.themeColors
                      ? ThemeUtils.generateHtmlWithTheme(currentSlide.html, project.config.themeColors)
                      : currentSlide.html
                }
                title={`播放: ${currentSlide.name}`}
                className="slide-frame"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                      // 设置iframe内容以适应容器
                      const viewport = iframeDoc.querySelector('meta[name="viewport"]');
                      if (!viewport) {
                        const meta = iframeDoc.createElement('meta');
                        meta.name = 'viewport';
                        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                        iframeDoc.head.appendChild(meta);
                      }

                      // 确保内容填满整个iframe
                      const style = iframeDoc.createElement('style');
                      style.textContent = `
                        html, body {
                          margin: 0;
                          padding: 0;
                          height: 100%;
                          width: 100%;
                          overflow: hidden;
                        }
                        body {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                      `;
                      iframeDoc.head.appendChild(style);
                    }
                  } catch (error) {
                    // 跨域iframe无法访问，忽略错误
                  }
                  initCanvas();
                }}
              />
              <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => {
                  setIsMouseDown(false);
                  // 绘制结束时保存当前页面的绘制内容
                  saveCurrentSlideDrawing();
                }}
                onMouseLeave={() => {
                  setIsMouseDown(false);
                  // 绘制结束时保存当前页面的绘制内容
                  saveCurrentSlideDrawing();
                }}
                style={{
                  pointerEvents: isDrawing ? 'auto' : 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 100,
                  cursor: isDrawing && drawMode === 'eraser' ? 'none' : 'crosshair'
                }}
              />
              <div
                className="red-dot-container"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: isDrawing ? 'none' : 'auto',
                  zIndex: isDrawing ? 99 : 101
                }}
                onMouseMove={updateMousePosition}
              >
                {showRedDot && !isDrawing && (
                  <div
                    className="red-dot"
                    style={{
                      left: mousePosition.x,
                      top: mousePosition.y,
                    }}
                  />
                )}
                {/* 黑板擦指示器 */}
                {isDrawing && drawMode === 'eraser' && (
                  <>
                    <div
                      className="eraser-indicator"
                      style={{
                        left: mousePosition.x,
                        top: mousePosition.y,
                      }}
                    />
                    <div
                      className="eraser-icon"
                      style={{
                        left: mousePosition.x,
                        top: mousePosition.y,
                      }}
                    >
                      🧽
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 左侧导航 */}
        <div className="side-nav left-nav">
          <button
            className="nav-btn"
            onClick={() => {
              saveCurrentSlideDrawing();
              setTimeout(() => {
                previousSlide();
              }, 10);
            }}
            disabled={currentSlideIndex === 0}
            title="上一页"
          >
            ‹
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              saveCurrentSlideDrawing();
              setTimeout(() => {
                nextSlide();
              }, 10);
            }}
            disabled={currentSlideIndex === project.slides.length - 1}
            title="下一页"
          >
            ›
          </button>
        </div>

        {/* 右侧导航 */}
        <div className="side-nav right-nav">
          <button
            className="nav-btn"
            onClick={() => {
              saveCurrentSlideDrawing();
              setTimeout(() => {
                previousSlide();
              }, 10);
            }}
            disabled={currentSlideIndex === 0}
            title="上一页"
          >
            ‹
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              saveCurrentSlideDrawing();
              setTimeout(() => {
                nextSlide();
              }, 10);
            }}
            disabled={currentSlideIndex === project.slides.length - 1}
            title="下一页"
          >
            ›
          </button>
        </div>

        {/* 底部工具栏 */}
        <div className="drawing-tools">
          {/* 绘制工具 */}
          <div className="tool-group">
            <button
              className={`tool-btn ${isDrawing && drawMode === 'pen' ? 'active' : ''}`}
              onClick={() => {
                // 如果已经激活了画笔，则取消绘图模式
                if (isDrawing && drawMode === 'pen') {
                  setIsDrawing(false);
                } else {
                  setIsDrawing(true);
                  setDrawMode('pen');
                }
              }}
              title="画笔"
            >
              ✏️
            </button>
            <button
              className={`tool-btn ${isDrawing && drawMode === 'eraser' ? 'active' : ''}`}
              onClick={() => {
                // 如果已经激活了橡皮擦，则取消绘图模式
                if (isDrawing && drawMode === 'eraser') {
                  setIsDrawing(false);
                } else {
                  setIsDrawing(true);
                  setDrawMode('eraser');
                }
              }}
              title="黑板擦"
            >
              🧽
            </button>
          </div>

          {/* 颜色选择器 */}
          {isDrawing && drawMode === 'pen' && (
            <div className="color-picker">
              <button
                className={`color-btn ${penColor === '#ff0000' ? 'active' : ''}`}
                onClick={() => selectColor('#ff0000')}
                title="红色"
                style={{ backgroundColor: '#ff0000' }}
              />
              <button
                className={`color-btn ${penColor === '#0000ff' ? 'active' : ''}`}
                onClick={() => selectColor('#0000ff')}
                title="蓝色"
                style={{ backgroundColor: '#0000ff' }}
              />
              <button
                className={`color-btn ${penColor === '#00ff00' ? 'active' : ''}`}
                onClick={() => selectColor('#00ff00')}
                title="绿色"
                style={{ backgroundColor: '#00ff00' }}
              />
              <button
                className={`color-btn ${penColor === '#ffff00' ? 'active' : ''}`}
                onClick={() => selectColor('#ffff00')}
                title="黄色"
                style={{ backgroundColor: '#ffff00' }}
              />
              <button
                className={`color-btn ${penColor === '#000000' ? 'active' : ''}`}
                onClick={() => selectColor('#000000')}
                title="黑色"
                style={{ backgroundColor: '#000000' }}
              />
            </div>
          )}

          {/* 其他工具 */}
          <div className="tool-group">
            <button
              className={`tool-btn ${showRedDot ? 'active' : ''}`}
              onClick={() => setShowRedDot(!showRedDot)}
              title="红点"
            >
              🔴
            </button>
            <button
              className="tool-btn"
              onClick={clearCanvas}
              title="清除"
            >
              🗑️
            </button>
            <button
              className="tool-btn"
              onClick={toggleFullscreen}
              title="全屏"
            >
              ⛶
            </button>
            <button
              className="tool-btn close-btn"
              onClick={onClose}
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackModal;