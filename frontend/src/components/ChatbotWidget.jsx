import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef(null);

    const suggestions = useMemo(() => ([
        { label: 'How to submit a task?', value: 'How do I submit a task?' },
        { label: 'Withdraw coins', value: 'How can I withdraw my coins?' },
        { label: 'Buyer payments', value: 'How do payments work for buyers?' },
        { label: 'Account help', value: 'I need help with my account' }
    ]), []);

    const getBotReply = (text) => {
        const message = text.toLowerCase();
        if (message.includes('submit')) {
            return 'Go to a task, fill the submission details, and click “Finish & Submit”. You can track status in My Submissions.';
        }
        if (message.includes('withdraw')) {
            return 'Open the Withdrawals page, enter the amount, choose a payment system, and submit your request.';
        }
        if (message.includes('payment') || message.includes('buyer')) {
            return 'Buyers purchase coins, create tasks, and pay workers after approval. Payments are shown in Payment History.';
        }
        if (message.includes('register') || message.includes('login') || message.includes('account')) {
            return 'Use Register to create an account, then Login. You can update your profile inside the dashboard.';
        }
        if (message.includes('privacy')) {
            return 'You can read our Privacy Policy from the footer quick links.';
        }
        if (message.includes('terms')) {
            return 'You can read the Terms of Service from the footer quick links.';
        }
        if (message.includes('hello') || message.includes('hi')) {
            return 'Hi! I can help with tasks, submissions, withdrawals, and account questions.';
        }
        return 'Thanks for your question. I can help with tasks, submissions, withdrawals, and account topics. Try asking in a different way.';
    };

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const openChat = () => {
        setIsOpen(true);
        setMessages((prev) => {
            if (prev.length > 0) return prev;
            return [{
                id: crypto.randomUUID(),
                role: 'bot',
                text: 'Hi! I am your MicroTask assistant. How can I help today?'
            }];
        });
    };

    const toggleChat = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            openChat();
        }
    };

    const handleSend = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const userMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        const reply = getBotReply(trimmed);
        setTimeout(() => {
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'bot', text: reply }]);
            setIsTyping(false);
        }, 600);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend(input);
    };

    return (
        <div style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px'
        }}>
            {isOpen && (
                <div style={{
                    width: '320px',
                    maxHeight: '520px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '18px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700' }}>MicroTask AI</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Online • Fast replies</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        overflowY: 'auto',
                        background: 'var(--bg-primary)'
                    }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' : 'var(--bg-secondary)',
                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                padding: '10px 14px',
                                borderRadius: msg.role === 'user' ? '14px 14px 6px 14px' : '14px 14px 14px 6px',
                                maxWidth: '85%',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                padding: '10px 14px',
                                borderRadius: '14px 14px 14px 6px',
                                fontSize: '13px'
                            }}>
                                Typing…
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                            {suggestions.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleSend(item.value)}
                                    style={{
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-secondary)',
                                        padding: '6px 10px',
                                        borderRadius: '999px',
                                        fontSize: '11px'
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about tasks, payments, withdrawals..."
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button
                onClick={toggleChat}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                <MessageSquare size={20} />
            </button>
        </div>
    );
};

export default ChatbotWidget;
