type ChatEvent = 
    | { type: 'ACTIVE_CHANNEL_CHANGED', payload: { channel: string, source: 'floating' | 'page' } }
    | { type: 'UNREAD_COUNTS_UPDATED', payload: Record<string, number> };

type Listener = (event: ChatEvent) => void;

class ChatEventEmitter {
    private listeners: Set<Listener> = new Set();

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    emit(event: ChatEvent) {
        this.listeners.forEach(listener => listener(event));
    }
}

export const chatEvents = new ChatEventEmitter();

// LocalStorage helpers for unread counts
const UNREAD_STORAGE_KEY = 'glassradar_unread_counts';

export const getStoredUnreadCounts = (): Record<string, number> => {
    try {
        if (typeof localStorage === 'undefined' || !localStorage.getItem) return {};
        const stored = localStorage.getItem(UNREAD_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Error reading unread counts from localStorage", e);
        return {};
    }
};

export const storeUnreadCounts = (counts: Record<string, number>) => {
    try {
        if (typeof localStorage === 'undefined' || !localStorage.setItem) return;
        localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(counts));
        chatEvents.emit({ type: 'UNREAD_COUNTS_UPDATED', payload: counts });
    } catch (e) {
        console.error("Error saving unread counts to localStorage", e);
    }
};
