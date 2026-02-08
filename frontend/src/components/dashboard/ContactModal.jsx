import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

const ContactModal = ({ lead, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Safely get lead properties
    const companyName = lead?.company_name || 'Unknown Company';
    const industry = lead?.industry_sector || lead?.industry || 'industrial';
    const intentLevel = lead?.intent_level || 'high';
    const firstProduct = lead?.product_recommendations?.[0]?.product || 'fuel';

    useEffect(() => {
        if (lead) {
            setMessage(`Hi, I saw that ${companyName} is ${intentLevel}ly looking for ${firstProduct}. We at HPCL can help.`);
        }
    }, [lead, companyName, intentLevel, firstProduct]);

    if (!lead) return null;

    const handleWhatsApp = () => {
        if (!phoneNumber) {
            setFeedback({ type: 'error', text: 'Please enter a phone number' });
            return;
        }
        let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanedNumber.length === 10) {
            cleanedNumber = '91' + cleanedNumber;
        }
        if (cleanedNumber.length < 10) {
            setFeedback({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
            return;
        }
        const url = `https://api.whatsapp.com/send?phone=${cleanedNumber}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    const handleTelegram = async () => {
        if (!phoneNumber) {
            setFeedback({ type: 'error', text: 'Please enter Chat ID for Telegram' });
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch('/api/sendAlert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: lead,
                    chatId: phoneNumber
                })
            });

            const data = await response.json();
            if (data.success) {
                setFeedback({ type: 'success', text: 'Telegram alert sent!' });
                setTimeout(onClose, 2000);
            } else {
                setFeedback({ type: 'error', text: data.error || 'Failed to send' });
            }
        } catch (err) {
            setFeedback({ type: 'error', text: err.message });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Contact {companyName}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                    Reach out regarding their {industry} requirements
                </p>

                <div className="form-group">
                    <label className="form-label">Phone Number / Chat ID</label>
                    <input
                        type="text"
                        className="form-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Message Preview</label>
                    <textarea
                        className="form-input form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                </div>

                {feedback && (
                    <div className={`feedback-alert ${feedback.type}`}>
                        {feedback.text}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-whatsapp" onClick={handleWhatsApp}>
                        <MessageSquare size={16} />
                        WhatsApp
                    </button>
                    <button
                        className="btn-telegram"
                        onClick={handleTelegram}
                        disabled={isSending}
                        style={{ opacity: isSending ? 0.7 : 1 }}
                    >
                        <Send size={16} />
                        {isSending ? 'Sending...' : 'Telegram'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
