import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import VideoUploadPage from "../pages/VideoUploadPage";
import PeopleAmountPage from "../pages/PeopleAmountPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "upload", element: <VideoUploadPage /> },
      { path: "analytics/people", element: <PeopleAmountPage /> }
    ],
  },
]);