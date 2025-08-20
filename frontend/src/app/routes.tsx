// Separates composition (providers, routes) from features

import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, RedirectIfAuthed } from "@/routes/guards";
// import SignInPage from "@/pages/sign-in/Page";  // SignIn or SignInPage
// import DashboardPage from "@/pages/dashboard/Page";

import SignIn from "@/pages/sign-in/Page";
import Dashboard from "@/pages/dashboard/Page";

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />

            <Route element={<RedirectIfAuthed />}>
                <Route path="/sign-in" element={<SignIn />} />
            </Route>

            <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/labs/:labKey" element={<LabPage />} /> */}
            </Route>

            // TODO: add a proper 404 page instead of redirecting to sign-in
            // TODO: add Loading States - No global loading UI for route transitions
            // missing: SEO: No document title management
            <Route path="*" element={<Navigate to="/sign-in" replace />} />  
        </Routes>
    );
}
