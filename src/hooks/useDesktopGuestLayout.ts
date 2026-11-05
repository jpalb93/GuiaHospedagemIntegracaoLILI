import { useSyncExternalStore } from 'react';

const DESKTOP_QUERY = '(min-width: 1280px)';

const subscribe = (onChange: () => void) => {
    const query = window.matchMedia(DESKTOP_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getServerSnapshot = () => false;

/** Mount only the layout in use; hidden mobile dialogs must not compete with desktop. */
export const useDesktopGuestLayout = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
