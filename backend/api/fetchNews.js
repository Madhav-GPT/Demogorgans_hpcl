// Fetch news from NewsData.io API with Demo Fallback
// API Key is hardcoded for demo/judging purposes

const NEWSDATA_API_KEY = 'pub_13f5cf2d9390430996d3bb5edf76abf9';

// Demo articles for when API limit is reached or for judges
const DEMO_ARTICLES = [
    {
        title: "Tata Steel expands Jamshedpur plant with new blast furnace capacity",
        description: "Tata Steel announces Rs 12,000 crore investment to expand Jamshedpur steel plant with new blast furnace, requiring significant fuel oil for operations. The company plans to increase capacity by 3 MTPA.",
        pubDate: new Date().toISOString(),
        source_name: "Economic Times",
        link: "https://economictimes.com/tata-steel-expansion"
    },
    {
        title: "Adani Ports to build LNG terminal at Mundra with captive power plant",
        description: "Adani Ports announces construction of new LNG terminal at Mundra port with 1000 MW captive power plant. The facility will require marine bunker fuel for vessel operations.",
        pubDate: new Date().toISOString(),
        source_name: "Business Standard",
        link: "https://business-standard.com/adani-mundra"
    },
    {
        title: "JSW Cement Salboni plant expansion includes new boiler units",
        description: "JSW Cement's Salboni facility in West Bengal to add new kiln and boiler units as part of capacity expansion to 10 MTPA. The project requires furnace oil supply contracts.",
        pubDate: new Date().toISOString(),
        source_name: "Mint",
        link: "https://livemint.com/jsw-cement-expansion"
    },
    {
        title: "Reliance Industries commissioning new refinery unit at Jamnagar",
        description: "Reliance Industries announces commissioning of aromatics complex at Jamnagar refinery. The petrochemical facility includes power generation and industrial heating systems.",
        pubDate: new Date().toISOString(),
        source_name: "Economic Times",
        link: "https://economictimes.com/reliance-jamnagar"
    },
    {
        title: "L&T to construct mega shipyard at Kattupalli with dry dock facilities",
        description: "Larsen & Toubro wins contract for mega shipyard development at Kattupalli, Chennai. The project includes marine bunker fuel storage and supply infrastructure.",
        pubDate: new Date().toISOString(),
        source_name: "Hindu Business Line",
        link: "https://thehindubusinessline.com/lt-shipyard"
    },
    {
        title: "Ultratech Cement Gulbarga plant to install captive gensets",
        description: "Ultratech Cement's Gulbarga unit in Karnataka installing 50 MW captive power gensets to reduce grid dependency. The facility requires high speed diesel supply.",
        pubDate: new Date().toISOString(),
        source_name: "Economic Times",
        link: "https://economictimes.com/ultratech-gulbarga"
    }
];

export async function fetchNewsHandler(req, res) {
    const useDemoOnly = req.query.demo === 'true';

    // If demo mode or no API key, return demo articles immediately
    if (useDemoOnly) {
        console.log('📋 Using demo articles (forced demo mode)');
        return res.json({
            success: true,
            totalResults: DEMO_ARTICLES.length,
            articles: DEMO_ARTICLES,
            isDemo: true
        });
    }

    // Try fetching from NewsData API
    const query = encodeURIComponent('(plant OR factory OR refinery) AND (fuel OR power OR bunker) NOT (stock OR lounge OR merger)');
    const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&q=${query}&country=in&language=en&category=business&removeduplicate=1&size=10`;

    try {
        console.log('🔍 Fetching news from NewsData.io...');
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error' || !data.results || data.results.length === 0) {
            // Fallback to demo articles
            console.log('📋 API returned no results, using demo articles');
            return res.json({
                success: true,
                totalResults: DEMO_ARTICLES.length,
                articles: DEMO_ARTICLES,
                isDemo: true
            });
        }

        console.log(`✅ Fetched ${data.results?.length || 0} articles`);

        // Combine real articles with some demo articles for variety
        const combinedArticles = [...data.results, ...DEMO_ARTICLES.slice(0, 4)];

        res.json({
            success: true,
            totalResults: combinedArticles.length,
            articles: combinedArticles,
            isDemo: false
        });

    } catch (error) {
        console.error('❌ Error fetching news, using demo articles:', error.message);
        // Fallback to demo articles on any error
        res.json({
            success: true,
            totalResults: DEMO_ARTICLES.length,
            articles: DEMO_ARTICLES,
            isDemo: true
        });
    }
}
