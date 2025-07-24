/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { usePaginatedUrls } from './use-paginated-urls';
import { getShortUrls } from "@/app/api/urls/urls";
import { useAuth } from "@/context/Auth";


// Mock dependencies
jest.mock('@/app/api/urls/urls', () => ({
    getShortUrls: jest.fn(),
}));

jest.mock('@/context/Auth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
    safeFetch: jest.fn((callback, ) => callback()),
}));

describe('usePaginatedUrls', () => {
    const mockUser = { uid: 'test-user-id' };
    const mockUrls = [
        { id: '1', originalUrl: 'http://example.com/1', shortUrl: 'abc1' },
        { id: '2', originalUrl: 'http://example.com/2', shortUrl: 'abc2' },
        { id: '3', originalUrl: 'http://example.com/3', shortUrl: 'abc3' },
        { id: '4', originalUrl: 'http://example.com/4', shortUrl: 'abc4' },
        { id: '5', originalUrl: 'http://example.com/5', shortUrl: 'abc5' },
        { id: '6', originalUrl: 'http://example.com/6', shortUrl: 'abc6' },
        { id: '7', originalUrl: 'http://example.com/7', shortUrl: 'abc7' },
        { id: '8', originalUrl: 'http://example.com/8', shortUrl: 'abc8' },
        { id: '9', originalUrl: 'http://example.com/9', shortUrl: 'abc9' },
        { id: '10', originalUrl: 'http://example.com/10', shortUrl: 'abc10' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
        // (getShortUrls as jest.Mock).mockResolvedValue({
        //     urls: mockUrls,
        //     recordCount: mockUrls.length,
        // });
        (getShortUrls as jest.Mock).mockImplementation(
            async (uid: string, limit: number, offset: number) => {
                const paginatedUrls = mockUrls.slice(offset, offset + limit);
                return Promise.resolve({
                    urls: paginatedUrls,
                    recordCount: mockUrls.length, // Total count of all available URLs
                });
            
            // return ({
            //     urls: paginatedUrls,
            //     recordCount: mockUrls.length, // Total count of all available URLs
            // });
        }
        );
    });

    it('should initialize with empty urls and not loading', () => {
        const { result } = renderHook(() => usePaginatedUrls(mockUrls.length));
        
        expect(result.current.pageUrls.size).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.paginatedTotalCount).toBe(10);
    });

    it('should load page of urls correctly', async () => {
        const { result } = renderHook(() => usePaginatedUrls(mockUrls.length));
        
        await act(async () => {
            await result.current.loadPage(5, 0);
        });        
        
        expect(getShortUrls).toHaveBeenCalledWith(mockUser.uid, 5, 0);
        expect(result.current.pageUrls.size).toBe(5);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.paginatedTotalCount).toBe(10);
    });

    it('should not reload already loaded urls', async () => {
        (getShortUrls as jest.Mock).mockClear()
        const { result } = renderHook(() => usePaginatedUrls(mockUrls.length));
        
        await act(async () => {
            await result.current.loadPage(5, 0);
        });
        
        
        // getShortUrls should only be called once
        // expect(getShortUrls).toHaveBeenCalledTimes(1);

        // (getShortUrls as jest.Mock).mockClear();


        await act(async () => {
            await result.current.loadPage(5, 0);
        });

        // expect(getShortUrls).not.toHaveBeenCalled();
        expect(getShortUrls).toHaveBeenCalledTimes(1);


    });

    it('should refresh urls correctly', async () => {
        const { result } = renderHook(() => usePaginatedUrls(10));
        
        // First load the page
        await act(async () => {
            await result.current.loadPage(5, 0);
        });
        
        (getShortUrls as jest.Mock).mockResolvedValueOnce({
          urls: [
            ...mockUrls.slice(0, 1)
            // ...mockUrls,
            // { id: "3", originalUrl: "http://example.com/3", shortUrl: "abc3" },
            // { id: "4", originalUrl: "http://example.com/4", shortUrl: "abc4" },
          ],
          recordCount: mockUrls.slice(0, 1).length,
        });
        
        // Then refresh the urls
        await act(async () => {
            await result.current.refreshUrls();
        });
        
        
        // getShortUrls should be called twice
        expect(getShortUrls).toHaveBeenCalledTimes(2);
        expect(result.current.pageUrls.size).toBe(mockUrls.slice(0, 1).length)
        expect(result.current.pageUrls).toStrictEqual(
          new Map([[0, mockUrls[0]]])
        );

    });

    it('should not fetch data when user is not authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: null });
        
        const { result } = renderHook(() => usePaginatedUrls(10));
        
        act(() => {
            result.current.loadPage(5, 0);
        });
        
        expect(getShortUrls).not.toHaveBeenCalled();
    });

    it('should update total count when it changes', async () => {
        jest.mocked(getShortUrls).mockClear()
        console.debug({"in jest ":mockUrls.length})
        const { result } = renderHook(() => usePaginatedUrls(mockUrls.length));
        
        // First load returns 2 items
        await act(async () => {
            await result.current.loadPage(5, 0);
        });

        console.debug(result.current.pageUrls, result.current.paginatedTotalCount)
        expect(result.current.paginatedTotalCount).toBe(10);
        
        // Second load returns 3 items
        (getShortUrls as jest.Mock).mockResolvedValueOnce({
            urls: [...mockUrls.slice(0, 3)],
            recordCount: mockUrls.slice(0, 3).length,
        });
        
        console.log("mock get", jest.mocked(getShortUrls))
        await act(async () => {
            await result.current.refreshUrls();
        });
        
        
        expect(result.current.paginatedTotalCount).toBe(3);
    });
});