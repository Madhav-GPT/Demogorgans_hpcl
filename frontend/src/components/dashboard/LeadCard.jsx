import React from 'react';
import { ExternalLink, Phone } from 'lucide-react';

const LeadCard = ({ lead, onContact }) => {
    // Safe accessors with fallbacks
    const score = lead?.lead_score || 0;
    const companyName = lead?.company_name || 'Unknown Company';
    const industry = lead?.industry_sector || lead?.industry || 'Industrial';

    // Handle location as object or string
    const getLocationString = () => {
        if (!lead?.location) return 'India';
        if (typeof lead.location === 'string') return lead.location;
        if (typeof lead.location === 'object') {
            const city = lead.location.city || '';
            const state = lead.location.state || '';
            if (city && state) return `${city}, ${state}`;
            return city || state || 'India';
        }
        return 'India';
    };

    // Get signals safely
    const signals = lead?.operational_signals || lead?.signals || [];

    const getInterestLevel = (score) => {
        if (score >= 75) return 'hot';
        if (score >= 60) return 'great';
        if (score >= 40) return 'medium';
        return 'low';
    };

    const getInterestDots = (score) => {
        const level = Math.ceil(score / 20);
        return Array(5).fill(0).map((_, i) => i < level);
    };

    const getInitials = (name) => {
        if (!name) return 'HP';
        const words = name.split(' ').filter(w => w.length > 0);
        if (words.length === 0) return 'HP';
        return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    const getStatusLabel = (score) => {
        if (score >= 75) return 'Hot Client';
        if (score >= 60) return 'High Interest';
        if (score >= 40) return 'Medium Interest';
        return 'Low Interest';
    };

    // Get a consistent color for the avatar based on company name
    const getAvatarColor = (name) => {
        if (!name) return '#4a90d9';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 60%, 50%)`;
    };

    const interestLevel = getInterestLevel(score);
    const dots = getInterestDots(score);
    const locationString = getLocationString();
    const avatarColor = getAvatarColor(companyName);

    return (
        <div className={`lead-card ${interestLevel === 'hot' ? 'hot' : ''}`}>
            {/* Status Badge */}
            <span className={`status-badge ${interestLevel}`}>
                {getStatusLabel(score)}
            </span>

            {/* Expand Button */}
            <div className="lead-card-header">
                <button className="lead-expand-btn" title="View details">
                    <ExternalLink size={14} />
                </button>
            </div>

            {/* Avatar */}
            <div
                className="lead-avatar"
                style={{
                    background: interestLevel === 'hot'
                        ? 'linear-gradient(135deg, #c8e94d 0%, #a3c41f 100%)'
                        : `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}99 100%)`
                }}
            >
                {getInitials(companyName)}
            </div>

            {/* Name & Role */}
            <h3 className="lead-name">{companyName}</h3>
            <p className="lead-role">
                {industry} • {locationString}
            </p>

            {/* Source */}
            <div className="lead-source">
                <span className="lead-source-label">Source</span>
                <div className="lead-source-tags">
                    <span className="source-tag">News</span>
                    {signals.slice(0, 1).map((signal, idx) => (
                        <span key={idx} className="source-tag">{signal}</span>
                    ))}
                </div>
            </div>

            {/* Interest Indicator */}
            <div className="interest-indicator">
                <span className="interest-label">{interestLevel === 'hot' ? 'High Interest' : 'Interest'}</span>
                {dots.map((active, idx) => (
                    <span
                        key={idx}
                        className={`interest-dot ${active ? 'active' : ''} ${interestLevel === 'hot' ? 'high' : ''}`}
                    />
                ))}
            </div>

            {/* Contact Button */}
            <button
                className="contact-btn"
                onClick={() => onContact(lead)}
            >
                <Phone size={14} />
                Contact
            </button>
        </div>
    );
};

export default LeadCard;
