import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";

const CreateSession = () => {
    const [sessionName, setSessionName] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const navigate = useNavigate();

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

    const createSession = async () => {
        try {
            const videoId = extractVideoId(youtubeLink);
            if (videoId) {
                const docRef = await addDoc(collection(db, "sessions"), {
                    sessionName,
                    youtubeLink: videoId,
                    timestamp: new Date()
                });
                navigate(`/watch/${docRef.id}`);
            } else {
                console.error('Invalid YouTube link');
            }
        } catch (error) {
            console.error("Error creating session", error);
        }
    };

    return (
        <div>
            <h2>Create Session</h2>
            <input
                placeholder="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
            />
            <input
                placeholder="Youtube Link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <button onClick={createSession}>Create</button>
        </div>
    );
};

export default CreateSession;