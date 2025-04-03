import React, { useState, useEffect } from 'react';
import { Home, Info, Mail, Code, MessageSquare, Globe, LogIn, LogOut, User, Terminal } from 'lucide-react';
import MatrixBackground from './MatrixBackground';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppUrl } from '@/hooks/useAppUrl';

interface RetroLayoutProps {
  children: React.ReactNode;
}

const RetroLayout: React.FC<RetroLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAssetPath, navigateTo } = useAppUrl();
  const logo = getAssetPath("/img/logo.png");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async () => {
    if (session) {
      await supabase.auth.signOut();
      navigateTo('/');
    } else {
      navigateTo('/login');
    }
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black/90 overflow-hidden relative">
      {/* Matrix Animation Background */}
      <MatrixBackground density={200} />
      
      {/* Header */}
      <header className="relative z-30">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between bg-black/75 border-b border-zinc-800">
          <a href="/" onClick={handleNavigation('/')} className="flex items-center space-x-2">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-zinc-800 bg-black/10 flex items-center justify-center">
              <img 
                src={logo} 
                alt="FHS Logo" 
                className="w-[150%] h-[150%] object-contain scale-150"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-zinc-100">FHS</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" active={location.pathname === "/"} icon={<Home size={16} />} onClick={handleNavigation('/')}>Accueil</NavLink>
            <NavLink to="/terminal" active={location.pathname === "/terminal"} icon={<Terminal size={16} />} onClick={handleNavigation('/terminal')}>Terminal</NavLink>
            <NavLink to="/monitor" active={location.pathname === "/monitor"} icon={<Code size={16} />} onClick={handleNavigation('/monitor')}>Monitoring</NavLink>
            <NavLink to="/about" active={location.pathname === "/about"} icon={<Info size={16} />} onClick={handleNavigation('/about')}>À Propos</NavLink>
            <NavLink to="/contact" active={location.pathname === "/contact"} icon={<Mail size={16} />} onClick={handleNavigation('/contact')}>Contact</NavLink>
            <NavLink to="/irisweb" active={location.pathname === "/irisweb"} icon={<Globe size={16} />} onClick={handleNavigation('/irisweb')}>IrisWeb</NavLink>
            <NavLink href="https://discord.gg/fhs" active={false} icon={<MessageSquare size={16} />} external>Discord</NavLink>
            {session && (
              <NavLink to="/profile" active={location.pathname === "/profile"} icon={<User size={16} />} onClick={handleNavigation('/profile')}>Profil</NavLink>
            )}
            <button
              onClick={handleAuth}
              className="france-button text-sm transition-all duration-300 flex items-center text-france-white/90 hover:text-black"
            >
              {session ? (
                <>
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </>
              ) : (
                <>
                  <LogIn size={16} className="mr-2" />
                  Connexion
                </>
              )}
            </button>
          </nav>
          
          <div className="md:hidden">
            <MobileMenu session={session} onAuth={handleAuth} onNavigate={handleNavigation} />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-x-hidden">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 france-card">
        <div className="w-full max-w-[1920px] mx-auto p-4 text-center text-xs md:text-sm">
          <p className="animate-pulse">
            <span className="text-france-blue">&#91;</span> 
            FHS <span className="text-france-white">|</span> Connexion Sécurisée Établie 
            <span className="text-france-red">&#93;</span>
          </p>
          <p className="mt-1 text-france-white/70">
            &copy; {new Date().getFullYear()} French Hackers Squad • Tous les systèmes surveillés
          </p>
          <p className="mt-1 text-france-white/80">
            Créé par <a href="/irisweb" onClick={handleNavigation('/irisweb')} className="hover:text-france-blue transition-colors">iHorizon Project (IrisWeb)</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ session, onAuth, onNavigate }: { session: any, onAuth: () => void, onNavigate: (path: string) => (e: React.MouseEvent) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    setIsOpen(false);
    onNavigate(path)(e);
  };

  return (
    <div className="relative">
      <button 
        className="france-button flex items-center text-france-white/90 hover:text-black" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{isOpen ? 'Fermer' : 'Menu'}</span>
        <div className="flex flex-col space-y-1">
          <span className={`block w-4 h-0.5 bg-france-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-4 h-0.5 bg-france-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-4 h-0.5 bg-france-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed top-16 right-0 left-0 mt-0 py-2 bg-black/5 backdrop-blur-sm border border-zinc-800 shadow-lg z-50 mx-4 rounded-xl">
          <a 
            href="/"
            onClick={handleClick('/')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Home size={16} className="inline mr-2" /> Accueil
          </a>
          <a 
            href="/terminal"
            onClick={handleClick('/terminal')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/terminal' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Terminal size={16} className="inline mr-2" /> Terminal
          </a>
          <a 
            href="/monitor"
            onClick={handleClick('/monitor')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/monitor' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Code size={16} className="inline mr-2" /> Monitoring
          </a>
          <a 
            href="/about"
            onClick={handleClick('/about')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/about' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Info size={16} className="inline mr-2" /> À Propos
          </a>
          <a 
            href="/contact"
            onClick={handleClick('/contact')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/contact' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Mail size={16} className="inline mr-2" /> Contact
          </a>
          <a 
            href="/irisweb"
            onClick={handleClick('/irisweb')}
            className={`block px-4 py-3 text-sm ${location.pathname === '/irisweb' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
          >
            <Globe size={16} className="inline mr-2" /> IrisWeb
          </a>
          <a 
            href="https://discord.gg/fhs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm text-france-white hover:bg-france-blue hover:text-white"
          >
            <MessageSquare size={16} className="inline mr-2" /> Discord
          </a>
          {session && (
            <a 
              href="/profile"
              onClick={handleClick('/profile')}
              className={`block px-4 py-3 text-sm ${location.pathname === '/profile' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            >
              <User size={16} className="inline mr-2" /> Profil
            </a>
          )}
          <button
            onClick={() => {
              onAuth();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-france-white hover:bg-france-blue hover:text-white"
          >
            {session ? (
              <>
                <LogOut size={16} className="inline mr-2" />
                Déconnexion
              </>
            ) : (
              <>
                <LogIn size={16} className="inline mr-2" />
                Connexion
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Navigation Link component
const NavLink: React.FC<{ 
  to?: string;
  href?: string;
  children: React.ReactNode; 
  active: boolean; 
  icon: React.ReactNode;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ to, href, children, active, icon, external = false, onClick }) => {
  if (external && href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${active ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <a 
      href={to || '/'} 
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${active ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};

export default RetroLayout;
