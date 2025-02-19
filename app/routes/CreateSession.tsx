import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";

const CreateSession = () => {
    const [sessionName, setSessionName] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const navigate = useNavigate();

    const createSession = async () => {
        try {
            const docRef = await addDoc(collection(db, "sessions"), {
                sessionName,
                youtubeLink,
                timestamp: new Date()
            });
            navigate(`/watch/${docRef.id}`);
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