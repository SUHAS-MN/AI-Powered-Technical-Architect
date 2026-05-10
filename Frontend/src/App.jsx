import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';
import LivingGrid from './components/LivingGrid';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen relative selection:bg-cyan-500/30 selection:text-white">
                    <LivingGrid />
                    <div className="relative z-10 flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<Auth initialMode="login" />} />
                                <Route path="/register" element={<Auth initialMode="register" />} />

                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/new-project" element={
                                    <ProtectedRoute>
                                        <NewProject />
                                    </ProtectedRoute>
                                } />
                                <Route path="/project/:id" element={
                                    <ProtectedRoute>
                                        <ProjectDetails />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        {/* Semantic Footer for SEO */}
                        <footer className="py-12 px-6 border-t border-white/5 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
                                © 2026 TechArch Spatial Blueprint Engine • Built for the Infinite
                            </p>
                        </footer>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
