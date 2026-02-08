// Process article with Local Ollama LLM (qwen2.5:1.5b)

import { generateLLMResponse } from "../services/llmService.js";

export async function processLeadHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { article } = req.body;

    if (!article) {
        return res.status(400).json({ error: 'Article is required' });
    }

    const prompt = `You are a B2B lead intelligence analyst for HPCL (Hindustan Petroleum Corporation Limited).

Analyze this industrial news article and extract lead information.

ARTICLE:
Title: ${article.title || 'N/A'}
Description: ${article.description || 'N/A'}
Date: ${article.pubDate || 'N/A'}
Source: ${article.source_name || article.source_id || 'N/A'}

TASK: Extract structured lead data as JSON with these exact fields:

{
  "company_name": "Full legal company name (extract from article)",
  "industry_sector": "Primary industry (Steel/Cement/Shipping/Chemical/Power/Manufacturing/Infrastructure/Automotive/etc)",
  "location": {
    "city": "City name if mentioned",
    "state": "State name (Maharashtra/Gujarat/Tamil Nadu/etc)"
  },
  "facility_type": "Type of facility (Manufacturing plant/Power plant/Port/Refinery/etc)",
  "operational_signals": ["List specific equipment/operations detected"],
  "product_recommendations": [
    {
      "product": "HPCL product name",
      "confidence": 85,
      "reasoning": "Specific reason based on signals detected"
    }
  ],
  "intent_level": "High/Medium/Low",
  "urgency": "Immediate/Near-term/Long-term",
  "investment_amount": "If mentioned (e.g., Rs 500 crore)",
  "capacity_details": "Production capacity if mentioned"
}

HPCL PRODUCT PORTFOLIO:
1. Furnace Oil (FO) - Heavy fuel for boilers/furnaces
2. High Speed Diesel (HSD) - For gensets, vehicles
3. Light Diesel Oil (LDO) - For furnace start-up
4. LSHS - Low sulphur alternative to FO
5. Bitumen - Road construction, paving
6. Marine Bunker Fuels - Vessel fuel for shipping
7. Hexane - Solvent extraction
8. MTO - Paint/varnish industry
9. JBO - Jute textile processing

SIGNAL-TO-PRODUCT RULES:
- "boiler" OR "furnace" → Furnace Oil, LSHS
- "genset" OR "captive power" → HSD, LDO
- "shipping" OR "port" → Marine Bunker Fuels
- "road" OR "highway" → Bitumen
- "automotive plant" → HSD, LDO

Return ONLY valid JSON, no markdown, no explanations.`;

    try {
        console.log('🧠 Processing article with Local Qwen LLM...');
        console.log(`   Title: ${article.title?.substring(0, 50)}...`);

        const text = await generateLLMResponse(prompt);

        // Parse JSON response (handle markdown code blocks if present)
        let leadData;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            // Find JSON object in response
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON object found in response');
            }
            leadData = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error('❌ Failed to parse LLM response:', text.substring(0, 200));
            return res.status(500).json({
                success: false,
                error: 'Failed to parse AI response'
            });
        }

        // Calculate lead score
        const leadScore = calculateLeadScore(leadData, article);

        // Assign territory
        const territory = assignTerritory(leadData.location);

        // Add metadata
        const completeLead = {
            ...leadData,
            lead_score: leadScore,
            assigned_territory: territory,
            source_article: {
                title: article.title,
                url: article.link,
                date: article.pubDate,
                source: article.source_name || article.source_id
            },
            processed_at: new Date().toISOString()
        };

        console.log(`✅ Lead processed: ${leadData.company_name} (Score: ${leadScore})`);

        res.json({
            success: true,
            lead: completeLead
        });

    } catch (error) {
        console.error('❌ Error processing lead:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

function calculateLeadScore(leadData, article) {
    let score = 0;

    // Intent strength (30 points)
    const intentScores = { 'High': 30, 'Medium': 20, 'Low': 10 };
    score += intentScores[leadData.intent_level] || 10;

    // Product confidence (30 points)
    if (leadData.product_recommendations && leadData.product_recommendations.length > 0) {
        const avgConfidence = leadData.product_recommendations.reduce((sum, p) => sum + (p.confidence || 0), 0) / leadData.product_recommendations.length;
        score += (avgConfidence / 100) * 30;
    }

    // Urgency (20 points)
    const urgencyScores = { 'Immediate': 20, 'Near-term': 15, 'Long-term': 8 };
    score += urgencyScores[leadData.urgency] || 8;

    // Freshness (20 points)
    if (article.pubDate) {
        const pubDate = new Date(article.pubDate);
        const daysOld = (new Date() - pubDate) / (1000 * 60 * 60 * 24);
        if (daysOld <= 1) score += 20;
        else if (daysOld <= 3) score += 15;
        else if (daysOld <= 7) score += 10;
        else score += 5;
    } else {
        score += 10;
    }

    return Math.min(Math.round(score), 100);
}

function assignTerritory(location) {
    const territories = {
        'Northern': {
            states: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu', 'Kashmir'],
            office: 'Delhi DSRO'
        },
        'Southern': {
            states: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry'],
            office: 'Chennai DSRO'
        },
        'Eastern': {
            states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam', 'Tripura', 'Meghalaya', 'Sikkim'],
            office: 'Kolkata DSRO'
        },
        'Western': {
            states: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'],
            office: 'Mumbai DSRO'
        }
    };

    const state = location?.state || '';

    for (const [region, details] of Object.entries(territories)) {
        if (details.states.some(s => state.toLowerCase().includes(s.toLowerCase()))) {
            return {
                region: region,
                office: details.office
            };
        }
    }

    return {
        region: 'Central',
        office: 'Central DSRO'
    };
}
