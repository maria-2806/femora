import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Heart,
  Brain,
  Calendar,
  MessageCircle,
  User
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setIsOpen(false);
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  const navItems = [
    { icon: Brain, label: 'Scan Analysis', to: 'scan' },
    { icon: Calendar, label: 'Period Tracker', to: 'tracker' },
    { icon: MessageCircle, label: 'AI Chat', to: 'chat' },
    { icon: User, label: 'Profile', to: 'profile' },
  ];

  const handleNavClick = (path: string) => {
    if (isLoggedIn) {
      navigate(`/${path}`);
    } else {
      const section = document.getElementById(path);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border/50 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-soft">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Femora
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.to)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            {authReady && (
              isLoggedIn ? (
                <Button variant="feminine" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              ) : (
                <AuthModal>
                  <Button variant="feminine" size="sm" className="animate-glow-pulse">
                    Sign In
                  </Button>
                </AuthModal>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-down">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.to)}
                  className="flex items-center space-x-3 p-2 text-muted-foreground hover:text-primary transition-colors duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="pt-2">
                {authReady && (
                  isLoggedIn ? (
                    <Button
                      variant="feminine"
                      size="sm"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <AuthModal>
                      <Button
                        variant="feminine"
                        size="lg"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Button>
                    </AuthModal>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
