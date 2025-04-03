import React, { useState, useEffect } from 'react';
import { Home, Info, Mail, Code, MessageSquare, Globe, LogIn, LogOut, User } from 'lucide-react';
import MatrixBackground from './MatrixBackground';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface RetroLayoutProps {
  children: React.ReactNode;
}

const RetroLayout: React.FC<RetroLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logo = "/img/logo.png";
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
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black/90 overflow-hidden relative">
      {/* Matrix Animation Background */}
      <MatrixBackground density={200} />
      
      {/* Header */}
      <header className="relative z-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between bg-black/75 border-b border-zinc-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-zinc-800 bg-black/10 flex items-center justify-center">
              <img 
                src={logo} 
                alt="FHS Logo" 
                className="w-[150%] h-[150%] object-contain scale-150"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-zinc-100">FHS</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink href="/" active={location.pathname === "/"} icon={<Home size={16} />}>Terminal</NavLink>
            <NavLink href="/monitor" active={location.pathname === "/monitor"} icon={<Code size={16} />}>Monitoring</NavLink>
            <NavLink href="/about" active={location.pathname === "/about"} icon={<Info size={16} />}>À Propos</NavLink>
            <NavLink href="/contact" active={location.pathname === "/contact"} icon={<Mail size={16} />}>Contact</NavLink>
            <NavLink href="/irisweb" active={location.pathname === "/irisweb"} icon={<Globe size={16} />}>IrisWeb</NavLink>
            <NavLink href="https://discord.gg/fhs" active={false} icon={<MessageSquare size={16} />} external>Discord</NavLink>
            {session && (
              <NavLink href="/profile" active={location.pathname === "/profile"} icon={<User size={16} />}>Profil</NavLink>
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
            <MobileMenu session={session} onAuth={handleAuth} />
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
            Créé par <Link to="/irisweb" className="hover:text-france-blue transition-colors">iHorizon Project (IrisWeb)</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ session, onAuth }: { session: any, onAuth: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

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
          <Link 
            to="/" 
            className={`block px-4 py-3 text-sm ${location.pathname === '/' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            onClick={() => setIsOpen(false)}
          >
            <Home size={16} className="inline mr-2" /> Terminal
          </Link>
          <Link 
            to="/monitor" 
            className={`block px-4 py-3 text-sm ${location.pathname === '/monitor' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            onClick={() => setIsOpen(false)}
          >
            <Code size={16} className="inline mr-2" /> Monitoring
          </Link>
          <Link 
            to="/about" 
            className={`block px-4 py-3 text-sm ${location.pathname === '/about' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            onClick={() => setIsOpen(false)}
          >
            <Info size={16} className="inline mr-2" /> À Propos
          </Link>
          <Link 
            to="/contact" 
            className={`block px-4 py-3 text-sm ${location.pathname === '/contact' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            onClick={() => setIsOpen(false)}
          >
            <Mail size={16} className="inline mr-2" /> Contact
          </Link>
          <Link 
            to="/irisweb" 
            className={`block px-4 py-3 text-sm ${location.pathname === '/irisweb' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
            onClick={() => setIsOpen(false)}
          >
            <Globe size={16} className="inline mr-2" /> IrisWeb
          </Link>
          <a 
            href="https://discord.gg/fhs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm text-france-white hover:bg-france-blue hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <MessageSquare size={16} className="inline mr-2" /> Discord
          </a>
          {session && (
            <Link 
              to="/profile" 
              className={`block px-4 py-3 text-sm ${location.pathname === '/profile' ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="inline mr-2" /> Profil
            </Link>
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
  href: string; 
  children: React.ReactNode; 
  active: boolean; 
  icon: React.ReactNode;
  external?: boolean;
}> = ({ href, children, active, icon, external = false }) => {
  if (external) {
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
    <Link 
      to={href} 
      className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${active ? 'bg-black/10 text-zinc-100' : 'text-zinc-400'} hover:bg-black/10 hover:text-zinc-100`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};

export default RetroLayout;
