// src/app/App.tsx
import { AppRoutes } from "./routes";
export default function App() { return <AppRoutes />; }

// src/app/providers.tsx
import { AuthProvider } from "@/context/AuthContext";
export function Providers({ children }: {children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}