import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchSession from '../WatchSession';
import { doc, getDoc } from "firebase/firestore";
import * as firestore from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
    getDoc: jest.fn(),
    getFirestore: jest.fn(),
    doc: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ sessionId: '1234' }) // Mock useParams
}));

test('Watch Session', async () => {
    const mockData = {
        sessionName: 'Test Session',
        youtubeLink: 'https://youtube.com/...',
        timestamp: new Date()
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
    });
});