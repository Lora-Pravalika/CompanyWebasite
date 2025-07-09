import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="*" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App