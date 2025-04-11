import React from 'react';

const SuccessPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1>Success!</h1>
            <p>Your operation was completed successfully.</p>
            <a href="/" style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}>Go back to Home</a>
        </div>
    );
};

export default SuccessPage;