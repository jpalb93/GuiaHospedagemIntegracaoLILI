import React, { useEffect, useState } from 'react';
import { subscribeToAuth } from '../../services/firebase';
import { User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuth((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    if (!user) {
        // If not authenticated, we can either redirect or show a login screen.
        // Since AdminDashboard handles login, we might just want to let it render,
        // BUT the goal here is to prevent the "Dashboard" from loading its heavy chunks if not needed.
        // However, AdminDashboard *is* the login screen too.
        // So this wrapper is mostly useful if we separate Login from Dashboard later.
        // For now, let's just pass through, but we could add a "Not Authorized" check here if we had a separate Login page.

        // Actually, to solve the "flash" issue, we just need to ensure we don't render the *Dashboard Content* until we know the user state.
        // AdminDashboard already does this check.
        // The main benefit here is centralizing the loading state.
        return <>{children}</>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
