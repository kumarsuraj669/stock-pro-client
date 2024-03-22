import './App.css';
import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <>
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="/*" element={<Main />} />
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
    </>
  );
}

export default App;
