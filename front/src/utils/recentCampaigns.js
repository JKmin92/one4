const RECENT_CAMPAIGNS_KEY = 'one4_recent_campaigns';
const MAX_RECENT_ITEMS = 50;

export const getLocalRecentCampaigns = () => {
    try {
        const item = localStorage.getItem(RECENT_CAMPAIGNS_KEY);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

export const addLocalRecentCampaign = (campaignCode) => {
    const current = getLocalRecentCampaigns();
    // Filter out if already exists to push it to the top
    const filtered = current.filter(code => String(code) !== String(campaignCode));
    filtered.unshift(campaignCode);
    
    if (filtered.length > MAX_RECENT_ITEMS) {
        filtered.pop();
    }
    
    localStorage.setItem(RECENT_CAMPAIGNS_KEY, JSON.stringify(filtered));
};

export const clearLocalRecentCampaigns = () => {
    localStorage.removeItem(RECENT_CAMPAIGNS_KEY);
};
