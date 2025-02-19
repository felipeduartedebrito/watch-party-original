import * as React from 'react'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface SessionData {
    sessionName: string;
    youtubeLink: string;
    timestamp: Date;
}

function WatchSession() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            if (sessionId) {
                const docRef = doc(db, "sessions", sessionId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSessionData(docSnap.data() as SessionData);
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No sessionId provided");
            }
        };

        fetchSessionData();
    }, [sessionId]);

    return (
        <div>
            {/* Render session data here */}
            {sessionData ? (
                <div>
                    <h1>{sessionData.sessionName}</h1>
                    <p>{sessionData.youtubeLink}</p>
                    <p>{sessionData.timestamp.toString()}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default WatchSession;