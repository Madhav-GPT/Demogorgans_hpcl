import React, { useState } from 'react';
import LeadCard from './components/dashboard/LeadCard';
import ContactModal from './components/dashboard/ContactModal';
import FeedbackChatbot from './components/Chatbot';
import { RefreshCw, Plus, Search, SlidersHorizontal, Home, Users, FileText, Settings, Zap, Flame } from 'lucide-react';
import './index.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const findLeads = async () => {
    setIsProcessing(true);
    setLeads([]);
    setLoadingMsg('🔍 Scanning industrial news sources...');

    try {
      const response = await fetch('/api/fetchNews');
      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      const articles = data.articles || [];
      setLoadingMsg(`📰 Found ${articles.length} articles. Analyzing with AI...`);

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        setLoadingMsg(`🧠 Analyzing (${i + 1}/${articles.length}): ${article.title?.substring(0, 40)}...`);

        try {
          const res = await fetch('/api/processLead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article })
          });

          const leadData = await res.json();
          if (leadData.success && leadData.lead) {
            setLeads(prev => [...prev, leadData.lead]);
          }
        } catch (err) {
          console.error('Error processing article:', err);
        }

        await new Promise(r => setTimeout(r, 300));
      }

    } catch (error) {
      console.error('Error finding leads:', error);
      setLoadingMsg('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
      setLoadingMsg('');
    }
  };

  // Categorize Leads
  const validLeads = leads.filter(l => l && l.lead_score !== undefined);
  const hotLeads = validLeads.filter(l => l.lead_score >= 75);
  const greatLeads = validLeads.filter(l => l.lead_score >= 60 && l.lead_score < 75);
  const mediumLeads = validLeads.filter(l => l.lead_score >= 40 && l.lead_score < 60);
  const lowLeads = validLeads.filter(l => l.lead_score < 40);

  // Filter leads based on active filter
  const getFilteredLeads = () => {
    switch (activeFilter) {
      case 'hot': return hotLeads;
      case 'great': return greatLeads;
      case 'medium': return mediumLeads;
      case 'low': return lowLeads;
      default: return validLeads;
    }
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">HP</div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active">
            <Home size={20} />
          </div>
          <div className="sidebar-item">
            <Users size={20} />
          </div>
          <div className="sidebar-item">
            <FileText size={20} />
          </div>
          <div className="sidebar-item">
            <Settings size={20} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="workspace-header">
          <h1 className="workspace-title">WORKSPACE</h1>

          <button
            className="new-task-btn"
            onClick={findLeads}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <RefreshCw size={16} className="loading-spinner" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Plus size={16} />
            )}
            {isProcessing ? 'Scanning...' : 'Find Leads'}
          </button>

          <div className="stats-header">
            <div className="stat-item">
              <span className="stat-value">{validLeads.length}</span>
              <span className="stat-label">Leads</span>
            </div>
            <div className="stat-item">
              <span className="stat-value up">{hotLeads.length}</span>
              <span className="stat-label">Hot</span>
              {hotLeads.length > 0 && <span className="stat-badge positive">+{hotLeads.length}</span>}
            </div>
            <div className="stat-item">
              <span className="stat-value down">{lowLeads.length}</span>
              <span className="stat-label">Low</span>
            </div>
          </div>
        </header>

        {/* Loading Indicator */}
        {loadingMsg && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            {loadingMsg}
          </div>
        )}

        {/* New Leads Section */}
        <section className="section">
          <div className="section-header">
            <div className="section-title-row">
              <h2 className="section-title">New Leads</h2>
              <span className="section-count">{validLeads.length} Leads</span>
            </div>

            <div className="filter-tabs">
              <button className="filter-btn">
                <Search size={14} />
              </button>
              <button className="filter-btn">
                <SlidersHorizontal size={14} />
              </button>
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${activeFilter === 'hot' ? 'hot' : ''}`}
                onClick={() => setActiveFilter('hot')}
              >
                <Flame size={14} />
                Hot Client
              </button>
              <button
                className={`filter-btn ${activeFilter === 'great' ? 'active' : ''}`}
                onClick={() => setActiveFilter('great')}
              >
                Great Interest
              </button>
              <button
                className={`filter-btn ${activeFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setActiveFilter('medium')}
              >
                Medium Interest
              </button>
              <button
                className={`filter-btn ${activeFilter === 'low' ? 'active' : ''}`}
                onClick={() => setActiveFilter('low')}
              >
                Low Interest
              </button>
            </div>
          </div>

          {/* Leads Grid */}
          {filteredLeads.length > 0 ? (
            <div className="leads-grid">
              {filteredLeads.map((lead, idx) => (
                <LeadCard
                  key={`lead-${idx}`}
                  lead={lead}
                  onContact={setSelectedLead}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Zap size={32} />
              </div>
              <h3>{isProcessing ? 'Scanning for leads...' : 'No leads found'}</h3>
              <p>
                {isProcessing
                  ? 'AI is analyzing industrial news for opportunities'
                  : 'Click "Find Leads" to discover new opportunities'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Contact Modal */}
      {selectedLead && (
        <ContactModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* AI Chatbot */}
      <FeedbackChatbot />
    </div>
  );
}

export default App;
