// Encapsulates auth logic, pages stay declarative

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth() {
    const { session, loading } = useAuth();

    if (loading) return null;  // hold until session restored
    return session ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export function RedirectIfAuthed() {
    const { session, loading } = useAuth();
    if (loading) return null;
    return session ? <Navigate to="/dashboard" replace /> : <Outlet />;
}