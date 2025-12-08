import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getAppSettings,
    saveAppSettings,
    subscribeToAppSettings,
    getHeroImages,
    updateHeroImages,
    getSmartSuggestions,
    saveSmartSuggestions,
    subscribeToSmartSuggestions,
} from './appSettings';
import * as firestore from 'firebase/firestore';
import { AppConfig, SmartSuggestionsConfig } from '../../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock config
vi.mock('./config', () => ({
    db: {},
    getFromCache: vi.fn(),
    saveToCache: vi.fn(),
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        log: vi.fn(),
    },
}));

describe('Firebase AppSettings Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('App Settings', () => {
        const mockAppConfig: AppConfig = {
            whatsappNumber: '5511999999999',
            messageTemplates: {
                checkin: 'Welcome message',
                checkout: 'Goodbye message',
                invite: 'Invite message',
            },
        };

        describe('getAppSettings', () => {
            it('should return app settings when document exists', async () => {
                const mockDocSnap = {
                    exists: () => true,
                    data: () => mockAppConfig,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getAppSettings();

                expect(result).toEqual(mockAppConfig);
            });

            it('should return null when document does not exist', async () => {
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getAppSettings();

                expect(result).toBeNull();
            });

            it('should return null on error', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockRejectedValue(new Error('Error'));

                const result = await getAppSettings();

                expect(result).toBeNull();
            });
        });

        describe('saveAppSettings', () => {
            it('should save app settings to firestore', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await saveAppSettings(mockAppConfig);

                expect(firestore.setDoc).toHaveBeenCalledWith({}, mockAppConfig);
            });

            it('should sync curiosities to separate document', async () => {
                const configWithCuriosities = {
                    ...mockAppConfig,
                    cityCuriosities: ['Curiosity 1', 'Curiosity 2'],
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await saveAppSettings(configWithCuriosities);

                expect(firestore.setDoc).toHaveBeenCalledTimes(2);
                expect(firestore.setDoc).toHaveBeenCalledWith(
                    {},
                    { items: configWithCuriosities.cityCuriosities }
                );
            });
        });

        describe('subscribeToAppSettings', () => {
            it('should call callback with config when it exists', () => {
                const mockCallback = vi.fn();
                const mockDocSnap = {
                    exists: () => true,
                    data: () => mockAppConfig,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                    setTimeout(() => onNext(mockDocSnap), 0);
                    return () => { };
                });

                subscribeToAppSettings(mockCallback);

                setTimeout(() => {
                    expect(mockCallback).toHaveBeenCalledWith(mockAppConfig);
                }, 10);
            });

            it('should call callback with null when config does not exist', () => {
                const mockCallback = vi.fn();
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                    setTimeout(() => onNext(mockDocSnap), 0);
                    return () => { };
                });

                subscribeToAppSettings(mockCallback);

                setTimeout(() => {
                    expect(mockCallback).toHaveBeenCalledWith(null);
                }, 10);
            });
        });
    });

    describe('Hero Images', () => {
        describe('getHeroImages', () => {
            it('should fetch from firestore when forceRefresh is true', async () => {
                const mockImages = ['image1.jpg', 'image2.jpg'];
                const mockDocSnap = {
                    exists: () => true,
                    data: () => ({ urls: mockImages }),
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getHeroImages(true, 'lili');

                expect(result).toEqual(mockImages);
                expect(firestore.getDoc).toHaveBeenCalled();
            });

            it('should use integracao_urls field for integracao property', async () => {
                const mockImages = ['integracao1.jpg', 'integracao2.jpg'];
                const mockDocSnap = {
                    exists: () => true,
                    data: () => ({ integracao_urls: mockImages }),
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getHeroImages(true, 'integracao');

                expect(result).toEqual(mockImages);
            });

            it('should return empty array when document does not exist', async () => {
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getHeroImages(true);

                expect(result).toEqual([]);
            });

            it('should save fetched images to cache', async () => {
                const { saveToCache } = await import('./config');
                const mockImages = ['image1.jpg'];
                const mockDocSnap = {
                    exists: () => true,
                    data: () => ({ urls: mockImages }),
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                await getHeroImages(true, 'lili');

                expect(saveToCache).toHaveBeenCalledWith('cached_hero_images_lili', mockImages);
            });
        });

        describe('updateHeroImages', () => {
            it('should update lili hero images', async () => {
                const newImages = ['new1.jpg', 'new2.jpg'];

                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await updateHeroImages(newImages, 'lili');

                expect(firestore.setDoc).toHaveBeenCalledWith(
                    {},
                    { urls: newImages },
                    { merge: true }
                );
            });

            it('should update integracao hero images', async () => {
                const newImages = ['integracao1.jpg'];

                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await updateHeroImages(newImages, 'integracao');

                expect(firestore.setDoc).toHaveBeenCalledWith(
                    {},
                    { integracao_urls: newImages },
                    { merge: true }
                );
            });
        });
    });

    describe('Smart Suggestions', () => {
        const mockSuggestions: SmartSuggestionsConfig = {
            enabled: true,
            suggestions: [
                { id: '1', title: 'Beach Day', icon: 'beach' },
            ],
        };

        describe('getSmartSuggestions', () => {
            it('should return smart suggestions when document exists', async () => {
                const mockDocSnap = {
                    exists: () => true,
                    data: () => mockSuggestions,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getSmartSuggestions();

                expect(result).toEqual(mockSuggestions);
            });

            it('should return null when document does not exist', async () => {
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getSmartSuggestions();

                expect(result).toBeNull();
            });

            it('should return null on error', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockRejectedValue(new Error('Error'));

                const result = await getSmartSuggestions();

                expect(result).toBeNull();
            });
        });

        describe('saveSmartSuggestions', () => {
            it('should save smart suggestions to firestore', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await saveSmartSuggestions(mockSuggestions);

                expect(firestore.setDoc).toHaveBeenCalledWith({}, mockSuggestions);
            });
        });

        describe('subscribeToSmartSuggestions', () => {
            it('should call callback with suggestions when they exist', () => {
                const mockCallback = vi.fn();
                const mockDocSnap = {
                    exists: () => true,
                    data: () => mockSuggestions,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                    setTimeout(() => onNext(mockDocSnap), 0);
                    return () => { };
                });

                subscribeToSmartSuggestions(mockCallback);

                setTimeout(() => {
                    expect(mockCallback).toHaveBeenCalledWith(mockSuggestions);
                }, 10);
            });

            it('should call callback with null when suggestions do not exist', () => {
                const mockCallback = vi.fn();
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                    setTimeout(() => onNext(mockDocSnap), 0);
                    return () => { };
                });

                subscribeToSmartSuggestions(mockCallback);

                setTimeout(() => {
                    expect(mockCallback).toHaveBeenCalledWith(null);
                }, 10);
            });
        });
    });
});
