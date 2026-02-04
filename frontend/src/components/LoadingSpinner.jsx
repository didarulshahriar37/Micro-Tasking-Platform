import React from 'react';

const LoadingSpinner = ({ fullPage = false, text = 'Loading...' }) => {
    return (
        <div className={`loading-container ${fullPage ? 'loading-full-page' : ''}`}>
            <div className="spinner"></div>
            {text && <div className="loading-text">{text}</div>}
        </div>
    );
};

export default LoadingSpinner;
