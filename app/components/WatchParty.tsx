import React, { useState } from "react";
import { addVideo } from "../routes/_index";
import "../styles/WatchParty.css";

const WatchParty = () => {
    const [sessionName, setSessionName] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');

    const handleAddUrl = async () => {
        const videoId = extractVideoId(youtubeLink);
        if (videoId) {
            try {
                const docId = await addVideo(sessionName, "user_id", videoId, sessionName);
                if (docId) {
                    console.log(`Video added with ID: ${docId}`);
                }
            } catch (error) {
                console.error("Error adding video", error);
            }
        } else {
            console.error('Invalid YouTube link');
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
                placeholder="YouTube URL"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <button onClick={handleAddUrl}>Add Video</button>
        </div>
    );
};

export default WatchParty;
