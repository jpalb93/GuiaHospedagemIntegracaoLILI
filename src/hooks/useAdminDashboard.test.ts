import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// CRITICAL: Mocks MUST be before imports
vi.mock('../services/firebase');
vi.mock('../services/geminiService');
vi.mock('./useAdminAuth');
vi.mock('./useToast');
vi.mock('./useReservations');
vi.mock('./useReservationForm');
vi.mock('./useBlockedDates');
vi.mock('../utils/helpers');

import { useAdminDashboard } from './useAdminDashboard';
import * as firebaseService from '../services/firebase';
import * as useAdminAuthModule from './useAdminAuth';
import * as useToastModule from './useToast';
import { Reservation } from '../types';

describe('useAdminDashboard Hook', () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();
    const mockShowToast = vi.fn();
    const mockRemoveToast = vi.fn();
    const mockLoadMoreHistory = vi.fn();
    const mockRemoveReservation = vi.fn();
    const mockSetGeneratedLink = vi.fn();
    const mockSetIsSaving = vi.fn();
    const mockResetForm = vi.fn();
    const mockLoadReservation = vi.fn();
    const mockGetFormValues = vi.fn();
    const mockSubscribeToBlockedDates = vi.fn(() => () => { });
    const mockResetBlockedForm = vi.fn();
    const mockSaveReservation = vi.fn();
    const mockUpdateReservation = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock useAdminAuth
        vi.mocked(useAdminAuthModule.useAdminAuth).mockReturnValue({
            user: { uid: 'test-user', email: 'test@example.com' } as any,
            userPermission: {
                email: 'test@example.com',
                role: 'super_admin',
                allowedProperties: ['lili', 'integracao'],
            },
            authLoading: false,
            login: mockLogin,
            logout: mockLogout,
        });

        // Mock useToast
        vi.mocked(useToastModule.useToast).mockReturnValue({
            toasts: [],
            showToast: mockShowToast,
            removeToast: mockRemoveToast,
        });

        // Mock useReservations
        const useReservationsMock = vi.fn().mockReturnValue({
            activeReservations: [],
            historyReservations: [],
            loadingHistory: false,
            hasMoreHistory: false,
            loadMoreHistory: mockLoadMoreHistory,
            removeReservation: mockRemoveReservation,
        });
        vi.doMock('./useReservations', () => ({
            useReservations: useReservationsMock,
        }));

        // Mock useReservationForm - return full state
        const useReservationFormMock = vi.fn().mockReturnValue({
            editingId: null,
            guestName: '',
            setGuestName: vi.fn(),
            guestPhone: '',
            setGuestPhone: vi.fn(),
            propertyId: 'lili',
            setPropertyId: vi.fn(),
            flatNumber: '',
            setFlatNumber: vi.fn(),
            lockCode: '1234',
            setLockCode: vi.fn(),
            welcomeMessage: '',
            setWelcomeMessage: vi.fn(),
            adminNotes: '',
            setAdminNotes: vi.fn(),
            guestAlertActive: false,
            setGuestAlertActive: vi.fn(),
            guestAlertText: '',
            setGuestAlertText: vi.fn(),
            checkInDate: '2024-01-01',
            setCheckInDate: vi.fn(),
            checkoutDate: '2024-01-05',
            setCheckoutDate: vi.fn(),
            checkInTime: '14:00',
            setCheckInTime: vi.fn(),
            checkOutTime: '11:00',
            setCheckOutTime: vi.fn(),
            guestCount: 2,
            setGuestCount: vi.fn(),
            paymentMethod: 'pix',
            setPaymentMethod: vi.fn(),
            shortId: 'ABC123',
            generatedLink: '',
            setGeneratedLink: mockSetGeneratedLink,
            isSaving: false,
            setIsSaving: mockSetIsSaving,
            resetForm: mockResetForm,
            loadReservation: mockLoadReservation,
            getFormValues: mockGetFormValues,
        });
        vi.doMock('./useReservationForm', () => ({
            useReservationForm: useReservationFormMock,
        }));

        // Mock useBlockedDates
        const useBlockedDatesMock = vi.fn().mockReturnValue({
            blockedDates: [],
            blockedStartDate: '2024-01-01',
            setBlockedStartDate: vi.fn(),
            blockedEndDate: '2024-01-05',
            setBlockedEndDate: vi.fn(),
            blockedReason: '',
            setBlockedReason: vi.fn(),
            isBlocking: false,
            subscribe: mockSubscribeToBlockedDates,
            resetBlockedForm: mockResetBlockedForm,
            handleAddBlock: vi.fn(),
            handleDeleteBlock: vi.fn(),
        });
        vi.doMock('./useBlockedDates', () => ({
            useBlockedDates: useBlockedDatesMock,
        }));

        // Mock Firebase
        vi.mocked(firebaseService.saveReservation).mockImplementation(mockSaveReservation);
        vi.mocked(firebaseService.updateReservation).mockImplementation(mockUpdateReservation);

        // Mock helpers
        vi.doMock('../utils/helpers', () => ({
            generateShortId: vi.fn(() => 'TEST123'),
        }));

        // Mock geminiService
        vi.doMock('../services/geminiService', () => ({
            isApiConfigured: true,
        }));

        // Set default getFormValues return
        mockGetFormValues.mockReturnValue({
            guestName: 'Test Guest',
            guestPhone: '123',
            propertyId: 'lili',
            flatNumber: '',
            lockCode: '1234',
            welcomeMessage: '',
            adminNotes: '',
            guestAlertActive: false,
            guestAlertText: '',
            checkInDate: '2024-01-01',
            checkoutDate: '2024-01-05',
            checkInTime: '14:00',
            checkOutTime: '11:00',
            guestCount: 2,
            paymentMethod: 'pix',
        });
    });

    describe('Initialization', () => {
        it('should expose auth properties from useAdminAuth', () => {
            const { result } = renderHook(() => useAdminDashboard());

            expect(result.current.user).toBeDefined();
            expect(result.current.userPermission).toBeDefined();
            expect(result.current.authLoading).toBe(false);
        });

        it('should default to "home" tab', () => {
            const { result } = renderHook(() => useAdminDashboard());
            expect(result.current.activeTab).toBe('home');
        });

        it('should load saved active tab from localStorage', () => {
            localStorage.setItem('admin_active_tab', 'settings');
            const { result } = renderHook(() => useAdminDashboard());
            expect(result.current.activeTab).toBe('settings');
        });
    });

    describe('handleLogin', () => {
        it('should call login and show success toast', async () => {
            mockLogin.mockResolvedValue({ success: true });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.handleLogin(
                    { preventDefault: vi.fn() } as any,
                    'test@example.com',
                    'password123'
                );
            });

            expect(mockLogin).toHaveBeenCalledWith(
                expect.anything(),
                'test@example.com',
                'password123'
            );
            expect(mockShowToast).toHaveBeenCalledWith('Bem-vindo de volta!', 'success');
        });

        it('should show error toast on login failure', async () => {
            mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.handleLogin({ preventDefault: vi.fn() } as any, 'bad@email.com', 'bad');
            });

            expect(mockShowToast).toHaveBeenCalledWith('Invalid credentials', 'error');
        });
    });

    describe('handleSaveReservation - Validations', () => {
        it('should validate guest name is required', async () => {
            mockGetFormValues.mockReturnValue({
                ...mockGetFormValues(),
                guestName: '',
            });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.handleSaveReservation();
            });

            expect(mockShowToast).toHaveBeenCalledWith('Preencha o nome do hóspede.', 'warning');
            expect(mockSaveReservation).not.toHaveBeenCalled();
        });

        it('should validate checkout date must be after checkin', async () => {
            mockGetFormValues.mockReturnValue({
                ...mockGetFormValues(),
                guestName: 'Test Guest',
                checkInDate: '2024-01-05',
                checkoutDate: '2024-01-01', // Earlier than checkin!
            });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.handleSaveReservation();
            });

            expect(mockShowToast).toHaveBeenCalledWith('O Check-out deve ser DEPOIS do Check-in.', 'error');
        });
    });

    describe('handleStartEdit', () => {
        it('should load reservation and switch to create tab', () => {
            const mockScrollTo = vi.fn();
            window.scrollTo = mockScrollTo;

            const { result } = renderHook(() => useAdminDashboard());

            const mockReservation: Reservation = {
                id: 'res-123',
                guestName: 'John Doe',
                status: 'active',
                propertyId: 'lili',
                checkInDate: '2024-01-01',
                checkoutDate: '2024-01-05',
                checkInTime: '14:00',
                checkOutTime: '11:00',
                lockCode: '1234',
                createdAt: '2024-01-01',
            };

            act(() => {
                result.current.handleStartEdit(mockReservation);
            });

            expect(mockLoadReservation).toHaveBeenCalledWith(mockReservation);
            expect(result.current.activeTab).toBe('create');
            expect(mockShowToast).toHaveBeenCalledWith('Editando reserva de John Doe', 'info');
            expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });
    });

    describe('UI State', () => {
        it('should persist active tab to localStorage', () => {
            const { result } = renderHook(() => useAdminDashboard());

            act(() => {
                result.current.setActiveTab('calendar');
            });

            expect(localStorage.getItem('admin_active_tab')).toBe('calendar');
        });

        it('should update search term', () => {
            const { result } = renderHook(() => useAdminDashboard());

            act(() => {
                result.current.setSearchTerm('test search');
            });

            expect(result.current.searchTerm).toBe('test search');
        });
    });
});
