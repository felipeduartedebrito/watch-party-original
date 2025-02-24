import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '../app/routes/_index';
import CreateSession from '../app/routes/CreateSession';
import WatchSession from '../app/routes/WatchSession';
import WatchParty from '../app/components/WatchParty';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreateSession />} />
                <Route path="/watch/:sessionId" element={<WatchSession />} />
                <Route path="/party" element={<WatchParty />} />
            </Routes>
        </Router>
    );
};

export default App;