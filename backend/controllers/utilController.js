import * as cheerio from 'cheerio';

export const getMetadata = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        let description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        let image = $('meta[property="og:image"]').attr('content') || '';

        // 메타데이터에 image가 없다면 본문의 iframe을 체크하여 다시 시도합니다 (예: 네이버 블로그)
        if (!image) {
            const iframe = $('iframe').first();
            if (iframe.length > 0) {
                const iframeSrc = iframe.attr('src');
                if (iframeSrc) {
                    let iframeUrl = iframeSrc;
                    if (iframeUrl.startsWith('//')) {
                        iframeUrl = 'https:' + iframeUrl;
                    } else if (iframeUrl.startsWith('/')) {
                        const urlObj = new URL(targetUrl);
                        iframeUrl = urlObj.origin + iframeUrl;
                    } else if (!iframeUrl.startsWith('http')) {
                        const urlObj = new URL(targetUrl);
                        iframeUrl = urlObj.origin + '/' + iframeUrl;
                    }

                    try {
                        const iframeRes = await fetch(iframeUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                            }
                        });
                        
                        if (iframeRes.ok) {
                            const iframeHtml = await iframeRes.text();
                            const $iframe = cheerio.load(iframeHtml);

                            title = $iframe('meta[property="og:title"]').attr('content') || $iframe('title').text() || title;
                            description = $iframe('meta[property="og:description"]').attr('content') || $iframe('meta[name="description"]').attr('content') || description;
                            image = $iframe('meta[property="og:image"]').attr('content') || image;
                        }
                    } catch (e) {
                        console.error('Error fetching iframe metadata:', e.message);
                    }
                }
            }
        }

        if (image && image.startsWith('//')) {
            image = 'https:' + image;
        } else if (image && image.startsWith('/')) {
            const urlObj = new URL(targetUrl);
            image = urlObj.origin + image;
        }

        res.json({ title, description, image, url: targetUrl });
    } catch (error) {
        console.error('Error fetching metadata:', error.message);
        res.status(500).json({ error: 'Failed to fetch metadata' });
    }
};
