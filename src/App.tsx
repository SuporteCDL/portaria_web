import { Routes, Route } from "react-router-dom"
import Entradas from './components/entradas'
import Modal from 'react-modal';
import Dashboard from "./dashboard";
import Header from "./components/header";

Modal.setAppElement('#root');

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/entradas" element={<Entradas />} />
      </Routes>
    </>
  )
}

export default App
