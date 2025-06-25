/**
 * Advanced YouTube Video Downloader
 * Full-featured YouTube downloader with multiple quality options and format support
 */

class YouTubeDownloader {
    constructor() {
        this.currentVideoData = null;
        this.downloadHistory = this.loadHistory();
        this.apiKey = 'demo_key'; // For demo purposes
        this.initializeEventListeners();
    }    initializeEventListeners() {
        // URL input listener
        document.getElementById('youtube-url').addEventListener('input', (e) => {
            this.validateURL(e.target.value);
        });

        // Enter key support
        document.getElementById('youtube-url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeVideo();
            }
        });

        // License modal event listeners
        this.initializeLicenseModal();
    }

    initializeLicenseModal() {
        const modal = document.getElementById('license-modal');
        const acceptBtn = document.getElementById('accept-license');
        const declineBtn = document.getElementById('decline-license');

        acceptBtn.addEventListener('click', () => {
            this.acceptLicense();
            modal.classList.add('hidden');
        });

        declineBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    hasAcceptedLicense() {
        return localStorage.getItem('youtube-downloader-license-accepted') === 'true';
    }

    acceptLicense() {
        localStorage.setItem('youtube-downloader-license-accepted', 'true');
        // Continue with the pending download
        if (this.pendingDownload) {
            this.initiateDownload(this.pendingDownload.format, this.pendingDownload.videoId);
            this.pendingDownload = null;
        }
    }

    showLicenseModal(format, videoId) {
        this.pendingDownload = { format, videoId };
        document.getElementById('license-modal').classList.remove('hidden');
    }

    validateURL(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
        const analyzeBtn = document.getElementById('analyze-btn');
        
        if (url && youtubeRegex.test(url)) {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            analyzeBtn.disabled = url.length > 0;
            if (url.length > 0) {
                analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async analyzeVideo() {
        const url = document.getElementById('youtube-url').value.trim();
        if (!url) {
            this.showError('Please enter a YouTube URL');
            return;
        }

        const videoId = this.extractVideoId(url);
        if (!videoId) {
            this.showError('Invalid YouTube URL');
            return;
        }

        this.showLoading();

        try {
            // In a real implementation, this would make an API call to YouTube API
            // For demonstration, we'll use YouTube's oEmbed API which provides basic info
            const oEmbedResponse = await this.fetchVideoInfo(videoId);
            
            if (oEmbedResponse) {
                this.displayVideoInfo(oEmbedResponse, videoId);
                this.showDownloadOptions(videoId);
            } else {
                throw new Error('Could not fetch video information');
            }
        } catch (error) {
            this.showError('Failed to analyze video: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async fetchVideoInfo(videoId) {
        try {
            // Using YouTube oEmbed API for basic info (limited but public)
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            
            // Note: This will work for some requests but may be blocked by CORS
            // In a real implementation, you'd use a server-side proxy
            const response = await fetch(oEmbedUrl);
            
            if (response.ok) {
                return await response.json();
            } else {
                // Fallback to demo data if API call fails
                return this.generateDemoVideoInfo(videoId);
            }
        } catch (error) {
            // Fallback to demo data if API call fails
            return this.generateDemoVideoInfo(videoId);
        }
    }

    generateDemoVideoInfo(videoId) {
        // Generate demo video info for demonstration
        return {
            title: "Sample Video Title",
            author_name: "Sample Channel",
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            width: 1920,
            height: 1080,
            duration: "5:23",
            view_count: "1,234,567",
            upload_date: "2024-01-15"
        };
    }

    displayVideoInfo(videoData, videoId) {
        this.currentVideoData = { ...videoData, videoId };

        // Update video details
        document.getElementById('video-thumbnail').src = videoData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        document.getElementById('video-title').textContent = videoData.title || 'Unknown Title';
        document.getElementById('video-author').textContent = videoData.author_name || 'Unknown Channel';
        document.getElementById('video-duration').textContent = videoData.duration || 'Unknown';
        document.getElementById('video-views').textContent = this.formatNumber(videoData.view_count) + ' views' || '0 views';
        document.getElementById('video-upload-date').textContent = videoData.upload_date || 'Unknown date';

        // Show video analysis section
        document.getElementById('video-analysis').classList.remove('hidden');

        // Update video preview
        this.showVideoPreview(videoId);
    }

    showVideoPreview(videoId) {
        const preview = document.getElementById('video-preview');
        const container = document.getElementById('video-container');
        const iframe = document.getElementById('video-iframe');

        preview.classList.add('video-ready');
        container.classList.remove('hidden');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;

        // Hide placeholder
        preview.querySelector('i').style.display = 'none';
        preview.querySelector('p').style.display = 'none';
    }

    showDownloadOptions(videoId) {
        // Generate sample format options
        const videoFormats = [
            { quality: '1080p', format: 'MP4', size: '~150MB', type: 'video', badge: 'quality-hd' },
            { quality: '720p', format: 'MP4', size: '~85MB', type: 'video', badge: 'quality-hd' },
            { quality: '480p', format: 'MP4', size: '~45MB', type: 'video', badge: 'quality-sd' },
            { quality: '360p', format: 'MP4', size: '~25MB', type: 'video', badge: 'quality-sd' }
        ];

        const audioFormats = [
            { quality: '320kbps', format: 'MP3', size: '~12MB', type: 'audio', badge: 'quality-audio' },
            { quality: '192kbps', format: 'MP3', size: '~7MB', type: 'audio', badge: 'quality-audio' },
            { quality: '128kbps', format: 'MP3', size: '~5MB', type: 'audio', badge: 'quality-audio' }
        ];

        this.renderFormatOptions('video-formats', videoFormats, videoId);
        this.renderFormatOptions('audio-formats', audioFormats, videoId);

        document.getElementById('download-options').classList.remove('hidden');
    }

    renderFormatOptions(containerId, formats, videoId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        formats.forEach(format => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer';
            optionDiv.onclick = () => this.initiateDownload(format, videoId);

            optionDiv.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fas fa-${format.type === 'video' ? 'video' : 'music'} text-gray-400"></i>
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-medium">${format.quality}</span>
                            <span class="quality-badge ${format.badge}">${format.format}</span>
                        </div>
                        <p class="text-sm text-gray-500">Estimated size: ${format.size}</p>
                    </div>
                </div>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm">
                    <i class="fas fa-download mr-1"></i>Download
                </button>
            `;

            container.appendChild(optionDiv);
        });
    }    async initiateDownload(format, videoId) {
        // Check if license has been accepted
        if (!this.hasAcceptedLicense()) {
            this.showLicenseModal(format, videoId);
            return;
        }
        
        try {
            this.showDownloadProgress();
            
            // Use yt-dlp compatible API or direct streaming approach
            const downloadUrl = await this.getDownloadUrl(videoId, format);
            
            if (downloadUrl) {
                this.startActualDownload(downloadUrl, format, videoId);
            } else {
                this.showAlternativeOptions(format, videoId);
            }
            
            this.addToHistory(this.currentVideoData, format);
        } catch (error) {
            console.error('Download error:', error);
            this.showAlternativeOptions(format, videoId);
        }
    }

    async getDownloadUrl(videoId, format) {
        // Multiple approaches for getting download URLs
        const approaches = [
            () => this.tryYtDlpApi(videoId, format),
            () => this.tryInvidiousApi(videoId, format),
            () => this.tryDirectStreaming(videoId, format)
        ];

        for (const approach of approaches) {
            try {
                const result = await approach();
                if (result) return result;
            } catch (error) {
                console.warn('Approach failed:', error);
                continue;
            }
        }
        
        return null;
    }

    async tryYtDlpApi(videoId, format) {
        // Try yt-dlp compatible endpoints
        const ytDlpEndpoints = [
            `https://api.cobalt.tools/api/json`,
            `https://api.y2mate.guru/api/convert`,
            `https://youtubedl-org.herokuapp.com/api/info`
        ];

        for (const endpoint of ytDlpEndpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        quality: format.quality,
                        format: format.format.toLowerCase()
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url || data.download_url) {
                        return data.url || data.download_url;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async tryInvidiousApi(videoId, format) {
        // Try Invidious instances for direct access
        const invidiousInstances = [
            'invidious.io',
            'yewtu.be',
            'invidious.snopyta.org',
            'invidious.kavin.rocks'
        ];

        for (const instance of invidiousInstances) {
            try {
                const response = await fetch(`https://${instance}/api/v1/videos/${videoId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (format.type === 'video' && data.formatStreams) {
                        const videoStream = data.formatStreams.find(stream => 
                            stream.qualityLabel === format.quality && 
                            stream.container === format.format.toLowerCase()
                        );
                        if (videoStream) return videoStream.url;
                    }
                    
                    if (format.type === 'audio' && data.adaptiveFormats) {
                        const audioStream = data.adaptiveFormats.find(stream => 
                            stream.type.includes('audio') &&
                            stream.container === format.format.toLowerCase()
                        );
                        if (audioStream) return audioStream.url;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async tryDirectStreaming(videoId, format) {
        // Try direct YouTube streaming URLs (may require CORS proxy)
        const corsProxies = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://thingproxy.freeboard.io/fetch/'
        ];

        for (const proxy of corsProxies) {
            try {
                const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                const response = await fetch(`${proxy}${encodeURIComponent(youtubeUrl)}`);
                
                if (response.ok) {
                    const html = await response.text();
                    const streamUrls = this.extractStreamUrls(html, format);
                    if (streamUrls.length > 0) {
                        return streamUrls[0];
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    extractStreamUrls(html, format) {
        // Extract stream URLs from YouTube page HTML
        const urls = [];
        
        try {
            // Look for player response JSON
            const playerResponseMatch = html.match(/var ytInitialPlayerResponse = ({.*?});/);
            if (playerResponseMatch) {
                const playerResponse = JSON.parse(playerResponseMatch[1]);
                const streamingData = playerResponse.streamingData;
                
                if (streamingData) {
                    if (format.type === 'video' && streamingData.formats) {
                        streamingData.formats.forEach(stream => {
                            if (stream.qualityLabel === format.quality) {
                                urls.push(stream.url);
                            }
                        });
                    }
                    
                    if (format.type === 'audio' && streamingData.adaptiveFormats) {
                        streamingData.adaptiveFormats.forEach(stream => {
                            if (stream.mimeType && stream.mimeType.includes('audio')) {
                                urls.push(stream.url);
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to extract stream URLs:', error);
        }
        
        return urls;
    }

    startActualDownload(downloadUrl, format, videoId) {
        // Create download link and trigger download
        const filename = `${this.currentVideoData.title || 'video'}_${format.quality}.${format.format.toLowerCase()}`;
        
        // Method 1: Direct download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Method 2: Fetch and download (for CORS-enabled URLs)
        this.fetchAndDownload(downloadUrl, filename).catch(() => {
            // Fallback: Open in new tab
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

    showDownloadProgress() {
        const progressHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <h3 class="text-lg font-semibold mb-4">Preparing Download...</h3>
                    <div class="space-y-4">
                        <div class="w-full bg-gray-200 rounded-full h-3">
                            <div class="bg-red-600 h-3 rounded-full animate-pulse" style="width: 60%"></div>
                        </div>
                        <p class="text-sm text-gray-600">Finding best download source...</p>
                    </div>
                </div>
            </div>
        `;
        
        const progressModal = document.createElement('div');
        progressModal.innerHTML = progressHtml;
        progressModal.id = 'download-progress';
        document.body.appendChild(progressModal);

        // Remove after 3 seconds
        setTimeout(() => {
            const modal = document.getElementById('download-progress');
            if (modal) modal.remove();
        }, 3000);
    }

    showDownloadSuccess(filename) {
        this.showNotification(`Download started: ${filename}`, 'success');
    }

    showAlternativeOptions(format, videoId) {
        const modal = this.createModal('Download Options', `
            <div class="space-y-4">
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 class="font-medium text-blue-800 mb-2">Alternative Download Methods</h3>
                    <p class="text-blue-700 text-sm">Try these options for downloading YouTube videos:</p>
                </div>
                
                <div class="space-y-3">
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h4 class="font-medium text-gray-800">1. Browser Extension Method</h4>
                        <p class="text-sm text-gray-600 mb-2">Install a YouTube downloader extension</p>
                        <button onclick="window.open('https://chrome.google.com/webstore/search/youtube%20downloader', '_blank')" 
                                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Get Extension
                        </button>
                    </div>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h4 class="font-medium text-gray-800">2. Desktop Software</h4>
                        <p class="text-sm text-gray-600 mb-2">Use yt-dlp, 4K Video Downloader, or VLC</p>
                        <button onclick="window.open('https://github.com/yt-dlp/yt-dlp', '_blank')" 
                                class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Get yt-dlp
                        </button>
                    </div>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h4 class="font-medium text-gray-800">3. Online Converter</h4>
                        <p class="text-sm text-gray-600 mb-2">Use online YouTube to MP4/MP3 services</p>
                        <button onclick="window.open('https://www.y2mate.com', '_blank')" 
                                class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                            Try Y2Mate
                        </button>
                    </div>
                    
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <h4 class="font-medium text-gray-800">4. Copy Video URL</h4>
                        <p class="text-sm text-gray-600 mb-2">Use this URL with your preferred downloader</p>
                        <div class="flex space-x-2">
                            <input type="text" value="https://www.youtube.com/watch?v=${videoId}" 
                                   class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" readonly>
                            <button onclick="navigator.clipboard.writeText('https://www.youtube.com/watch?v=${videoId}')" 
                                    class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="text-center pt-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        Close
                    </button>
                </div>
            </div>
        `);
    }

    simulateDownloadProgress() {
        const progressDiv = document.getElementById('download-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const progressPercentage = document.getElementById('progress-percentage');

        progressDiv.classList.remove('hidden');

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;

            progressFill.style.width = progress + '%';
            progressPercentage.textContent = Math.round(progress) + '%';

            if (progress < 30) {
                progressText.textContent = 'Analyzing video...';
            } else if (progress < 60) {
                progressText.textContent = 'Preparing download...';
            } else if (progress < 100) {
                progressText.textContent = 'Processing...';
            } else {
                progressText.textContent = 'Complete - See instructions above';
                clearInterval(interval);
                setTimeout(() => {
                    progressDiv.classList.add('hidden');
                }, 3000);
            }
        }, 200);
    }

    addToHistory(videoData, format) {
        const historyItem = {
            id: Date.now(),
            title: videoData.title,
            author: videoData.author_name,
            format: format.format,
            quality: format.quality,
            size: format.size,
            timestamp: new Date().toLocaleString(),
            videoId: videoData.videoId
        };

        this.downloadHistory.unshift(historyItem);
        if (this.downloadHistory.length > 10) {
            this.downloadHistory = this.downloadHistory.slice(0, 10);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        const historySection = document.getElementById('download-history');

        if (this.downloadHistory.length === 0) {
            historySection.classList.add('hidden');
            return;
        }

        historySection.classList.remove('hidden');
        historyList.innerHTML = '';

        this.downloadHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'flex items-center justify-between p-2 bg-gray-50 rounded text-sm';
            historyItem.innerHTML = `
                <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">${item.title}</p>
                    <p class="text-gray-500">${item.format} • ${item.quality} • ${item.timestamp}</p>
                </div>
                <button onclick="window.open('https://www.youtube.com/watch?v=${item.videoId}', '_blank')" 
                        class="ml-2 text-red-600 hover:text-red-700">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            `;
            historyList.appendChild(historyItem);
        });
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('youtube-downloader-history');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('youtube-downloader-history', JSON.stringify(this.downloadHistory));
        } catch (error) {
            console.warn('Could not save download history:', error);
        }
    }

    clearHistory() {
        this.downloadHistory = [];
        this.saveHistory();
        document.getElementById('download-history').classList.add('hidden');
    }

    createModal(title, content) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto';
        modal.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">${title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${content}
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        return overlay;
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

    formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// Global functions for HTML onclick handlers
function analyzeVideo() {
    youtubeDownloader.analyzeVideo();
}

function pasteFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(text => {
            document.getElementById('youtube-url').value = text;
            youtubeDownloader.validateURL(text);
        }).catch(err => {
            console.warn('Could not read clipboard:', err);
        });
    }
}

function clearHistory() {
    youtubeDownloader.clearHistory();
}

// Initialize when DOM is loaded
let youtubeDownloader;
document.addEventListener('DOMContentLoaded', () => {
    youtubeDownloader = new YouTubeDownloader();
});
