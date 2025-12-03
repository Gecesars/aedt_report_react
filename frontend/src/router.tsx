import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SessionPage from "./pages/SessionPage";
import SummaryPage from "./pages/SummaryPage";
import SParametersPage from "./pages/SParametersPage";
import RadiationPage from "./pages/RadiationPage";
import SimulationVideoPage from "./pages/SimulationVideoPage";
import DatasheetPage from "./pages/DatasheetPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Layout encapsula sidebar/topbar
    children: [
      { index: true, element: <SessionPage /> },
      { path: "summary/:designId", element: <SummaryPage /> },
      { path: "sparameters/:designId", element: <SParametersPage /> },
      { path: "radiation/:designId", element: <RadiationPage /> },
      { path: "simulations/:designId", element: <SimulationVideoPage /> },
      { path: "datasheet/:designId", element: <DatasheetPage /> }
    ]
  }
]);

export default router;

