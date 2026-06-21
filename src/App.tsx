/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { RatingApp } from "./pages/RatingApp";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rating" element={<RatingApp />} />
        <Route path="/rating/:slug" element={<RatingApp />} />
      </Routes>
    </BrowserRouter>
  );
}
