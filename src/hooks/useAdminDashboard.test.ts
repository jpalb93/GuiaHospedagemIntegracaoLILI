// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// CRITICAL: Mocks MUST be before imports
vi.mock('../services/firebase');
vi.mock('../services/geminiService');
vi.mock('./useAdminAuth');
vi.mock('../contexts/ToastContext');
vi.mock('./useReservations');
vi.mock('./useReservationForm');
vi.mock('./useBlockedDates');
vi.mock('../utils/helpers');

import { useAdminDashboard } from './useAdminDashboard';
import * as firebaseService from '../services/firebase';
import * as useAdminAuthModule from './useAdminAuth';
import * as useToastModule from '../contexts/ToastContext';
import * as useReservationsModule from './useReservations';
import * as useReservationFormModule from './useReservationForm';
import * as useBlockedDatesModule from './useBlockedDates';
import * as helpersModule from '../utils/helpers';
import { Reservation } from '../types';

describe('useAdminDashboard Hook', () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();
    const mockShowToast = vi.fn();
    const mockLoadMoreHistory = vi.fn();
    const mockRemoveReservation = vi.fn();
    const mockSetGeneratedLink = vi.fn();
    const mockSetIsSaving = vi.fn();
    const mockResetForm = vi.fn();
    const mockLoadReservation = vi.fn();
    const mockGetFormValues = vi.fn();
    const mockSubscribeToBlockedDates = vi.fn(async () => () => {});
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
            showToast: mockShowToast,
            showSuccess: (message: string) => mockShowToast(message, 'success'),
            showError: (message: string) => mockShowToast(message, 'error'),
            showInfo: (message: string) => mockShowToast(message, 'info'),
            showWarning: (message: string) => mockShowToast(message, 'warning'),
        });

        // Mock useReservations
        vi.mocked(useReservationsModule.useReservations).mockReturnValue({
            activeReservations: [],
            historyReservations: [],
            loadingHistory: false,
            hasMoreHistory: false,
            loadMoreHistory: mockLoadMoreHistory,
            removeReservation: mockRemoveReservation,
        } as any);

        // Mock useReservationForm - return full state
        vi.mocked(useReservationFormModule.useReservationForm).mockReturnValue({
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
            paymentStatus: 'pending',
            setPaymentStatus: vi.fn(),
            totalAmount: '',
            setTotalAmount: vi.fn(),
            depositAmount: '',
            setDepositAmount: vi.fn(),
            guestRating: 5,
            setGuestRating: vi.fn(),
            guestFeedback: '',
            setGuestFeedback: vi.fn(),
            billingMode: 'reservation',
            setBillingMode: vi.fn(),
            companyId: '',
            setCompanyId: vi.fn(),
            contractId: '',
            setContractId: vi.fn(),
            allocationId: '',
            setAllocationId: vi.fn(),
            shortId: 'ABC123',
            manualDeactivation: false,
            setManualDeactivation: vi.fn(),
            generatedLink: '',
            setGeneratedLink: mockSetGeneratedLink,
            isSaving: false,
            setIsSaving: mockSetIsSaving,
            resetForm: mockResetForm,
            loadReservation: mockLoadReservation,
            getFormValues: mockGetFormValues,
        } as any);

        // Mock useBlockedDates
        vi.mocked(useBlockedDatesModule.useBlockedDates).mockReturnValue({
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
        } as any);

        // Mock Firebase
        vi.mocked(firebaseService.saveReservation).mockImplementation(mockSaveReservation);
        vi.mocked(firebaseService.updateReservation).mockImplementation(mockUpdateReservation);

        // Mock helpers
        vi.mocked(helpersModule.generateShortId).mockReturnValue('TEST123');

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

            expect(result.current.auth.user).toBeDefined();
            expect(result.current.auth.userPermission).toBeDefined();
            expect(result.current.auth.authLoading).toBe(false);
        });

        it('should default to "home" tab', () => {
            const { result } = renderHook(() => useAdminDashboard());
            expect(result.current.ui.activeTab).toBe('home');
        });

        it('should load saved active tab from localStorage', () => {
            localStorage.setItem('admin_active_tab', 'settings');
            const { result } = renderHook(() => useAdminDashboard());
            expect(result.current.ui.activeTab).toBe('settings');
        });
    });

    describe('handleLogin', () => {
        it('should call login and show success toast', async () => {
            mockLogin.mockResolvedValue({ success: true });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.auth.handleLogin(
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
                await result.current.auth.handleLogin(
                    { preventDefault: vi.fn() } as any,
                    'bad@email.com',
                    'bad'
                );
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
                await result.current.form.handleSaveReservation();
            });

            expect(mockShowToast).toHaveBeenCalledWith('Preencha o nome do hóspede.', 'warning');
            expect(mockSaveReservation).not.toHaveBeenCalled();
        });

        it('should validate checkout date must be after checkin', async () => {
            const currentForm = useReservationFormModule.useReservationForm();
            vi.mocked(useReservationFormModule.useReservationForm).mockReturnValue({
                ...currentForm,
                guestName: 'Test Guest',
                checkInDate: '2024-01-05',
                checkoutDate: '2024-01-01',
            } as any);
            mockGetFormValues.mockReturnValue({
                ...mockGetFormValues(),
                guestName: 'Test Guest',
                checkInDate: '2024-01-05',
                checkoutDate: '2024-01-01', // Earlier than checkin!
            });

            const { result } = renderHook(() => useAdminDashboard());

            await act(async () => {
                await result.current.form.handleSaveReservation();
            });

            expect(mockShowToast).toHaveBeenCalledWith(
                'O Check-out deve ser DEPOIS do Check-in.',
                'error'
            );
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
                result.current.form.handleStartEdit(mockReservation);
            });

            expect(mockLoadReservation).toHaveBeenCalledWith(mockReservation);
            expect(result.current.ui.activeTab).toBe('create');
            expect(mockShowToast).toHaveBeenCalledWith('Editando reserva de John Doe', 'info');
            expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });
    });

    describe('UI State', () => {
        it('should persist active tab to localStorage', () => {
            const { result } = renderHook(() => useAdminDashboard());

            act(() => {
                result.current.ui.setActiveTab('calendar');
            });

            expect(localStorage.getItem('admin_active_tab')).toBe('calendar');
        });

        it('should update search term', () => {
            const { result } = renderHook(() => useAdminDashboard());

            act(() => {
                result.current.ui.setSearchTerm('test search');
            });

            expect(result.current.ui.searchTerm).toBe('test search');
        });
    });
});
