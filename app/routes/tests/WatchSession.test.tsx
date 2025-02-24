import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchSession from '../WatchSession';
import * as firestore from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  enableIndexedDbPersistence: jest.fn().mockResolvedValue(undefined),
  initializeFirestore: jest.fn().mockReturnValue({
    settings: jest.fn()
  }),
  addDoc: jest.fn(),
  updateDoc: jest.fn()
}));

jest.mock('react-youtube', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    const { videoId, opts, onReady, onPlay, onPause, onStateChange } = props;
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
  useParams: jest.fn().mockReturnValue({ sessionId: '1234' })
}));

test('Watch Session displays session name and video', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
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
    expect(screen.getByText('Mock YouTube Player - https://youtube.com/...')).toBeInTheDocument();
  });
});

test('Watch Session controls work as expected', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
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
    expect(playerMock.playVideo).toHaveBeenCalled();
    expect(playerMock.seekTo).toHaveBeenCalledWith(120, true);
  });
});

test('Player pause', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
    timestamp: new Date(),
    playerState: {
      state: 'paused',
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
    expect(playerMock.pauseVideo).toHaveBeenCalled();
    expect(playerMock.seekTo).toHaveBeenCalledWith(120, true);
  });
});

test('Watch Session - while paused', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
    timestamp: new Date(),
    playerState: {
      state: 'paused',
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
    expect(playerMock.pauseVideo).toHaveBeenCalled();
    expect(playerMock.seekTo).toHaveBeenCalledWith(120, true);
  });
});

test('User joining after session', async () => {
  const mockData = {
    sessionName: 'Test Session',
    youtubeLink: 'https://youtube.com/...',
    timestamp: new Date(),
    playerState: {
      state: 'playing',
      currentTime: 300
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
    expect(playerMock.playVideo).toHaveBeenCalled();
    expect(playerMock.seekTo).toHaveBeenCalledWith(300, true);
  });
});