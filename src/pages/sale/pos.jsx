import React, { useEffect } from 'react';

const PosPage = () => {
    useEffect(() => {
        console.log('POS page is loaded');
    }, []);

    return (
        <div>
            <h1>POS Page</h1>
        </div>
    );
};

export default PosPage;