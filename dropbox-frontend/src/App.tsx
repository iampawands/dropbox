import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* You can add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
