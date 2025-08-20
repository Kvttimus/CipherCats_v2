import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "@/app/providers";
import App from "@/app/App";
import "@/app/index.css";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Providers>
            <App />
        </Providers>
    </BrowserRouter>
);