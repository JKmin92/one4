import { fetchMetadataFromUrl } from '../utils/metadataUtils.js';

export const getMetadata = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const metadata = await fetchMetadataFromUrl(url);
        res.json(metadata);
    } catch (error) {
        console.error('Error fetching metadata:', error.message);
        res.status(500).json({ error: 'Failed to fetch metadata' });
    }
};
