import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchSession from '../WatchSession';
import * as firestore from "firebase/firestore";
import YouTube from 'react-youtube';

jest.mock("firebase/firestore", () => ({
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
                YouTube Player Mock - {videoId}
                <button onClick={() => { playerMock.playVideo(); onPlay && onPlay({ target: playerMock }); }}>Play</button>
                <button onClick={() => { playerMock.pauseVideo(); onPause && onPause({ target: playerMock }); }}>Pause</button>
                <label htmlFor="seek">Seek</label>
                <input id="seek" type="range" min="0" max="600" onChange={(e) => { playerMock.seekTo(parseInt(e.target.value, 10), true); }} />
            </div>
        );
    })
}));

const playerMock = {
    getCurrentTime: jest.fn().mockReturnValue(120),
    playVideo: jest.fn(),
    pauseVideo: jest.fn(),
    seekTo: jest.fn(),
};

test('Users seek sync', async () => {
    const mockData = {
        sessionName: 'Test Session',
        youtubeLink: 'https://youtube.com/test',
        timestamp: new Date(),
        playerState: {
            state: 'playing',
            currentTime: 120
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

    await waitFor(() => {
        expect(screen.getByText('Test Session')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Seek/i), { target: { value: 300 } });
    await waitFor(() => {
        expect(playerMock.seekTo).toHaveBeenCalledWith(300, true);
    });
});