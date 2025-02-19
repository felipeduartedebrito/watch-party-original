import * as React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import CreateSession from '../CreateSession';
import { addDoc, collection } from 'firebase/firestore';

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    getFirestore: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

test('Session creation', async () => {
    const mockAddDoc = addDoc as jest.Mock;
    mockAddDoc.mockResolvedValue({ id: 1234 });

    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
            <CreateSession />
        </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Session Name'), { target: { value: 'Test Session' } });
    fireEvent.change(getByPlaceholderText('Youtube Link'), { target: { value: 'https://youtube.com/...' } });
    fireEvent.click(getByText('Create'));

    expect(addDoc).toHaveBeenCalledWith(
        collection(expect.anything(), 'sessions'),
        {
            sessionName: 'Test Session',
            youtubeLink: 'https://youtube.com/...',
            timestamp: expect.any(Date)
        }
    );

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/watch/1234')
    });
});