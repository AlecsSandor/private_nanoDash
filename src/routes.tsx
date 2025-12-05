import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "./layouts";
import { LandingPage } from "./pages/LandingPage";
import { ErrorPage } from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> }
    ],
  }
]);

export default router;
