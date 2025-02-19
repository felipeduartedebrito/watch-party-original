import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchSession from '../WatchSession';
import { doc, getDoc } from "firebase/firestore";
import * as firestore from "firebase/firestore";
import YouTube from 'react-youtube';

jest.mock("firebase/firestore", () => ({
    getDoc: jest.fn(),
    getFirestore: jest.fn(),
    doc: jest.fn()
}));

jest.mock('react-youtube', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    const { videoId, opts, onReady, onPlay, onPause, onStateChange } = props;
    // Mock the `onReady` event
    setTimeout(() => onReady && onReady({ target: playerMock }), 100);
    return <div>Mock YouTube Player - {videoId}</div>;
  }),
}));

const playerMock = {
  getCurrentTime: jest.fn().mockReturnValue(120),
  playVideo: jest.fn(),
  pauseVideo: jest.fn(),
  seekTo: jest.fn(),
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ sessionId: '1234' }) // Mock useParams
}));

test('Watch Session', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
    timestamp: new Date(),
    playerState: {
      state: 'playing',
      currentTime: 120
    }
  };

    const mockGetDoc = jest.fn().mockResolvedValue({ exists: () => true, data: () => mockData });
    const getDocMock = firestore.getDoc as jest.Mock;
    getDocMock.mockImplementation(mockGetDoc);

    // Mock the doc function to return a DocumentReference
  const mockDocRef = {}; // Mock DocumentReference
  (doc as jest.Mock).mockReturnValue(mockDocRef);

  render(
    <MemoryRouter initialEntries={['/watch/1234']}>
      <Routes>
        <Route path="/watch/:sessionId" element={<WatchSession />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Session')).toBeInTheDocument();
    expect(screen.getByText('Mock YouTube Player - https://youtube.com/...')).toBeInTheDocument();
  });

  // Simular estado do player
  await waitFor(() => {
    expect(playerMock.playVideo).toHaveBeenCalled();
    expect(playerMock.seekTo).toHaveBeenCalledWith(120, true);
  });
});