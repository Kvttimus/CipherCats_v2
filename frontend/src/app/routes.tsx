// Separates composition (providers, routes) from features

import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, RedirectIfAuthed } from "@/routes/guards";

import AppShell from "@/components/layout/AppShell";
import AuthPage from "@/pages/sign-in/Page";
import DashboardPage from "@/pages/dashboard/Page";
import LabPage from "@/pages/lab/Page";

export function AppRoutes() {
    return (
        <Routes>
            {/* Shared layout (Header/Background/Footer) */}
            <Route element={<AppShell />}>
                {/* Public */}
                <Route element={<RedirectIfAuthed />}>
                    <Route path="/sign-in" element={<AuthPage />} />
                </Route>

                {/* Private */}
                <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/labs">
                        <Route path=":labKey" element={<LabPage />} />
                    </Route>
                </Route>

                {/* Defaults */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}
