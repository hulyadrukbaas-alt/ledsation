import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import ComingSoon from "./pages/ComingSoon";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assortiment" element={<ComingSoon title="Assortiment" />} />
        <Route path="/offerte" element={<ComingSoon title="Offerte aanvragen" />} />
        <Route path="/brandkit" element={<ComingSoon title="Brand kit" />} />
        <Route path="*" element={<ComingSoon title="Pagina niet gevonden" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
