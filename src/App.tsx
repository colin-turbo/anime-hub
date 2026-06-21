import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Rankings from './pages/Rankings';
import Seasonal from './pages/Seasonal';
import Schedule from './pages/Schedule';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter basename="/anime-hub">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<Detail />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/seasonal" element={<Seasonal />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
