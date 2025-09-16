import { Slide, Asset } from '../types';

export class SlideParser {
  static async parseHtmlFile(file: File): Promise<Slide> {
    const html = await this.readFileAsText(file);
    const assets = await this.extractAssets(html);

    return {
      id: this.generateId(),
      name: file.name.replace('.html', ''),
      html,
      order: 0,
      assets
    };
  }

  static async parseZipFile(file: File): Promise<Slide[]> {
    const JSZip = await import('jszip');
    const zip = await JSZip.loadAsync(file);
    const slides: Slide[] = [];

    // 查找所有HTML文件
    const htmlFiles = Object.keys(zip.files).filter(filename =>
      filename.toLowerCase().endsWith('.html')
    );

    for (const htmlFile of htmlFiles) {
      const htmlContent = await zip.file(htmlFile)!.async('text');
      const assets = await this.extractAssetsFromZip(zip, htmlContent, htmlFile);

      slides.push({
        id: this.generateId(),
        name: htmlFile.replace('.html', '').split('/').pop() || htmlFile,
        html: htmlContent,
        order: slides.length,
        assets
      });
    }

    return slides;
  }

  private static async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private static async extractAssets(html: string): Promise<Asset[]> {
    const assets: Asset[] = [];

    // 提取图片
    const imgMatches = html.match(/src=["']([^"']+)["']/g);
    if (imgMatches) {
      for (const match of imgMatches) {
        const src = match.match(/["']([^"']+)["']/)?.[1];
        if (src && !src.startsWith('data:')) {
          assets.push({
            filename: src,
            content: '',
            type: 'image'
          });
        }
      }
    }

    // 提取CSS文件
    const cssMatches = html.match(/href=["']([^"']+\.css)["']/g);
    if (cssMatches) {
      for (const match of cssMatches) {
        const href = match.match(/["']([^"']+)["']/)?.[1];
        if (href) {
          assets.push({
            filename: href,
            content: '',
            type: 'css'
          });
        }
      }
    }

    // 提取JS文件
    const jsMatches = html.match(/src=["']([^"']+\.js)["']/g);
    if (jsMatches) {
      for (const match of jsMatches) {
        const src = match.match(/["']([^"']+)["']/)?.[1];
        if (src) {
          assets.push({
            filename: src,
            content: '',
            type: 'js'
          });
        }
      }
    }

    return assets;
  }

  private static async extractAssetsFromZip(zip: any, html: string, basePath: string): Promise<Asset[]> {
    const assets: Asset[] = [];
    const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1);

    // 处理图片
    const imgMatches = html.match(/src=["']([^"']+)["']/g);
    if (imgMatches) {
      for (const match of imgMatches) {
        const src = match.match(/["']([^"']+)["']/)?.[1];
        if (src && !src.startsWith('data:')) {
          const fullPath = this.resolvePath(baseDir, src);
          const file = zip.file(fullPath);
          if (file) {
            const content = await file.async('arraybuffer');
            assets.push({
              filename: src,
              content,
              type: this.getAssetType(src)
            });
          }
        }
      }
    }

    return assets;
  }

  private static resolvePath(base: string, path: string): string {
    if (path.startsWith('/')) return path.substring(1);
    if (path.startsWith('http')) return path;
    return base + path;
  }

  private static getAssetType(filename: string): Asset['type'] {
    const ext = filename.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return 'image';
    }
    if (ext === 'css') return 'css';
    if (ext === 'js') return 'js';
    return 'other';
  }

  private static removeThemeCssLinks(html: string): string {
    // 移除指向theme.css或../theme.css的链接标签
    return html.replace(/<link[^>]*href=["'](?:\.\.\/)?theme\.css["'][^>]*>/gi, '');
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}