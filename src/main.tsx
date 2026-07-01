import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import Assortiment from "./pages/Assortiment";
import Product from "./pages/Product";
import Offerte from "./pages/Offerte";
import ComingSoon from "./pages/ComingSoon";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assortiment" element={<Assortiment />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/offerte" element={<Offerte />} />
        <Route path="/brandkit" element={<ComingSoon title="Brand kit" />} />
        <Route path="*" element={<ComingSoon title="Pagina niet gevonden" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
