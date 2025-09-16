import React, { useState } from 'react';
import { Project, Slide, ProjectConfig } from './types';
import { SlideParser } from './utils/slideParser';
import { ZipHandler } from './utils/zipHandler';
import Header from './components/Header';
import SlideList from './components/SlideList';
import PreviewPanel from './components/PreviewPanel';
import PlaybackModal from './components/PlaybackModal';
import ProjectConfigDialog from './components/ProjectConfigDialog';
import './App.css';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const handleImportHtml = async (files: FileList) => {
    const htmlFiles = Array.from(files).filter(file =>
      file.name.toLowerCase().endsWith('.html')
    );

    if (htmlFiles.length === 0) return;

    const newSlides: Slide[] = [];
    for (const file of htmlFiles) {
      const slide = await SlideParser.parseHtmlFile(file);
      newSlides.push(slide);
    }

    if (currentProject) {
      // 如果已有项目，添加新幻灯片
      const updatedProject = {
        ...currentProject,
        slides: [...currentProject.slides, ...newSlides],
        updatedAt: new Date()
      };
      setCurrentProject(updatedProject);
      if (!selectedSlide && newSlides.length > 0) {
        setSelectedSlide(newSlides[0]);
      }
    } else {
      // 创建新项目
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name: '新项目',
        slides: newSlides,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentProject(newProject);
      if (newSlides.length > 0) {
        setSelectedSlide(newSlides[0]);
      }
    }
  };

  const handleImportZip = async (file: File) => {
    try {
      const project = await ZipHandler.importProject(file);
      setCurrentProject(project);
      if (project.slides.length > 0) {
        setSelectedSlide(project.slides[0]);
      }
    } catch (error) {
      console.error('导入ZIP文件失败:', error);
      alert('导入ZIP文件失败，请检查文件格式');
    }
  };

  const handleOpenFolder = async (files: FileList) => {
    try {
      const project = await ZipHandler.importProjectFromFolder(files);
      setCurrentProject(project);
      if (project.slides.length > 0) {
        setSelectedSlide(project.slides[0]);
      }
    } catch (error) {
      console.error('打开文件夹失败:', error);
      alert('打开文件夹失败，请检查文件夹结构');
    }
  };

  const handleExportZip = async () => {
    if (!currentProject) return;

    try {
      const blob = await ZipHandler.exportProject(currentProject);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出ZIP文件失败:', error);
      alert('导出ZIP文件失败');
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;

    try {
      const blob = await ZipHandler.saveProject(currentProject);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存项目失败');
    }
  };

  const handlePlay = () => {
    if (currentProject && currentProject.slides.length > 0) {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleReorderSlides = (slides: Slide[]) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        slides: slides.map((slide, index) => ({ ...slide, order: index })),
        updatedAt: new Date()
      };
      setCurrentProject(updatedProject);
    }
  };

  const handleSlideSelect = (slide: Slide) => {
    setSelectedSlide(slide);
  };

  const handleSlideUpdate = (updatedSlide: Slide) => {
    if (!currentProject) return;

    const updatedSlides = currentProject.slides.map(slide =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    );

    const updatedProject = {
      ...currentProject,
      slides: updatedSlides,
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setSelectedSlide(updatedSlide);
  };

  const handlePlaybackSlideChange = (slide: Slide) => {
    setSelectedSlide(slide);
  };

  const handleAspectRatioChange = (ratio: '16:9' | '4:3') => {
    setAspectRatio(ratio);
  };

  const handleOpenConfigDialog = () => {
    setConfigDialogOpen(true);
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
  };

  const handleSaveProjectConfig = (config: ProjectConfig) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        name: config.title,
        config,
        updatedAt: new Date()
      };
      setCurrentProject(updatedProject);
    }
    setConfigDialogOpen(false);
  };

  return (
    <div className="app">
      <Header
        onImportHtml={handleImportHtml}
        onImportZip={handleImportZip}
        onOpenFolder={handleOpenFolder}
        onConfig={handleOpenConfigDialog}
        onSaveProject={handleSaveProject}
        onExportZip={handleExportZip}
        onPlay={handlePlay}
        onStop={handleStop}
        hasSlides={!!currentProject?.slides.length}
      />

      <div className="main-content">
        <SlideList
          project={currentProject}
          selectedSlide={selectedSlide}
          onSlideSelect={handleSlideSelect}
          onReorderSlides={handleReorderSlides}
          onImportHtml={handleImportHtml}
        />

        <PreviewPanel
          slide={selectedSlide}
          aspectRatio={aspectRatio}
          onAspectRatioChange={handleAspectRatioChange}
          themeConfig={currentProject?.config?.themeColors}
          userTheme={currentProject?.theme}
          onSlideUpdate={handleSlideUpdate}
        />
      </div>

      {isPlaying && currentProject && (
        <PlaybackModal
          project={currentProject}
          onClose={handleStop}
          aspectRatio={aspectRatio}
          onSlideChange={handlePlaybackSlideChange}
        />
      )}

      <ProjectConfigDialog
        open={configDialogOpen}
        config={currentProject?.config}
        onClose={handleCloseConfigDialog}
        onSave={handleSaveProjectConfig}
      />
    </div>
  );
};

export default App;