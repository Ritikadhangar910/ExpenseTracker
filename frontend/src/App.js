import Auth from "./components/Auth";
import Expensepage from "./components/Expensepage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbarfile from "./components/Navbarfile";
import Forgotpass from "./components/Forgotpass";
import { useSelector } from "react-redux";
import Error from "./components/Error";
function App() {
  const isLoggedIn = useSelector((state) => state.credential.isLoggedIn);

  return (
    <BrowserRouter>
      <Navbarfile />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Expensepage />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="/password/resetpassword" element={<Forgotpass />} />
          </>
        )}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
