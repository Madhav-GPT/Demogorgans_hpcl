// Smart filtering logic to reduce noise before sending to Gemini

const HPCL_KEYWORDS = {
    // Products
    products: [
        'furnace oil', 'FO', 'diesel', 'HSD', 'LDO', 'LSHS',
        'bitumen', 'bunker', 'marine fuel', 'hexane', 'solvent',
        'turpentine', 'jute oil', 'industrial fuel'
    ],

    // Equipment/Operations
    equipment: [
        'boiler', 'furnace', 'kiln', 'genset', 'generator', 'captive power',
        'thermal plant', 'power plant', 'shipping', 'vessel', 'port',
        'road construction', 'paving', 'highway', 'refinery',
        'chemical plant', 'steel plant', 'cement plant'
    ],

    // High intent signals
    highIntent: [
        'tender', 'procurement', 'contract', 'bid', 'RFP',
        'commissioned', 'operational', 'supply contract'
    ],

    // Medium intent
    mediumIntent: [
        'expansion', 'new plant', 'new facility', 'investment',
        'to set up', 'plans to', 'announced', 'capacity addition'
    ],

    // Exclusions (noise)
    exclusions: [
        'petrol price', 'diesel price today', 'fuel price hike',
        'stock price', 'shares', 'dividend', 'quarterly results',
        'cricket', 'bollywood', 'entertainment', 'fashion'
    ]
};

export function calculateRelevanceScore(article) {
    const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
    let score = 0;

    // Check for exclusions first (instant reject)
    if (HPCL_KEYWORDS.exclusions.some(keyword => text.includes(keyword))) {
        return 0;
    }

    // Product mentions (30 points)
    const productMatches = HPCL_KEYWORDS.products.filter(p => text.includes(p));
    score += Math.min(productMatches.length * 15, 30);

    // Equipment mentions (30 points)
    const equipmentMatches = HPCL_KEYWORDS.equipment.filter(e => text.includes(e));
    score += Math.min(equipmentMatches.length * 10, 30);

    // Intent level (30 points)
    if (HPCL_KEYWORDS.highIntent.some(k => text.includes(k))) {
        score += 30;
    } else if (HPCL_KEYWORDS.mediumIntent.some(k => text.includes(k))) {
        score += 20;
    }

    // Freshness (10 points)
    if (article.pubDate) {
        const daysOld = (new Date() - new Date(article.pubDate)) / (1000 * 60 * 60 * 24);
        if (daysOld <= 1) score += 10;
        else if (daysOld <= 3) score += 7;
        else if (daysOld <= 7) score += 5;
    } else {
        score += 5; // Default if no date
    }

    return Math.min(score, 100);
}

export function filterArticles(articles) {
    return articles
        .map(article => ({
            ...article,
            relevance_score: calculateRelevanceScore(article)
        }))
        .filter(article => article.relevance_score >= 40) // Only pass 40+ to AI
        .sort((a, b) => b.relevance_score - a.relevance_score);
}
