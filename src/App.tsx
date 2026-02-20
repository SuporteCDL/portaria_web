import { Routes, Route } from "react-router-dom"
import Modal from 'react-modal';
import Entradas from './pages/entradas'
import Dashboard from "./pages/dashboard"; 
import ForgotPassword from "./auth/forgotpassword";
import SignIn from "./auth/signin";
import { PrivateRoute } from "./routes/PrivateRoute";
import { ProtectedLayout } from "./routes/ProtectedLayout";
import RelAtendimentos from "./pages/relatendimentos";
import Users from "./pages/users";
import Profile from "./pages/profile";

Modal.setAppElement('#root');

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/entradas" element={<Entradas />} />
          <Route path="/relatendimentos" element={<RelAtendimentos />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
