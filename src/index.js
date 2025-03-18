import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { routes } from './routes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './index.css';

// Create root container
const container = document.getElementById('root');
const root = createRoot(container);

// App component with routing and layout
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 