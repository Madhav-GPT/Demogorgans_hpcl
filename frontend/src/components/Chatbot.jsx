import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const FeedbackChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I can help you analyze leads. Ask me anything about the data or HPCL products.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I could not process that request.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button className="chatbot-trigger" onClick={toggleChat}>
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className="chatbot-panel">
            {/* Header */}
            <div className="chatbot-header">
                <span style={{ fontSize: '18px' }}>🤖</span>
                <span style={{ fontWeight: '600' }}>Lead Assistant</span>
                <button
                    onClick={toggleChat}
                    style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat-message ${msg.role}`}
                    >
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="chat-message assistant">
                        <span style={{ opacity: 0.6 }}>typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
                <input
                    type="text"
                    className="chatbot-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about leads..."
                />
                <button className="chatbot-send" onClick={handleSend}>
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default FeedbackChatbot;
