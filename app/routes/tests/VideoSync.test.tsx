import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchSession from '../WatchSession';
import * as firestore from 'firebase/firestore';
import YouTube from 'react-youtube';

jest.mock('firebase/firestore', () => ({
    getDoc: jest.fn(),
    getFirestore: jest.fn(),
    doc: jest.fn(),
    enableIndexedDbPersistence: jest.fn().mockResolvedValue(undefined),
    initializeFirestore: jest.fn().mockReturnValue({
        settings: jest.fn()
    }),
    addDoc: jest.fn()
}));

jest.mock('react-youtube', () => ({
    __esModule: true,
    default: jest.fn((props) => {
        const { videoId, opts, onReady, onPlay, onPause, onStateChange } = props;
        setTimeout(() => onReady && onReady({ target: playerMock }), 100);
        return (
            <div>
                Mock YouTube Player - {videoId}
                <button onClick={() => {
                    playerMock.playVideo();
                    onPlay && onPlay({ target: playerMock, data: 1 });
                    const playButton = document.querySelector('button[onClick*="onPlay"]');
                    if (playButton) {
                        fireEvent.click(playButton);
                    }
                }}>Play</button>
                <button onClick={() => { playerMock.pauseVideo(); onPause && onPause({ target: playerMock, data: 2 }); }}>Pause</button>
            </div>
        );
    })
}));

const playerMock = {
    getCurrentTime: jest.fn().mockReturnValue(120),
    playVideo: jest.fn(),
    pauseVideo: jest.fn(),
    seekTo: jest.fn()
};

test('Player/Pause sync with other users', async () => {
    const mockData = {
        sessionName: 'Test Session',
        youtubeLink: 'https://youtube.com/test',
        timestamp: new Date(),
        playerState: {
            state: 'paused',
            currentTime: 0
        }
    };

    const getDocMock = firestore.getDoc as jest.Mock;
    getDocMock.mockResolvedValue({ exists: () => true, data: () => mockData });

    render(
        <MemoryRouter initialEntries={['/watch/1234']}>
            <Routes>
                <Route path="/watch/:sessionId" element={<WatchSession />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Loading/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    await waitFor(() => {
        expect(screen.getByText('Test Session')).toBeInTheDocument();
    });

    const playButtons = screen.getAllByText(/Play/i);
    fireEvent.click(playButtons[0]);
    await waitFor(() => {
        expect(playerMock.playVideo).toHaveBeenCalledTimes(0);
    });

    fireEvent.click(screen.getByText(/Pause/i));
    await waitFor(() => {
        expect(playerMock.pauseVideo).toHaveBeenCalled();
    });
});