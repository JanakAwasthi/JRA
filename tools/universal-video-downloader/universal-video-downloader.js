/**
 * Universal Video Downloader
 * Supports multiple video platforms with intelligent platform detection
 */

class UniversalVideoDownloader {
    constructor() {
        this.currentVideoData = null;
        this.supportedPlatforms = {
            youtube: {
                name: 'YouTube',
                icon: 'fab fa-youtube',
                color: 'text-red-500',
                regex: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
                domains: ['youtube.com', 'youtu.be']
            },
            vimeo: {
                name: 'Vimeo',
                icon: 'fab fa-vimeo',
                color: 'text-blue-500',
                regex: /vimeo\.com\/(?:.*\/)?(\d+)/,
                domains: ['vimeo.com']
            },
            instagram: {
                name: 'Instagram',
                icon: 'fab fa-instagram',
                color: 'text-pink-500',
                regex: /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/,
                domains: ['instagram.com']
            },
            tiktok: {
                name: 'TikTok',
                icon: 'fab fa-tiktok',
                color: 'text-gray-900',
                regex: /tiktok\.com\/@[^\/]+\/video\/(\d+)/,
                domains: ['tiktok.com']
            },
            facebook: {
                name: 'Facebook',
                icon: 'fab fa-facebook',
                color: 'text-blue-600',
                regex: /facebook\.com\/.*\/videos\/(\d+)/,
                domains: ['facebook.com', 'fb.watch']
            },
            twitter: {
                name: 'Twitter',
                icon: 'fab fa-twitter',
                color: 'text-blue-400',
                regex: /twitter\.com\/[^\/]+\/status\/(\d+)/,
                domains: ['twitter.com', 't.co']
            },
            dailymotion: {
                name: 'Dailymotion',
                icon: 'fas fa-video',
                color: 'text-orange-500',
                regex: /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
                domains: ['dailymotion.com']
            },
            twitch: {
                name: 'Twitch',
                icon: 'fab fa-twitch',
                color: 'text-purple-500',
                regex: /twitch\.tv\/videos\/(\d+)/,
                domains: ['twitch.tv']
            }
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // URL input listener
        document.getElementById('video-url').addEventListener('input', (e) => {
            this.onURLChange(e.target.value);
        });

        // Enter key support
        document.getElementById('video-url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeVideo();
            }
        });

        // Quality and format change listeners
        document.getElementById('quality-select').addEventListener('change', () => {
            this.updateDownloadOptions();
        });

