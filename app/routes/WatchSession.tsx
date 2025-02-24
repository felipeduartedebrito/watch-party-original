import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface SessionData {
  sessionName: string;
  youtubeLink: string;
  timestamp: Date;
  playerState?: {
    state: string;
    currentTime: number;
  };
}

function WatchSession() {
  console.log('WatchSession component rendered');

  const { sessionId } = useParams<{ sessionId: string }>();
  console.log('sessionId:', sessionId);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (sessionId) {
        console.log('Fetching session data for sessionId:', sessionId);
        const docRef = doc(db, 'sessions', sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SessionData;
          console.log('Session data:', data);
          setSessionData(data);
          if (player && data.playerState) {
            const { state, currentTime } = data.playerState;
            player.seekTo(currentTime, true);
            if (state === 'playing') {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          }
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No sessionId provided');
      }
    };

    fetchSessionData();
  }, [sessionId, player]);

  const onPlayerReady = (event: YouTubeEvent) => {
    console.log('Player ready');
    setPlayer(event.target);
  };

  const onPlay = async () => {
    console.log('Video playing');
    if (player && sessionId) {
      await updateDoc(doc(db, 'sessions', sessionId), {
        playerState: {
          state: 'playing',
          currentTime: player.getCurrentTime(),
        },
      });
    }
  };

  const onPause = async () => {
    console.log('Video paused');
    if (player && sessionId) {
      await updateDoc(doc(db, 'sessions', sessionId), {
        playerState: {
          state: 'paused',
          currentTime: player.getCurrentTime(),
        },
      });
    }
  };

  const onSeek = async () => {
    console.log('Video seeking');
    if (player && sessionId) {
      await updateDoc(doc(db, 'sessions', sessionId), {
        playerState: {
          state: 'buffering',
          currentTime: player.getCurrentTime(),
        },
      });
    }
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div>
      {sessionData ? (
        <div>
          <h1>{sessionData.sessionName}</h1>
          <YouTube
            videoId={sessionData.youtubeLink}
            opts={opts}
            onReady={onPlayerReady}
            onPlay={onPlay}
            onPause={onPause}
            onStateChange={(event: YouTubeEvent) => {
              if (event.data === YouTube.PlayerState.PLAYING) {
                onPlay();
              } else if (event.data === YouTube.PlayerState.PAUSED) {
                onPause();
              } else if (event.data === YouTube.PlayerState.BUFFERING) {
                onSeek();
              }
            }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WatchSession;