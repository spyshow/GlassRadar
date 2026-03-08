import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authProvider } from './authProvider';
import { account, databases } from './utility';

// Mock Appwrite utilities
vi.mock('./utility', () => ({
    account: {
        createEmailPasswordSession: vi.fn(),
        deleteSession: vi.fn(),
        get: vi.fn(),
    },
    databases: {
        listDocuments: vi.fn(),
    },
    appwriteClient: {},
}));

describe('authProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const mockSession = { $id: 'session-id' };
            vi.mocked(account.createEmailPasswordSession).mockResolvedValue(mockSession as any);

            const result = await authProvider.login({ email: 'test@example.com', password: 'password' });

            expect(result.success).toBe(true);
            expect(result.redirectTo).toBe('/');
            expect(account.createEmailPasswordSession).toHaveBeenCalledWith('test@example.com', 'password');
        });

        it('should return failure on invalid credentials', async () => {
            vi.mocked(account.createEmailPasswordSession).mockRejectedValue(new Error('Invalid credentials'));

            const result = await authProvider.login({ email: 'test@example.com', password: 'wrong' });

            expect(result.success).toBe(false);
            expect(result.error?.message).toBe('Invalid credentials');
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            vi.mocked(account.deleteSession).mockResolvedValue({} as any);

            const result = await authProvider.logout({});

            expect(result.success).toBe(true);
            expect(result.redirectTo).toBe('/login');
            expect(account.deleteSession).toHaveBeenCalledWith('current');
        });
    });

    describe('checkAuth', () => {
        it('should return authenticated if session exists', async () => {
            vi.mocked(account.get).mockResolvedValue({ $id: 'user-id' } as any);

            const result = await authProvider.check({});

            expect(result.authenticated).toBe(true);
        });

        it('should return unauthenticated if no session', async () => {
            vi.mocked(account.get).mockRejectedValue(new Error('No session'));

            const result = await authProvider.check({});

            expect(result.authenticated).toBe(false);
            expect(result.redirectTo).toBe('/login');
        });
    });

    describe('getPermissions', () => {
        it('should return user role from users collection', async () => {
            vi.mocked(account.get).mockResolvedValue({ $id: 'user-id' } as any);
            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: [{ role: 'admin' }],
                total: 1
            } as any);

            const permissions = await authProvider.getPermissions();

            expect(permissions).toEqual(['admin']);
            expect(databases.listDocuments).toHaveBeenCalled();
        });
    });

    describe('getIdentity', () => {
        it('should return user identity details', async () => {
            const mockUser = { $id: 'user-id', name: 'Test User' };
            vi.mocked(account.get).mockResolvedValue(mockUser as any);
            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: [{ name: 'Test User', avatar: 'avatar-url', position: 'Developer' }],
                total: 1
            } as any);

            const identity = await authProvider.getIdentity?.();

            expect(identity).toEqual({
                id: 'user-id',
                name: 'Test User',
                avatar: 'avatar-url',
                position: 'Developer'
            });
        });
    });
});
