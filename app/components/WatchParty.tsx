import React, { useState } from "react";
import { addVideo } from "../services/firebase";

const WatchParty = () => {
    const [sessionName, setSessionName] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAddUrl = async () => {
        setError(null);
        console.log("Session Name:", sessionName);
        console.log("YouTube Link:", youtubeLink);

        if (!sessionName || !youtubeLink) {
            setError('Please, fill all the fields.');
            return;
        }

        const videoId = extractVideoId(youtubeLink);
        if (videoId) {
            try {
                const docId = await addVideo(sessionName, "user_id", videoId, sessionName);
                if (docId) {
                    console.log(`Video added with ID: ${docId}`);
                }
            } catch (error) {
                console.error("Error adding video", error);
                setError('Error adding video, try again.');
            }
        } else {
            setError('Invalid YouTube Link.');
        }
    };

    const extractVideoId = (url: string): string | null => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.substring(1);
            } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                return urlObj.searchParams.get('v');
            } else {
                return null;
            }
        } catch (e) {
            console.error('Invalid URL:', e);
            setError('Invalid YouTube Link.');
            return null;
        }
    };

    return (
        <div>
            <h1>Watch Party</h1>
            <input
                placeholder="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
            />
            <input
                placeholder="YouTube Link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <button onClick={handleAddUrl}>Add Video</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WatchParty;