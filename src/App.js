import { createTheme, ThemeProvider } from "@mui/material";
import { red, orange } from "@mui/material/colors";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import LoadingComponent from "./Contexts/Loader/Loader";
import { LoadingProvider } from "./Contexts/Loader/LoadingProvider";
import Login from "./Components/Login/Login";
import AuthorisedLayout from "./Layouts/Authorised";
import UnAuthorisedLayout from "./Layouts/UnAuthorised";
import ViewList from "./Components/ViewList/ViewList";
function WildRoute() {
  return <Navigate to="/login" />;
}
const theme = createTheme({
  palette: {
    error: {
      main: red[100],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <LoadingComponent />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthorisedLayout />}>
              <Route index element={<Home />} />
              <Route path="list/:listId" element={<ViewList />} />
            </Route>
            <Route path="/" element={<UnAuthorisedLayout />}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="*" index element={<WildRoute />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