        document.getElementById('format-select').addEventListener('change', () => {
            this.updateDownloadOptions();
        });
    }

    onURLChange(url) {
        const analyzeBtn = document.getElementById('analyze-btn');
        
        if (url.trim()) {
            const platform = this.detectPlatform(url);
            if (platform) {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                this.showPlatformDetection(platform);
            } else {
                analyzeBtn.disabled = true;
                analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
                this.hidePlatformDetection();
            }
        } else {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
            this.hidePlatformDetection();
        }
    }

    detectPlatform(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
            
            for (const [key, platform] of Object.entries(this.supportedPlatforms)) {
                if (platform.domains.some(domain => hostname.includes(domain))) {
                    return { key, ...platform };
                }
            }
            
            // Fallback to regex matching
            for (const [key, platform] of Object.entries(this.supportedPlatforms)) {
                if (platform.regex.test(url)) {
                    return { key, ...platform };
                }
            }
        } catch (error) {
            console.warn('Invalid URL:', url);
        }
        
        return null;
    }

    showPlatformDetection(platform) {
        const detectionDiv = document.getElementById('platform-detection');
        const platformDiv = document.getElementById('detected-platform');
        
        platformDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="${platform.icon} ${platform.color} text-2xl"></i>
                <div>
                    <h4 class="font-medium text-gray-900">${platform.name}</h4>
                    <p class="text-sm text-green-600">✓ Supported platform</p>
                </div>
            </div>
        `;
        
        platformDiv.className = 'flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200';
        detectionDiv.classList.remove('hidden');
    }

    hidePlatformDetection() {
        document.getElementById('platform-detection').classList.add('hidden');
    }

    async analyzeVideo() {
        const url = document.getElementById('video-url').value.trim();
        if (!url) {
            this.showError('Please enter a video URL');
            return;
        }

        const platform = this.detectPlatform(url);
        if (!platform) {
            this.showError('Unsupported platform or invalid URL');
            return;
        }

        this.showLoading();

        try {
            // Simulate video analysis with demo data
            const videoData = await this.fetchVideoInfo(url, platform);
            
            if (videoData) {
                this.currentVideoData = videoData;
                this.displayVideoInfo(videoData);
                this.showDownloadOptions();
                this.showVideoPreview(videoData);
            } else {
                throw new Error('Could not fetch video information');
            }
        } catch (error) {
            this.showError('Failed to analyze video: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async fetchVideoInfo(url, platform) {
        // Simulate API call with demo data
        return new Promise((resolve) => {
            setTimeout(() => {
                const demoData = this.generateDemoVideoInfo(platform);
                resolve(demoData);
            }, 1500);
        });
    }

    generateDemoVideoInfo(platform) {
        const videoId = Math.random().toString(36).substr(2, 9);
        
        return {
            id: videoId,
            title: `Sample ${platform.name} Video`,
            author: `Sample ${platform.name} Creator`,
            thumbnail: `https://picsum.photos/320/180?random=${videoId}`,
            duration: this.formatDuration(Math.floor(Math.random() * 600) + 60),
            views: this.formatNumber(Math.floor(Math.random() * 1000000) + 1000),
            upload_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            platform: platform.key,
            url: document.getElementById('video-url').value.trim()
        };
    }

    displayVideoInfo(videoData) {
        // Update video details
        document.getElementById('video-thumbnail').src = videoData.thumbnail;
        document.getElementById('video-title').textContent = videoData.title;
        document.getElementById('video-author').textContent = videoData.author;
        document.getElementById('video-duration').textContent = videoData.duration;
        document.getElementById('video-views').textContent = videoData.views + ' views';
        document.getElementById('video-upload-date').textContent = videoData.upload_date;

        // Show video analysis section
        document.getElementById('video-analysis').classList.remove('hidden');
    }

    showVideoPreview(videoData) {
        const preview = document.getElementById('video-preview');
        const container = document.getElementById('video-container');
        const player = document.getElementById('video-player');

        preview.classList.add('video-ready');
        
        // Set thumbnail as poster
        player.poster = videoData.thumbnail;
        
        // For demo, we'll just show the thumbnail
        // In a real implementation, you'd set the video source
        
        container.classList.remove('hidden');

        // Hide placeholder
        preview.querySelector('i').style.display = 'none';
        preview.querySelector('p').style.display = 'none';
    }

    showDownloadOptions() {
        document.getElementById('download-options').classList.remove('hidden');
        this.updateDownloadOptions();
    }

    updateDownloadOptions() {
        const quality = document.getElementById('quality-select').value;
        const format = document.getElementById('format-select').value;
        
        // Update format options based on quality selection
        if (quality === 'audio') {
            // Show only audio formats
            const formatSelect = document.getElementById('format-select');
            formatSelect.innerHTML = `
                <option value="mp3">MP3 (Audio)</option>
                <option value="m4a">M4A (Audio)</option>
                <option value="wav">WAV (Audio)</option>
                <option value="flac">FLAC (Audio)</option>
            `;
        } else {
            // Show video formats
            const formatSelect = document.getElementById('format-select');
            formatSelect.innerHTML = `
                <option value="mp4">MP4 (Video)</option>
                <option value="webm">WebM (Video)</option>
                <option value="avi">AVI (Video)</option>
                <option value="mov">MOV (Video)</option>
            `;
        }
    }    async startDownload() {
        if (!this.currentVideoData) {
            this.showError('Please analyze a video first');
            return;
        }

        const quality = document.getElementById('quality-select').value;
        const format = document.getElementById('format-select').value;

        this.showDownloadProgress();
        
        try {
            // Try to get actual download URL
            const downloadUrl = await this.getUniversalDownloadUrl(this.currentVideoData.url, quality, format);
            
            if (downloadUrl) {
                this.startActualDownload(downloadUrl, quality, format);
            } else {
                await this.simulateDownloadProcess();
                this.showDownloadInstructions({
                    video: this.currentVideoData,
                    quality,
                    format
                });
            }
        } catch (error) {
            console.error('Download error:', error);
            await this.simulateDownloadProcess();
            this.showDownloadInstructions({
                video: this.currentVideoData,
                quality,
                format
            });
        }
    }

    async getUniversalDownloadUrl(videoUrl, quality, format) {
        // Universal video download APIs
        const universalApis = [
            'https://api.cobalt.tools/api/json',
            'https://api.downloadvideo.com/convert',
            'https://api.savefrom.net/info',
            'https://api.y2mate.guru/api/convert'
        ];

        for (const apiUrl of universalApis) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: videoUrl,
                        quality: quality,
                        format: format
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url || data.download_url || data.link) {
                        return data.url || data.download_url || data.link;
                    }
                }
            } catch (error) {
                continue;
            }
        }

        // Try platform-specific methods
        const platform = this.detectPlatform(videoUrl);
        if (platform) {
            return await this.getPlatformSpecificUrl(videoUrl, platform, quality, format);
        }

        return null;
    }

    async getPlatformSpecificUrl(videoUrl, platform, quality, format) {
        switch (platform.name) {
            case 'YouTube':
                return await this.getYouTubeUrl(videoUrl, quality, format);
            case 'Vimeo':
                return await this.getVimeoUrl(videoUrl, quality, format);
            case 'Instagram':
                return await this.getInstagramUrl(videoUrl, quality, format);
            case 'TikTok':
                return await this.getTikTokUrl(videoUrl, quality, format);
            default:
                return null;
        }
    }

    async getYouTubeUrl(videoUrl, quality, format) {
        // Extract video ID
        const videoId = videoUrl.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        if (!videoId) return null;

        // Try Invidious instances
        const invidiousInstances = ['yewtu.be', 'invidious.kavin.rocks'];
        
        for (const instance of invidiousInstances) {
            try {
                const response = await fetch(`https://${instance}/api/v1/videos/${videoId}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    if (format.includes('audio') && data.adaptiveFormats) {
                        const audioStream = data.adaptiveFormats.find(stream => 
                            stream.type.includes('audio')
                        );
                        if (audioStream) return audioStream.url;
                    } else if (data.formatStreams) {
                        const videoStream = data.formatStreams.find(stream => 
                            stream.qualityLabel === quality
                        );
                        if (videoStream) return videoStream.url;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async getVimeoUrl(videoUrl, quality, format) {
        try {
            // Extract video ID from Vimeo URL
            const videoId = videoUrl.match(/vimeo\.com\/(?:.*\/)?(\d+)/)?.[1];
            if (!videoId) return null;

            // Try Vimeo API (note: may require authentication for some videos)
            const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
            if (response.ok) {
                const data = await response.json();
                if (data && data[0]) {
                    // Return appropriate quality URL
                    if (quality === '1080p' && data[0].hd) return data[0].hd;
                    if (quality === '720p' && data[0].mobile) return data[0].mobile;
                    return data[0].url;
                }
            }
        } catch (error) {
            console.warn('Vimeo download failed:', error);
        }
        return null;
    }

    async getInstagramUrl(videoUrl, quality, format) {
        // Instagram requires more complex handling due to authentication
        // This is a simplified version
        try {
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(`${corsProxy}${encodeURIComponent(videoUrl)}`);
            
            if (response.ok) {
                const html = await response.text();
                // Look for video URLs in the HTML
                const videoMatch = html.match(/"video_url":"([^"]+)"/);
                if (videoMatch) {
                    return videoMatch[1].replace(/\\u0026/g, '&');
                }
            }
        } catch (error) {
            console.warn('Instagram download failed:', error);
        }
        return null;
    }

    async getTikTokUrl(videoUrl, quality, format) {
        // TikTok also requires complex handling
        try {
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(`${corsProxy}${encodeURIComponent(videoUrl)}`);
            
            if (response.ok) {
                const html = await response.text();
                // Look for video download URLs
                const videoMatch = html.match(/"downloadAddr":"([^"]+)"/);
                if (videoMatch) {
                    return videoMatch[1].replace(/\\u0026/g, '&');
                }
            }
        } catch (error) {
            console.warn('TikTok download failed:', error);
        }
        return null;
    }

    startActualDownload(downloadUrl, quality, format) {
        const filename = `${this.currentVideoData.title || 'video'}_${quality}.${format}`;
        
        // Try direct download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Also try fetch and download for CORS-enabled URLs
        this.fetchAndDownload(downloadUrl, filename).catch(() => {
            // Fallback: open in new tab
            window.open(downloadUrl, '_blank');
        });

        this.showDownloadSuccess(filename);
    }

    async fetchAndDownload(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            throw error;
        }
    }

    showDownloadSuccess(filename) {
        this.showNotification(`Download started: ${filename}`, 'success');
        
        // Hide progress and show success
        document.getElementById('download-progress').classList.add('hidden');
        
        const successHtml = `
            <div class="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                <i class="fas fa-check-circle text-4xl text-green-600 mb-4"></i>
                <h3 class="text-lg font-semibold text-green-800 mb-2">Download Started!</h3>
                <p class="text-green-700 mb-4">Your video download has been initiated.</p>
                <p class="text-sm text-green-600">File: ${filename}</p>
            </div>
        `;
        
        document.getElementById('download-instructions').innerHTML = successHtml;
        document.getElementById('download-instructions').classList.remove('hidden');
    }

    showDownloadProgress() {
        const progressDiv = document.getElementById('download-progress');
        progressDiv.classList.remove('hidden');
        
        // Hide other sections temporarily
        document.getElementById('download-instructions').classList.add('hidden');
    }

    async simulateDownloadProcess() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const progressPercentage = document.getElementById('progress-percentage');
        const progressStatus = document.getElementById('progress-status');

        const steps = [
            { progress: 20, text: 'Analyzing video...', status: 'Connecting to platform...' },
            { progress: 40, text: 'Extracting metadata...', status: 'Reading video information...' },
            { progress: 60, text: 'Processing quality options...', status: 'Finding best download links...' },
            { progress: 80, text: 'Preparing download...', status: 'Optimizing for selected format...' },
            { progress: 100, text: 'Complete!', status: 'Ready to download' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            progressPercentage.textContent = step.progress + '%';
            progressStatus.textContent = step.status;
        }

        // Hide progress after completion
        setTimeout(() => {
            document.getElementById('download-progress').classList.add('hidden');
        }, 1000);
    }

    showDownloadInstructions(downloadData) {
        const instructionsDiv = document.getElementById('download-instructions');
        const contentDiv = document.getElementById('instructions-content');
        
        const platform = this.supportedPlatforms[downloadData.video.platform];
        
        contentDiv.innerHTML = `
            <div class="space-y-4">
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 class="font-medium text-yellow-800 mb-2">Important Notice</h4>
                    <p class="text-yellow-700 text-sm">Direct browser downloads are limited due to platform restrictions and CORS policies. Please use one of the methods below.</p>
                </div>
                
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-900">Download Options for ${platform.name}:</h4>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h5 class="font-medium text-gray-800 flex items-center">
                            <i class="fas fa-desktop mr-2"></i>Desktop Software (Recommended)
                        </h5>
                        <p class="text-sm text-gray-600 mb-2">Use professional downloading tools:</p>
                        <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
                            <li><strong>yt-dlp</strong> - Command line tool (supports 1000+ sites)</li>
                            <li><strong>4K Video Downloader</strong> - User-friendly GUI application</li>
                            <li><strong>JDownloader</strong> - Multi-platform download manager</li>
                            <li><strong>VLC Media Player</strong> - Can download and convert videos</li>
                        </ul>
                    </div>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h5 class="font-medium text-gray-800 flex items-center">
                            <i class="fas fa-globe mr-2"></i>Online Services
                        </h5>
                        <p class="text-sm text-gray-600 mb-2">Web-based downloaders (use with caution):</p>
                        <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
                            <li>Search for "${platform.name.toLowerCase()} to ${downloadData.format}" converters</li>
                            <li>Verify the site's reputation before use</li>
                            <li>Avoid sites requesting personal information</li>
                        </ul>
                    </div>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h5 class="font-medium text-gray-800 flex items-center">
                            <i class="fas fa-puzzle-piece mr-2"></i>Browser Extensions
                        </h5>
                        <p class="text-sm text-gray-600 mb-2">Install trusted extensions from your browser's store</p>
                        <p class="text-xs text-gray-500">⚠️ Only install extensions from official stores</p>
                    </div>
                    
                    <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 class="font-medium text-blue-800">Command Line Example (yt-dlp):</h5>
                        <code class="text-sm text-blue-700 block mt-1 p-2 bg-blue-100 rounded">
                            yt-dlp -f "${downloadData.quality === 'audio' ? 'bestaudio' : 'best[height<=' + downloadData.quality.replace('p', '') + ']'}" "${downloadData.video.url}"
                        </code>
                    </div>
                </div>
                
                <div class="text-center space-y-2">
                    <button onclick="window.open('${downloadData.video.url}', '_blank')" 
                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                        <i class="fas fa-external-link-alt mr-2"></i>Open Original Video
                    </button>
                    <p class="text-xs text-gray-500">Selected: ${downloadData.quality} quality, ${downloadData.format.toUpperCase()} format</p>
                </div>
            </div>
        `;
        
        instructionsDiv.classList.remove('hidden');
    }

    showLoading() {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    }

    hideLoading() {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Analyze Video';
    }

    showError(message) {
        const preview = document.getElementById('video-preview');
        preview.innerHTML = `
            <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
            <p class="text-red-500">${message}</p>
        `;
        preview.classList.remove('video-ready');
        
        // Hide other sections
        document.getElementById('video-analysis').classList.add('hidden');
        document.getElementById('download-options').classList.add('hidden');
        document.getElementById('download-instructions').classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = {
            success: 'bg-green-100 border-green-400 text-green-700',
            error: 'bg-red-100 border-red-400 text-red-700',
            info: 'bg-blue-100 border-blue-400 text-blue-700'
        }[type];

        notification.className = `fixed top-4 right-4 ${bgColor} px-6 py-4 rounded-lg border shadow-lg z-50 max-w-md`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 hover:opacity-70" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Global functions for HTML onclick handlers
function analyzeVideo() {
    universalDownloader.analyzeVideo();
}

function startDownload() {
    universalDownloader.startDownload();
}

function pasteFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(text => {
            document.getElementById('video-url').value = text;
            universalDownloader.onURLChange(text);
        }).catch(err => {
            console.warn('Could not read clipboard:', err);
        });
    }
}

// Initialize when DOM is loaded
let universalDownloader;
document.addEventListener('DOMContentLoaded', () => {
    universalDownloader = new UniversalVideoDownloader();
});
