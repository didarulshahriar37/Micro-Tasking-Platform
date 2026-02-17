import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotWidget from './ChatbotWidget';

const MainLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
                {children}
            </main>
            <ChatbotWidget />
            <Footer />
        </div>
    );
};

export default MainLayout;
