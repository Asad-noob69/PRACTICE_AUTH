"use client"
import React from 'react';

const FailurePage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8d7da', color: '#721c24' }}>
            <h1>Authentication Failed</h1>
            <p>We were unable to authenticate your request. Please try again.</p>
            <button
                onClick={() => window.location.href = '/'}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5c6cb',
                    border: 'none',
                    borderRadius: '5px',
                    color: '#721c24',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Go Back to Home
            </button>
        </div>
    );
};

export default FailurePage;