import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, Check, Copy, Settings, 
  ChevronDown, ChevronUp, Save, LayoutTemplate, 
  FileText, Menu, X, ArrowRight, ArrowLeft,
  Users, Shield, Zap, Database, Type, List, Box,
  Folder, FolderOpen, Eye, Globe, Lock, Star, Mail, MapPin, Phone, Accessibility,
  ArrowUp, ArrowDown, AlertTriangle, MoreHorizontal, Sparkles, MessageSquare, HelpCircle, Activity,
  Quote, FileCheck, Layers, Briefcase, Stethoscope, Gavel, UserCheck, Mic, GraduationCap, Store,
  LogOut, User
} from 'lucide-react';
import { supabase } from './lib/supabase.js';
import * as supabaseService from './lib/supabaseService.js';

// --- DATA --- //

const INITIAL_DATA = [
  {
    id: 'cat-1',
    title: 'סיכום רפואי',
    description: 'תבניות לסיכום ביקור רופא, שחרור מאשפוז והפניות.',
    subcategories: [
      {
        id: 'sub-1',
        title: 'תלונות עיקריות',
        sections: [
            {
                id: 'sec-1',
                title: 'תסמינים',
                sentences: [
                    {
                        id: 'sen-1',
                        parts: [
                        { type: 'text', value: 'המטופל מתלונן על כאבים ב' },
                        { type: 'select', value: 'ראש,בטן,גב,חזה', label: 'אזור' },
                        { type: 'text', value: ' במשך ' },
                        { type: 'input', value: '', label: 'זמן', width: 'w-24' },
                        { type: 'text', value: '.' }
                        ]
                    }
                ]
            }
        ]
      }
    ]
  },
  {
    id: 'cat-2',
    title: 'הסכמים משפטיים',
    description: 'חוזים סטנדרטיים, הצהרות הון ומסמכי עבודה.',
    subcategories: [
      {
        id: 'sub-3',
        title: 'פרטי צדדים',
        sections: [
            {
                id: 'sec-3',
                title: 'זיהוי',
                sentences: [
                    {
                        id: 'sen-3',
                        parts: [
                        { type: 'text', value: 'הסכם זה נערך ונחתם ב' },
                        { type: 'input', value: '', label: 'עיר', width: 'w-32' },
                        { type: 'text', value: ' בתאריך ' },
                        { type: 'input', value: '', inputType: 'date', label: 'תאריך', width: 'w-40' },
                        { type: 'text', value: '.' }
                        ]
                    }
                ]
            }
        ]
      }
    ]
  }
];

// --- UI COMPONENTS --- //

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon: Icon, disabled, type="button", ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:brightness-110 border border-transparent",
    secondary: "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    cta: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-8 text-lg min-w-[160px]"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className={`w-4 h-4 ${children ? 'ml-2' : ''}`} aria-hidden="true" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#121620] border border-white/10 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md ${onClick ? 'cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1' : ''} ${className}`}
  >
    {children}
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        className="w-full py-4 flex justify-between items-center text-right focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors">{question}</span>
        <span className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

// --- MODALS --- //

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onCancel}></div>
            <div className="bg-[#1A1F2E] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm relative z-10 p-6 animate-scale-in">
                <div className="flex items-center gap-3 text-red-400 mb-4">
                    <div className="bg-red-500/10 p-2 rounded-full border border-red-500/20"><AlertTriangle size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-100">{title}</h3>
                </div>
                <p className="text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel}>ביטול</Button>
                    <Button variant="danger" onClick={onConfirm}>מחק</Button>
                </div>
            </div>
        </div>
    );
};

const PartConfigModal = ({ isOpen, part, onSave, onCancel }) => {
    const [localPart, setLocalPart] = useState(part);
    useEffect(() => { setLocalPart(part); }, [part]);
    if (!isOpen || !localPart) return null;
    const handleSave = () => { onSave(localPart); };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onCancel}></div>
            <div className="bg-[#1A1F2E] border border-white/10 rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-scale-in">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                    <h3 className="text-lg font-bold text-gray-100">הגדרות אלמנט</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">תווית</label>
                        <input className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2 text-white focus:border-blue-500 outline-none" value={localPart.label || ''} onChange={(e) => setLocalPart({...localPart, label: e.target.value})} placeholder="לדוגמה: שם מלא" />
                    </div>
                    {localPart.type === 'select' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">אפשרויות (מופרדות בפסיק)</label>
                            <textarea className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2 text-white focus:border-blue-500 outline-none h-24" value={localPart.value || ''} onChange={(e) => setLocalPart({...localPart, value: e.target.value})} placeholder="אופציה א, אופציה ב" />
                        </div>
                    )}
                    {localPart.type === 'input' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">רוחב השדה</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[{ label: 'קצר', val: 'w-16' }, { label: 'בינוני', val: 'w-32' }, { label: 'ארוך', val: 'w-64' }, { label: 'מלא', val: 'w-full' }].map((opt) => (
                                    <button key={opt.val} type="button" onClick={() => setLocalPart({...localPart, width: opt.val})} className={`py-2 text-sm rounded border transition-all ${localPart.width === opt.val ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{opt.label}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="secondary" onClick={onCancel}>ביטול</Button>
                    <Button variant="primary" onClick={handleSave}>שמור</Button>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, onClose }) => {
    useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] z-[150] flex items-center gap-2 animate-fade-in-up border border-blue-400/30">
            <Check size={18} className="text-white" /><span>{message}</span>
        </div>
    );
};

// --- AUTH PAGES --- //

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // משתמש קבוע - ניתן לשנות כאן
  const HARDCODED_EMAIL = 'oferlimonad@gmail.com';
  const HARDCODED_PASSWORD = '0710';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Mock validation - משתמש קבוע
    if (email.toLowerCase() === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      // Try to sign in with Supabase, but if it fails, use mock auth
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password: password
        });

        if (!signInError && data.user) {
          onLogin();
          return;
        }
      } catch (err) {
        // If Supabase fails, use mock auth
      }
      
      // Mock authentication fallback
      onLogin();
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">התחברות</h2>
                <p className="text-gray-400">ברוך שובך ל-DocsGenius</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">אימייל</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        required
                        dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">סיסמה</label>
                    <input 
                        type="password" 
                        className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        required
                        dir="ltr"
                    />
                </div>
                
                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}

                <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
                  {loading ? 'מתחבר...' : 'התחבר למערכת'}
                </Button>
            </form>
        </Card>
    </div>
  );
};

const SignupPage = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
        setError('הסיסמאות אינן תואמות');
        return;
    }
    if (password.length < 6) {
        setError('סיסמה חייבת להכיל לפחות 6 תווים');
        return;
    }
    
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password
      });

      if (signUpError) throw signUpError;
      
      if (data.user) {
        onSignupSuccess();
      }
    } catch (err) {
      setError(err.message || 'שגיאה בהרשמה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">הרשמה</h2>
                <p className="text-gray-400">צור חשבון חדש ב-DocsGenius</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">אימייל</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">סיסמה</label>
                    <input 
                        type="password" 
                        className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">אימות סיסמה</label>
                    <input 
                        type="password" 
                        className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        dir="ltr"
                    />
                </div>
                
                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}

                <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
                  {loading ? 'נרשם...' : 'צור חשבון'}
                </Button>
            </form>
        </Card>
    </div>
  );
};

// --- MAIN APP --- //

export default function App() {
  const [view, setView] = useState('home'); 
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [view]);

  // Auth Check on Load and Listen for Auth Changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadData();
      } else {
        setData(INITIAL_DATA);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase
  const loadData = async () => {
    try {
      const categories = await supabaseService.loadCategories();
      if (categories && categories.length > 0) {
        setData(categories);
      } else if (categories && categories.length === 0 && data === INITIAL_DATA) {
        // Keep INITIAL_DATA if user has no data yet
        // This allows new users to see example data
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setToastMsg('שגיאה בטעינת הנתונים');
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadData();
    }
  }, [isAuthenticated, loading]);

  // Save data to Supabase whenever it changes (debounced)
  // Only save if data is different from INITIAL_DATA and user is authenticated
  useEffect(() => {
    if (!isAuthenticated || loading) return;
    if (data === INITIAL_DATA) return; // Don't save initial data
    
    const timeoutId = setTimeout(async () => {
      try {
        await supabaseService.saveFullStructure(data);
      } catch (error) {
        console.error('Error saving data:', error);
        setToastMsg('שגיאה בשמירת הנתונים');
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [data, isAuthenticated, loading]);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    setToastMsg('התחברת בהצלחה');
    await loadData();
    navigate('categories');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setData(INITIAL_DATA);
    setToastMsg('התנתקת מהמערכת');
    navigate('home');
  };

  const getSelectedCategory = () => data.find(c => c.id === selectedCategoryId);
  const getSelectedSubcategory = () => {
    const cat = getSelectedCategory();
    return cat ? cat.subcategories.find(s => s.id === selectedSubcategoryId) : null;
  };

  const navigate = (newView) => { setView(newView); setIsDrawerOpen(false); };
  const selectCategory = (id) => { setSelectedCategoryId(id); setView('subcategories'); };
  const selectSubcategory = (id) => { setSelectedSubcategoryId(id); setView('builder'); };
  const showToast = (msg) => setToastMsg(msg);

  const renderContent = () => {
      // Protection Logic
      if (['categories', 'subcategories', 'builder'].includes(view) && !isAuthenticated) {
          return <LoginPage onLogin={handleLogin} />;
      }

      switch(view) {
          case 'home': return (
            <>
              <style>{`
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-slow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
                .perspective-1000 { perspective: 1000px; }
              `}</style>
              <HeroSection onStart={() => navigate('categories')} isAuthenticated={isAuthenticated} />
              <WhySection />
              <HowItWorksSection />
              <WhoIsItForSection />
              <ExamplesSection />
              <CTASection onStart={() => navigate('categories')} isAuthenticated={isAuthenticated} />
              <TestimonialsCarousel />
              <HomePricingSection onStart={() => navigate('categories')} isAuthenticated={isAuthenticated} />
            </>
          );
          case 'categories': return <CategoriesPage data={data} setData={setData} onSelect={selectCategory} showToast={showToast} />;
          case 'subcategories': return getSelectedCategory() ? <SubcategoriesPage category={getSelectedCategory()} setData={setData} onSelect={selectSubcategory} showToast={showToast} /> : navigate('categories');
          case 'builder': return getSelectedSubcategory() ? <BuilderPage category={getSelectedCategory()} subcategory={getSelectedSubcategory()} setData={setData} showToast={showToast} /> : navigate('categories');
          case 'about': return <AboutPage />;
          case 'pricing': return <PricingPage onStart={() => navigate('categories')} isAuthenticated={isAuthenticated} />;
          case 'contact': return <ContactPage showToast={showToast} />;
          case 'terms': return <TermsPage />;
          case 'privacy': return <PrivacyPage />;
          case 'accessibility': return <AccessibilityPage />;
          
          // Auth Routes
          case 'login': return <LoginPage onLogin={handleLogin} />;
          case 'signup': return <SignupPage onSignupSuccess={() => { showToast('הרשמה מוצלחת! אנא התחבר'); navigate('login'); }} />;
          
          default: return <HeroSection onStart={() => navigate('categories')} isAuthenticated={isAuthenticated} />;
      }
  };

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-[#0B0F17] text-gray-200 font-sans selection:bg-blue-500/30">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F17]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <button className="flex items-center gap-2 group" onClick={() => navigate('home')}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
                <LayoutTemplate className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">DocsGenius</span>
          </button>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2 space-x-reverse">
            <Button variant="ghost" onClick={() => navigate('home')}>ראשי</Button>
            <Button variant="ghost" onClick={() => navigate('categories')}>תבניות</Button>
            <Button variant="ghost" onClick={() => navigate('pricing')}>מחירים</Button>
            
            <div className="w-px h-6 bg-white/10 mx-2"></div>

            {!isAuthenticated ? (
                <>
                    <Button variant="ghost" onClick={() => navigate('login')}>התחברות</Button>
                    <Button variant="primary" onClick={() => navigate('signup')} className="mr-2">הרשמה</Button>
                </>
            ) : (
                <Button variant="secondary" onClick={handleLogout} icon={LogOut} className="mr-2 text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10">התנתק</Button>
            )}
          </nav>
          
          <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"><Menu /></button>
        </div>
      </header>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsDrawerOpen(false)}></div>
            <div className="relative bg-[#121620] border-l border-white/10 w-3/4 max-w-sm h-full shadow-2xl flex flex-col p-6 animate-slide-in-right">
                <div className="flex justify-between items-center mb-8"><span className="font-bold text-xl text-white">תפריט</span><button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-white"><X size={24}/></button></div>
                <nav className="space-y-4">
                    {[{l:'דף הבית',v:'home'},{l:'תבניות',v:'categories'},{l:'מחירים',v:'pricing'},{l:'אודות',v:'about'},{l:'נגישות',v:'accessibility'}].map(i => (
                        <Button key={i.v} variant="secondary" className="w-full justify-start text-lg h-12" onClick={() => navigate(i.v)}>{i.l}</Button>
                    ))}
                    <div className="h-px bg-white/10 my-4"></div>
                    {!isAuthenticated ? (
                        <>
                            <Button variant="ghost" className="w-full justify-start text-lg h-12" onClick={() => navigate('login')}>התחברות</Button>
                            <Button variant="primary" className="w-full justify-start text-lg h-12" onClick={() => navigate('signup')}>הרשמה</Button>
                        </>
                    ) : (
                         <Button variant="danger" className="w-full justify-start text-lg h-12" onClick={handleLogout} icon={LogOut}>התנתק</Button>
                    )}
                </nav>
            </div>
        </div>
      )}
      <main className="flex-1 relative">
          <div className="relative z-10">
            {/* Show breadcrumbs only on app pages */}
            {['categories', 'subcategories', 'builder'].includes(view) && (
                <div className="max-w-7xl mx-auto px-4 pt-8">
                    <Breadcrumbs view={view} subcategory={getSelectedSubcategory()} onHome={() => navigate('home')} onCategories={() => navigate('categories')} onSubcategories={() => selectCategory(selectedCategoryId)} />
                </div>
            )}
            {/* Content Render */}
            {['home','about','pricing','contact','terms','privacy','accessibility','login','signup'].includes(view) ? renderContent() : <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 min-h-[600px]">{renderContent()}</div>}
          </div>
      </main>
      <footer className="border-t border-white/5 bg-[#080B11] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4 text-white"><LayoutTemplate className="h-6 w-6 text-blue-500 ml-2" /><span className="text-xl font-bold">DocsGenius</span></div>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">הפלטפורמה המתקדמת ליצירת מסמכים דינמיים. עיצוב חדשני, ביצועים מהירים.</p>
            </div>
            <div><h4 className="font-bold text-gray-100 mb-4">חברה</h4><ul className="space-y-2 text-gray-500 text-sm"><li><button onClick={() => navigate('about')} className="hover:text-blue-400">אודות</button></li><li><button onClick={() => navigate('pricing')} className="hover:text-blue-400">מחירים</button></li><li><button onClick={() => navigate('contact')} className="hover:text-blue-400">צור קשר</button></li></ul></div>
            <div><h4 className="font-bold text-gray-100 mb-4">משפטי</h4><ul className="space-y-2 text-gray-500 text-sm"><li><button onClick={() => navigate('terms')} className="hover:text-blue-400">תנאי שימוש</button></li><li><button onClick={() => navigate('privacy')} className="hover:text-blue-400">מדיניות פרטיות</button></li><li><button onClick={() => navigate('accessibility')} className="hover:text-blue-400 flex items-center gap-1"><Accessibility size={14}/> הצהרת נגישות</button></li></ul></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">© 2025 DocsGenius. Dark Mode Edition.</div>
      </footer>
    </div>
  );
}

// --- HERO SECTION --- //

const HeroSection = ({ onStart, isAuthenticated }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden bg-[#0B0F17] pt-20 pb-32"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
            }}
          ></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors duration-300">
                  <Sparkles size={14} className="text-blue-400 animate-pulse" />
                  <span className="font-medium tracking-wide">יותר זמן למה שחשוב</span>
              </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-white drop-shadow-xl">מערכת חכמה ליצירת</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg">
                  משפטים דינמיים
              </span>
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              הדרך המהירה, המדויקת והמסודרת לחסוך זמן הקלדה מיותר.
              המערכת מאפשרת בנייה, ניהול, והעתקה מיידית של תבניות טקסט — מותאם במיוחד לצרכים מקצועיים.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button variant="primary" size="xl" onClick={onStart} icon={Zap} className="px-10 py-4 text-lg">
                  {isAuthenticated ? 'המשך לעבוד' : 'התחל ליצור תבניות'}
              </Button>
              {!isAuthenticated && (
                  <Button variant="secondary" size="xl" onClick={() => document.getElementById('login')?.scrollIntoView()} className="px-10 py-4 text-lg">
                      התחבר למערכת
                  </Button>
              )}
          </div>

          {/* 3D Document Editor Preview */}
          <div 
            className="relative w-full max-w-5xl mx-auto perspective-1000 animate-fade-in-up" 
            style={{ animationDelay: '0.5s' }}
          >
              <div 
                className="relative bg-[#131722]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-float"
                style={{
                    boxShadow: `0 30px 60px -12px rgba(0,0,0,0.5), ${mousePos.x * -30}px ${mousePos.y * -30}px 50px rgba(0,0,0,0.4)`
                }}
              >
                  <div className="h-14 border-b border-white/5 bg-white/5 flex items-center px-6 gap-3">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="flex-1 text-center flex justify-center">
                          <div className="px-4 py-1 bg-black/20 rounded text-xs text-gray-500 font-mono">מסמך חדש.docs</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30"></div>
                  </div>
                  
                  <div className="p-0 grid grid-cols-12 h-[450px] overflow-hidden">
                      <div className="col-span-3 border-l border-white/5 bg-[#0F131C] p-4 hidden md:block">
                          <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">תבניות</div>
                          <div className="space-y-2">
                              {[1, 2, 3].map(i => (
                                  <div key={i} className={`h-10 w-full rounded-lg flex items-center px-3 gap-3 ${i===1 ? 'bg-blue-600/10 border border-blue-500/20' : 'hover:bg-white/5'}`}>
                                      <div className={`w-2 h-2 rounded-full ${i===1 ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                                      <div className={`h-2 rounded w-20 ${i===1 ? 'bg-blue-200/20' : 'bg-gray-700'}`}></div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="col-span-12 md:col-span-9 p-8 bg-[#131722]">
                          <div className="max-w-2xl mx-auto bg-white/5 border border-white/5 rounded-xl p-8 shadow-2xl h-full relative overflow-hidden">
                              <div className="w-1/3 h-4 bg-gray-600/50 rounded mb-8"></div>
                              <div className="space-y-6">
                                  <div className="flex items-center gap-2 flex-wrap">
                                      <div className="h-2 w-16 bg-gray-700 rounded"></div>
                                      <div className="h-2 w-24 bg-gray-700 rounded"></div>
                                      <div className="h-8 px-3 rounded border border-blue-500/50 bg-blue-500/10 flex items-center min-w-[100px] animate-pulse">
                                          <div className="h-2 w-full bg-blue-400/30 rounded"></div>
                                      </div>
                                      <div className="h-2 w-10 bg-gray-700 rounded"></div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                      <div className="h-2 w-32 bg-gray-700 rounded"></div>
                                      <div className="h-2 w-12 bg-gray-700 rounded"></div>
                                      <div className="h-8 px-3 rounded border border-purple-500/50 bg-purple-500/10 flex items-center gap-2 min-w-[140px]">
                                          <div className="h-2 w-full bg-purple-400/30 rounded"></div>
                                          <ChevronDown size={12} className="text-purple-400" />
                                      </div>
                                  </div>
                                  <div className="space-y-2 pt-4">
                                      <div className="h-2 w-full bg-gray-800 rounded"></div>
                                      <div className="h-2 w-5/6 bg-gray-800 rounded"></div>
                                      <div className="h-2 w-4/6 bg-gray-800 rounded"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
};

// --- SECTIONS --- //

const WhySection = () => (
    <section className="py-32 bg-[#080B11]">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white mb-6">למה בכלל צריך את זה?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    בכל תחום מקצועי יש משפטים שחוזרים על עצמם, אבל משתנים מעט מלקוח ללקוח או ממקרה למקרה.
                    במקום להקליד כל פעם מחדש — מנהל התבניות מרכז הכול במקום אחד ומייצר סדר יעיל ושפה אחידה.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {t:'בנייה דינמית',d:'לבנות משפטים דינמיים עם שדות משתנים',i:Type},
                    {t:'ארגון חכם',d:'לארגן אותם לפי קטגוריות ותתי־קטגוריות',i:Folder},
                    {t:'העתקה מהירה',d:'להעתיק בלחיצה משפטים מוכנים',i:Copy},
                    {t:'עריכה גמישה',d:'לערוך, לעדכן ולהוסיף תבניות חדשות בכל רגע',i:Edit2},
                ].map((x,i)=>(
                    <Card key={i} className="p-6 bg-[#0F131C] hover:bg-[#141925] border-white/5 text-center group">
                        <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-transform"><x.i size={24}/></div>
                        <h3 className="text-lg font-bold text-white mb-2">{x.t}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{x.d}</p>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorksSection = () => (
    <section id="how" className="py-32 relative bg-[#080B11]">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-white text-center mb-20">איך זה עובד?</h2>
            <div className="grid md:grid-cols-3 gap-12 text-center">
                {[
                    {s:1,t:'בוחרים קטגוריה',d:'כל תחום מקבל תיקייה משלו'},
                    {s:2,t:'יוצרים תבנית משפט',d:'משלבים טקסט קבוע עם שדות דינמיים'},
                    {s:3,t:'שומרים ומשתמשים',d:'בלחיצה אחת מקבלים את המשפט המוכן'}
                ].map((x,i)=>(
                    <div key={i} className="relative p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-2">
                        <div className="w-16 h-16 mx-auto bg-[#0B0F17] border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-lg group-hover:border-blue-500/30 transition-colors">
                            <span className="text-3xl font-bold">{x.s}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{x.t}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{x.d}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhoIsItForSection = () => (
    <section className="py-32 bg-[#080B11] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">למי זה מתאים?</h2>
                <p className="text-gray-400">פתרון מושלם למגוון מקצועות</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    {t:'רופאים ואנשי רפואה', i:Stethoscope},
                    {t:'עורכי דין', i:Gavel},
                    {t:'אנשי שירות', i:HeadphonesIcon},
                    {t:'יועצים', i:Briefcase},
                    {t:'מורים ומרצים', i:GraduationCap},
                    {t:'בעלי עסקים', i:Store},
                    {t:'כל מי שעובד עם טקסט', i:Users},
                ].map((x,i)=>(
                    <Card key={i} className="p-6 flex flex-col items-center justify-center text-center bg-[#151923] hover:border-blue-500/40 group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:text-blue-400 transition-colors">
                            <x.i size={24}/>
                        </div>
                        <span className="text-gray-200 font-medium">{x.t}</span>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);

// Placeholder icon for Headphones
const HeadphonesIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;

const ExamplesSection = () => (
    <section className="py-24 bg-[#080B11]">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">תבניות לדוגמה</h2>
            <p className="text-gray-400 mb-12">הפוך את העבודה למהירה ויעילה יותר.</p>
            <div className="grid md:grid-cols-2 gap-4">
                {['סיכום ביקור רפואי', 'הודעות למטופלים / לקוחות', 'משפטי שירות', 'חוזים משפטיים'].map((item,i) => (
                    <div key={i} className="flex items-center p-4 bg-[#1A1F2E] border border-white/5 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center ml-4 shrink-0"><Check size={16}/></div>
                        <span className="text-gray-200 text-lg">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CTASection = ({ onStart, isAuthenticated }) => (
    <section className="py-32 text-center relative overflow-hidden bg-[#0B0F17]">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                המערכת הופכת הקלדה ידנית למסודרת, אחידה ויעילה
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                משפרת את התקשורת הבינאישית, חוסכת זמן, מפחיתה טעויות ומייעלת את העבודה המקצועית.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" size="xl" onClick={onStart} className="px-10">{isAuthenticated ? 'המשך לעבוד' : 'התחל לבנות תבניות משלך'}</Button>
                {!isAuthenticated && <Button variant="secondary" size="xl" onClick={()=>{}}>התחבר לחשבון</Button>}
            </div>
        </div>
    </section>
);

const TestimonialsCarousel = () => {
    const testimonials = [
        { name: 'ד”ר מאיה כהן', role: 'רופאת משפחה', text: 'המערכת חוסכת לי שעות כל שבוע. סוף־סוף כל המשפטים שאני כל הזמן מקלידה מסודרים ונגישים.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { name: 'איתי', role: 'מנהל מוקד שירות', text: 'כאנשי שירות, היכולת להעתיק משפטים מוכנים ולבצע התאמות במקום חסכה לנו המון זמן.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { name: 'רונית', role: 'יועצת שיווק', text: 'המערכת אינטואיטיבית וברורה. יצרתי עשרות תבניות אישיות בתוך דקות.', img: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
        { name: 'ד”ר אמיר לוי', role: 'רופא נשים', text: 'העריכה הדינמית איפשרה לי לבנות תבניות מדויקות ולהרוויח יותר זמן להקשבה למטופלות.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
        { name: 'תמר אבידן', role: 'סמנכ״לית', text: 'עובד מעולה גם מהמובייל. סוף־סוף הרגשתי שהכל מסודר במקום אחד.', img: 'https://i.pravatar.cc/150?u=a04258114e29026302e' }
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => { setCurrent(prev => (prev + 1) % testimonials.length); }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <section className="py-32 bg-[#0B0F17] border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl font-bold text-white mb-16">מה הלקוחות אומרים על מנהל התבניות</h2>
                <div className="relative h-64">
                    {testimonials.map((t, index) => (
                        <div key={index} className={`absolute inset-0 transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center ${index === current ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-8 pointer-events-none'}`}>
                            <Quote className="text-blue-500 mb-6 opacity-80" size={48}/>
                            <p className="text-2xl text-gray-200 mb-8 leading-relaxed font-light max-w-2xl">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full border-2 border-blue-500/30 object-cover" />
                                <div className="text-right">
                                    <div className="text-white font-bold text-lg">{t.name}</div>
                                    <div className="text-blue-400 text-sm">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-blue-500 w-6' : 'bg-white/20 hover:bg-white/40'}`}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePricingSection = ({ onStart, isAuthenticated }) => (
    <section className="py-32 bg-[#080B11]">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">תמחור גמיש לכל צורך</h2>
                <p className="text-gray-400">בחר את התוכנית המתאימה לך</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Free */}
                <Card className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-white mb-2">תוכנית חינמית — Free</h3>
                    <div className="text-4xl font-bold text-gray-200 mb-6">₪0<span className="text-lg font-normal text-gray-500"> / לחודש</span></div>
                    <ul className="space-y-4 mb-8 flex-1 w-full text-right text-sm text-gray-300">
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> יצירה וניהול של עד 3 קטגוריות</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> העתקה מהירה ללוח</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> תצוגה מקדימה דינמית</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> תמיכה במובייל</li>
                    </ul>
                    <Button variant="secondary" className="w-full" onClick={onStart}>{isAuthenticated ? 'בחר תוכנית' : 'התחל בחינם'}</Button>
                </Card>

                {/* Pro */}
                <Card className="p-8 flex flex-col items-center text-center border-blue-500/50 bg-blue-900/10 relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">מומלץ</div>
                    <h3 className="text-xl font-bold text-white mb-2">תוכנית מקצועית — Pro</h3>
                    <div className="text-4xl font-bold text-blue-400 mb-6">₪39<span className="text-lg font-normal text-gray-500"> / לחודש</span></div>
                    <ul className="space-y-4 mb-8 flex-1 w-full text-right text-sm text-gray-300">
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> <strong>כולל הכול מהבסיסית</strong></li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> תבניות ללא הגבלה</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> יצירת קבוצות תבניות</li>
                    </ul>
                    <Button variant="primary" className="w-full" onClick={onStart}>התחל עכשיו</Button>
                </Card>

                {/* Team */}
                <Card className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-white mb-2">תוכנית צוות — Team</h3>
                    <div className="text-4xl font-bold text-gray-200 mb-6">₪79<span className="text-lg font-normal text-gray-500"> / לחודש</span></div>
                    <ul className="space-y-4 mb-8 flex-1 w-full text-right text-sm text-gray-300">
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> <strong>כולל הכול מ-Pro</strong></li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> בנק תבניות מוכן מראש</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> שיתוף תבניות בצוות</li>
                    </ul>
                    <Button variant="secondary" className="w-full" onClick={()=>{}}>צור קשר</Button>
                </Card>
            </div>
        </div>
    </section>
);

// ... CategoriesPage, SubcategoriesPage, BuilderPage, etc. (Full implementation) ...

const CategoriesPage = ({ data, setData, onSelect, showToast }) => {
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  
  const addCat = async () => {
    const newCat = { 
      id: `cat-${Date.now()}`, 
      title: 'קטגוריה חדשה', 
      description: 'תיאור קצר', 
      subcategories: [],
      display_order: data.length
    };
    try {
      await supabaseService.createCategory(newCat);
      setData(prev => [...prev, newCat]);
      setEditId(newCat.id);
      setEditVal(newCat.title);
      showToast('קטגוריה נוספה בהצלחה');
    } catch (error) {
      showToast('שגיאה בהוספת קטגוריה');
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await supabaseService.deleteCategory(deleteId);
      setData(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
      showToast('הקטגוריה נמחקה בהצלחה');
    } catch (error) {
      showToast('שגיאה במחיקת קטגוריה');
    }
  };
  
  const saveEdit = async () => {
    if (editId) {
      try {
        await supabaseService.updateCategory(editId, { title: editVal });
        setData(prev => prev.map(c => c.id === editId ? { ...c, title: editVal } : c));
        setEditId(null);
      } catch (error) {
        showToast('שגיאה בעדכון קטגוריה');
      }
    }
  };
  
  const moveCat = async (e, index, direction) => {
    e.stopPropagation();
    e.preventDefault();
    const newData = [...data];
    if (direction === 'up' && index > 0) {
      [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
    } else if (direction === 'down' && index < newData.length - 1) {
      [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    } else {
      return;
    }
    try {
      await supabaseService.reorderCategories(newData);
      setData(newData);
    } catch (error) {
      showToast('שגיאה בסידור מחדש');
    }
  };
  return (
    <div><ConfirmModal isOpen={!!deleteId} title="מחיקת קטגוריה" message="האם אתה בטוח?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteId(null)} /><div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white tracking-tight">קטגוריות</h1><Button onClick={addCat} icon={Plus}>הוסף חדש</Button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{data.map((cat, index) => (<Card key={cat.id} onClick={() => onSelect(cat.id)} className="p-6 h-56 flex flex-col justify-between group relative overflow-hidden"><div className="absolute top-0 right-0 p-20 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all"></div><div className="absolute top-4 left-4 flex gap-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><div className="flex bg-[#0B0F17] border border-white/10 rounded-lg overflow-hidden mr-2"><button type="button" onClick={(e) => moveCat(e, index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-white/10 text-gray-400 disabled:opacity-30 border-l border-white/10"><ArrowUp size={14}/></button><button type="button" onClick={(e) => moveCat(e, index, 'down')} disabled={index === data.length - 1} className="p-1.5 hover:bg-white/10 text-gray-400 disabled:opacity-30"><ArrowDown size={14}/></button></div><button type="button" onClick={(e) => { e.stopPropagation(); setEditId(cat.id); setEditVal(cat.title); }} className="p-2 bg-[#0B0F17] border border-white/10 rounded-lg hover:text-blue-400 text-gray-400 transition-colors"><Edit2 size={16}/></button><button type="button" onClick={(e) => { e.stopPropagation(); setDeleteId(cat.id); }} className="p-2 bg-[#0B0F17] border border-white/10 rounded-lg text-red-400 hover:text-red-500 hover:border-red-500/30 transition-colors"><Trash2 size={16}/></button></div><div className="relative z-10"><div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><Folder size={24} /></div>{editId === cat.id ? <input autoFocus className="w-full text-xl font-bold bg-[#0B0F17] border border-blue-500 rounded px-2 py-1 text-white outline-none" value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={saveEdit} onKeyDown={e => e.key === 'Enter' && saveEdit()} onClick={e=>e.stopPropagation()} /> : <h2 className="text-xl font-bold text-white truncate">{cat.title}</h2>}<p className="text-gray-500 text-sm mt-2">{cat.subcategories.length} תתי נושאים</p></div><div className="flex justify-end relative z-10"><div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-600 group-hover:text-white transition-colors"><ArrowLeft size={16} /></div></div></Card>))}</div></div>
  );
};

const SubcategoriesPage = ({ category, setData, onSelect, showToast }) => {
    const [editId, setEditId] = useState(null);
    const [editVal, setEditVal] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const addSub = async () => {
      const newSub = { 
        id: `sub-${Date.now()}`, 
        title: 'נושא חדש', 
        sections: [],
        display_order: category.subcategories.length
      };
      try {
        await supabaseService.createSubcategory(category.id, newSub);
        setData(prev => prev.map(c => c.id === category.id ? { ...c, subcategories: [...c.subcategories, newSub] } : c));
        setEditId(newSub.id);
        setEditVal(newSub.title);
        showToast('תת-קטגוריה נוספה בהצלחה');
      } catch (error) {
        showToast('שגיאה בהוספת תת-קטגוריה');
      }
    };
    
    const handleDeleteConfirm = async () => {
      try {
        await supabaseService.deleteSubcategory(deleteId);
        setData(prev => prev.map(c => c.id === category.id ? { ...c, subcategories: c.subcategories.filter(s => s.id !== deleteId) } : c));
        setDeleteId(null);
        showToast('התת-קטגוריה נמחקה');
      } catch (error) {
        showToast('שגיאה במחיקת תת-קטגוריה');
      }
    };
    
    const saveEdit = async () => {
      if (editId) {
        try {
          await supabaseService.updateSubcategory(editId, { title: editVal });
          setData(prev => prev.map(c => c.id === category.id ? { ...c, subcategories: c.subcategories.map(s => s.id === editId ? { ...s, title: editVal } : s) } : c));
          setEditId(null);
        } catch (error) {
          showToast('שגיאה בעדכון תת-קטגוריה');
        }
      }
    };
    
    const moveSub = async (e, index, direction) => {
      e.stopPropagation();
      e.preventDefault();
      const newSubs = [...category.subcategories];
      if (direction === 'up' && index > 0) {
        [newSubs[index], newSubs[index - 1]] = [newSubs[index - 1], newSubs[index]];
      } else if (direction === 'down' && index < newSubs.length - 1) {
        [newSubs[index], newSubs[index + 1]] = [newSubs[index + 1], newSubs[index]];
      } else {
        return;
      }
      try {
        await supabaseService.reorderSubcategories(newSubs);
        setData(prev => prev.map(c => c.id === category.id ? { ...c, subcategories: newSubs } : c));
      } catch (error) {
        showToast('שגיאה בסידור מחדש');
      }
    };
    return (
        <div><ConfirmModal isOpen={!!deleteId} title="מחיקה" message="למחוק את התת-קטגוריה?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteId(null)} /><div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white tracking-tight">תת קטגוריות</h1><Button onClick={addSub} icon={Plus}>הוסף תת קטגוריה</Button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{category.subcategories.map((sub, index) => (<Card key={sub.id} onClick={() => onSelect(sub.id)} className="p-5 flex items-center justify-between group relative"><div className="flex items-center gap-4 overflow-hidden"><div className="bg-white/5 border border-white/10 p-3 rounded-lg text-blue-400"><FolderOpen size={20}/></div><div className="min-w-0">{editId === sub.id ? <input autoFocus className="w-full font-bold bg-[#0B0F17] border border-blue-500 rounded px-1 text-white outline-none" value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={saveEdit} onKeyDown={e => e.key === 'Enter' && saveEdit()} onClick={e=>e.stopPropagation()} /> : <h3 className="font-bold text-lg text-gray-200 truncate">{sub.title}</h3>}<span className="text-xs text-gray-500">{(sub.sections || []).length} קבוצות</span></div></div><div className="flex items-center gap-2 z-20 relative"><div className="flex bg-[#0B0F17] border border-white/10 rounded-md overflow-hidden mr-2"><button type="button" onClick={(e) => moveSub(e, index, 'up')} disabled={index === 0} className="p-1 hover:bg-white/10 text-gray-400 disabled:opacity-30 border-l border-white/10"><ArrowUp size={12}/></button><button type="button" onClick={(e) => moveSub(e, index, 'down')} disabled={index === category.subcategories.length - 1} className="p-1 hover:bg-white/10 text-gray-400 disabled:opacity-30"><ArrowDown size={12}/></button></div><button type="button" onClick={(e) => { e.stopPropagation(); setEditId(sub.id); setEditVal(sub.title); }} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-blue-400 transition-colors"><Edit2 size={16}/></button><button type="button" onClick={(e) => { e.stopPropagation(); setDeleteId(sub.id); }} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16}/></button><ArrowLeft size={16} className="text-blue-500 ml-2" /></div></Card>))}</div></div>
    );
};

const BuilderPage = ({ category, subcategory, setData, showToast }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSentences, setSelectedSentences] = useState(new Set());
  const [userValues, setUserValues] = useState({});
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [deleteSectionId, setDeleteSectionId] = useState(null);
  const [editingPart, setEditingPart] = useState(null);
  const updateGlobalData = (updatedSubcategory) => { setData(prev => prev.map(c => c.id === category.id ? { ...c, subcategories: c.subcategories.map(s => s.id === subcategory.id ? updatedSubcategory : s) } : c)); };
  
  const addSection = async () => {
    const newSec = { 
      id: `sec-${Date.now()}`, 
      title: 'קבוצה חדשה', 
      sentences: [],
      display_order: (subcategory.sections || []).length
    };
    try {
      await supabaseService.createSection(subcategory.id, newSec);
      const updatedSub = { ...subcategory, sections: [...(subcategory.sections || []), newSec] };
      updateGlobalData(updatedSub);
      setEditingSectionId(newSec.id);
      setEditingSectionTitle(newSec.title);
      showToast('קבוצה נוספה בהצלחה');
    } catch (error) {
      showToast('שגיאה בהוספת קבוצה');
    }
  };
  
  const handleDeleteSectionConfirm = async () => {
    try {
      await supabaseService.deleteSection(deleteSectionId);
      const updatedSub = { ...subcategory, sections: subcategory.sections.filter(s => s.id !== deleteSectionId) };
      updateGlobalData(updatedSub);
      setDeleteSectionId(null);
      showToast('הקבוצה נמחקה');
    } catch (error) {
      showToast('שגיאה במחיקת קבוצה');
    }
  };
  
  const updateSectionTitle = async (secId, title) => {
    try {
      await supabaseService.updateSection(secId, { title });
      const updatedSub = { ...subcategory, sections: subcategory.sections.map(s => s.id === secId ? { ...s, title } : s) };
      updateGlobalData(updatedSub);
    } catch (error) {
      showToast('שגיאה בעדכון קבוצה');
    }
  };
  
  const updateSentencesInSection = async (secId, newSentences) => {
    try {
      // Update all sentences in the section
      for (let i = 0; i < newSentences.length; i++) {
        const sen = newSentences[i];
        await supabaseService.updateSentence(sen.id, { ...sen, display_order: i });
      }
      const updatedSub = { ...subcategory, sections: subcategory.sections.map(s => s.id === secId ? { ...s, sentences: newSentences } : s) };
      updateGlobalData(updatedSub);
    } catch (error) {
      showToast('שגיאה בעדכון משפטים');
    }
  };
  
  const handleUpdatePart = async (updatedPart) => {
    if (!editingPart) return;
    const { secId, senId, partIndex } = editingPart;
    const section = subcategory.sections.find(s => s.id === secId);
    const sentence = section.sentences.find(s => s.id === senId);
    const newParts = [...sentence.parts];
    newParts[partIndex] = updatedPart;
    const newSentences = section.sentences.map(s => s.id === senId ? { ...s, parts: newParts } : s);
    await updateSentencesInSection(secId, newSentences);
    setEditingPart(null);
  };
  
  const moveSentence = async (secId, senId, direction) => {
    const section = subcategory.sections.find(s => s.id === secId);
    if (!section) return;
    const sentences = [...section.sentences];
    const index = sentences.findIndex(s => s.id === senId);
    if (index === -1) return;
    if (direction === 'up' && index > 0) {
      [sentences[index], sentences[index - 1]] = [sentences[index - 1], sentences[index]];
    } else if (direction === 'down' && index < sentences.length - 1) {
      [sentences[index], sentences[index + 1]] = [sentences[index + 1], sentences[index]];
    } else return;
    try {
      await supabaseService.reorderSentences(secId, sentences);
      updateSentencesInSection(secId, sentences);
    } catch (error) {
      showToast('שגיאה בסידור מחדש');
    }
  };
  const handleCopy = (text) => { navigator.clipboard.writeText(text); showToast('הטקסט הועתק ללוח!'); };
  return (
    <div className="flex flex-col h-full">
        <ConfirmModal isOpen={!!deleteSectionId} title="מחיקת קבוצה" message="האם למחוק את הקבוצה?" onConfirm={handleDeleteSectionConfirm} onCancel={() => setDeleteSectionId(null)} />
        {editingPart && <PartConfigModal isOpen={!!editingPart} part={editingPart.partData} onSave={handleUpdatePart} onCancel={() => setEditingPart(null)} />}
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white tracking-tight">{subcategory.title}</h1><Button size="sm" variant={isEditMode ? "primary" : "secondary"} onClick={() => setIsEditMode(!isEditMode)}>{isEditMode ? <Check size={16}/> : <Settings size={16}/>}<span className="mr-1 hidden sm:inline">{isEditMode ? 'סיום עריכה' : 'מצב עריכה'}</span></Button></div>
        <div className="flex flex-col lg:flex-row gap-6 relative flex-1">
            <div className="flex-1 bg-[#121620] rounded-2xl border border-white/10 flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
                {isEditMode && (<div className="p-3 bg-blue-900/20 border-b border-white/10 flex justify-between items-center"><span className="text-sm font-bold text-blue-400">מבנה הדף</span><Button size="sm" icon={Plus} onClick={addSection}>הוסף קבוצה</Button></div>)}
                <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {(subcategory.sections || []).length === 0 && <div className="text-center py-10 text-gray-500"><p>אין קבוצות. {isEditMode ? 'הוסף קבוצה חדשה.' : ''}</p></div>}
                    {(subcategory.sections || []).map(section => (
                        <div key={section.id} className="border border-white/5 bg-white/5 rounded-xl overflow-hidden">
                            <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
                                {isEditMode && editingSectionId === section.id ? (<input autoFocus className="font-bold text-white bg-[#0B0F17] border border-blue-500 rounded px-2 py-1 outline-none text-sm w-full max-w-[200px]" value={editingSectionTitle} onChange={(e) => setEditingSectionTitle(e.target.value)} onBlur={() => { updateSectionTitle(section.id, editingSectionTitle); setEditingSectionId(null); }} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />) : (<h3 className="font-bold text-gray-300 flex items-center text-sm">{section.title}{isEditMode && <button onClick={() => { setEditingSectionId(section.id); setEditingSectionTitle(section.title); }} className="mr-2 text-gray-500 hover:text-blue-400"><Edit2 size={12} /></button>}</h3>)}
                                {isEditMode && <button onClick={() => setDeleteSectionId(section.id)} className="text-red-400/70 hover:text-red-400 p-1"><Trash2 size={14} /></button>}
                            </div>
                            <div className="p-3 space-y-2">
                                {section.sentences.map((sen, index) => (
                                    <SentenceRow key={sen.id} sentence={sen} index={index} totalCount={section.sentences.length} isEditMode={isEditMode} isSelected={selectedSentences.has(sen.id)} onToggle={() => { const next = new Set(selectedSentences); next.has(sen.id) ? next.delete(sen.id) : next.add(sen.id); setSelectedSentences(next); }} userValues={userValues} onValueChange={(k, v) => setUserValues(prev => ({ ...prev, [k]: v }))} onUpdateParts={async (parts) => { 
                                      const updatedSentence = { ...sen, parts };
                                      try {
                                        await supabaseService.updateSentence(sen.id, updatedSentence);
                                        const newSens = section.sentences.map(s => s.id === sen.id ? updatedSentence : s);
                                        await updateSentencesInSection(section.id, newSens);
                                      } catch (error) {
                                        showToast('שגיאה בעדכון משפט');
                                      }
                                    }} onDelete={async () => { 
                                      try {
                                        await supabaseService.deleteSentence(sen.id);
                                        const newSens = section.sentences.filter(s => s.id !== sen.id);
                                        await updateSentencesInSection(section.id, newSens);
                                        const next = new Set(selectedSentences);
                                        next.delete(sen.id);
                                        setSelectedSentences(next);
                                      } catch (error) {
                                        showToast('שגיאה במחיקת משפט');
                                      }
                                    }} onMove={(dir) => moveSentence(section.id, sen.id, dir)} onEditPart={(partIndex, partData) => setEditingPart({ secId: section.id, senId: sen.id, partIndex, partData })} />
                                ))}
                                {isEditMode && <Button variant="secondary" size="sm" className="w-full mt-2 border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40" onClick={async () => {
                                  const newSentence = { id: `sen-${Date.now()}`, parts: [{ type: 'text', value: '' }], display_order: section.sentences.length };
                                  try {
                                    await supabaseService.createSentence(section.id, newSentence);
                                    await updateSentencesInSection(section.id, [...section.sentences, newSentence]);
                                  } catch (error) {
                                    showToast('שגיאה בהוספת משפט');
                                  }
                                }}><Plus size={14} /> הוסף משפט</Button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!isEditMode && selectedSentences.size > 0 && <div className="lg:hidden fixed bottom-6 left-6 z-30"><button onClick={() => setShowMobilePreview(true)} className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] flex items-center justify-center animate-pulse"><Eye size={24} /><span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">{selectedSentences.size}</span></button></div>}
            <div className={`lg:w-1/3 bg-[#121620] border border-white/10 rounded-2xl lg:static flex flex-col fixed inset-x-0 bottom-0 z-50 shadow-2xl transition-transform duration-300 ${showMobilePreview ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} h-[80vh] lg:h-auto`}>
                <div className="p-4 bg-white/5 border-b border-white/10 rounded-t-2xl flex justify-between items-center shrink-0"><h3 className="font-bold text-gray-200 flex items-center gap-2"><FileText size={18} className="text-blue-400"/> תצוגה מקדימה</h3><button onClick={() => setShowMobilePreview(false)} className="lg:hidden p-2 text-gray-400 rounded-full hover:bg-white/10"><X size={18}/></button></div>
                <PreviewContent subcategory={subcategory} selectedIds={selectedSentences} userValues={userValues} onCopy={(text) => { handleCopy(text); setShowMobilePreview(false); }} />
            </div>
            {showMobilePreview && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowMobilePreview(false)}></div>}
        </div>
    </div>
  );
};

// --- Sentence Row (Dark Mode) --- //
const SentenceRow = ({ sentence, index, totalCount, isEditMode, isSelected, onToggle, userValues, onValueChange, onUpdateParts, onDelete, onMove, onEditPart }) => {
    const itemBaseClass = "flex items-center h-10 px-3 rounded border transition-all text-sm";
    const editItemClass = `${itemBaseClass} bg-white/5 border-white/10 hover:border-blue-500/50 relative group/item`;
    const viewInputClass = `${itemBaseClass} bg-[#0B0F17] border-white/20 focus-within:border-blue-500 focus-within:bg-blue-900/10`;

    if (isEditMode) {
        return (
            <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/10 space-y-3 group hover:border-blue-500/30 transition-colors">
                <div className="flex flex-wrap gap-2 items-center">
                    {sentence.parts.map((p, i) => (
                        <div key={i} className={editItemClass}>
                            {p.type === 'text' ? (
                                <input className="bg-transparent border-none outline-none text-gray-300 placeholder-gray-600 w-full min-w-[60px]" value={p.value} onChange={e=>{const n=[...sentence.parts];n[i].value=e.target.value;onUpdateParts(n)}} placeholder="טקסט" />
                            ) : (
                                <div className="flex items-center gap-2 cursor-pointer w-full" onClick={() => onEditPart(i, p)}>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.5 rounded">{p.type === 'input' ? 'שדה' : 'בחירה'}</span>
                                    <span className="text-gray-200 truncate max-w-[100px]">{p.label || 'ללא תווית'}</span>
                                    <Settings size={12} className="text-gray-500 ml-auto group-hover/item:text-blue-400"/>
                                </div>
                            )}
                            <button onClick={()=>onUpdateParts(sentence.parts.filter((_,idx)=>idx!==i))} className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg scale-75 hover:scale-100"><X size={12}/></button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden h-8">
                             <button type="button" onClick={() => onMove('up')} disabled={index === 0} className="px-2 hover:bg-white/10 text-gray-400 disabled:opacity-30 border-l border-white/10 flex items-center h-full"><ArrowUp size={14}/></button>
                             <button type="button" onClick={() => onMove('down')} disabled={index === totalCount - 1} className="px-2 hover:bg-white/10 text-gray-400 disabled:opacity-30 flex items-center h-full"><ArrowDown size={14}/></button>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 h-8">
                            <button type="button" className="px-3 text-xs text-gray-300 hover:bg-white/10 rounded h-full flex items-center transition-colors" onClick={()=>onUpdateParts([...sentence.parts, {type:'text', value:''}])}>+ טקסט</button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <button type="button" className="px-3 text-xs text-blue-300 hover:bg-blue-500/20 rounded h-full flex items-center transition-colors" onClick={()=>onUpdateParts([...sentence.parts, {type:'input', label:'שדה', value:'', width: 'w-24'}])}>+ שדה</button>
                            <button type="button" className="px-3 text-xs text-purple-300 hover:bg-purple-500/20 rounded h-full flex items-center transition-colors" onClick={()=>onUpdateParts([...sentence.parts, {type:'select', label:'רשימה', value:'אופציה 1,אופציה 2'}])}>+ רשימה</button>
                        </div>
                    </div>
                    <button type="button" onClick={onDelete} className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>
            </div>
        );
    }

    return (
        <div onClick={onToggle} className={`flex items-start p-3 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'bg-blue-600/10 border-blue-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
            <div className="pt-2 pl-3"><div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>{isSelected && <Check size={12} className="text-white" />}</div></div>
            <div className="flex-1 flex flex-wrap items-center gap-2 leading-8 text-gray-300 text-base py-1">
                {sentence.parts.map((p, i) => {
                    const key = `${sentence.id}-${i}`;
                    if (p.type === 'text') return <span key={i} className="whitespace-pre-wrap py-1">{p.value}</span>;
                    if (p.type === 'input') return (
                        <div key={i} className={`${viewInputClass} ${p.width || 'w-24'} p-0`} onClick={(e) => e.stopPropagation()}>
                            <input placeholder={p.label} value={userValues[key] || ''} onChange={(e) => onValueChange(key, e.target.value)} className="bg-transparent border-none outline-none text-white w-full h-full px-3 placeholder-white/30 font-medium" />
                        </div>
                    );
                    if (p.type === 'select') {
                        const options = p.value ? p.value.split(',').map(s => s.trim()) : [];
                        return (
                            <div key={i} className={`${viewInputClass} min-w-[120px] p-0 relative`} onClick={(e) => e.stopPropagation()}>
                                 <select value={userValues[key] || ''} onChange={(e) => onValueChange(key, e.target.value)} className="appearance-none bg-transparent border-none outline-none text-white w-full h-full px-3 cursor-pointer"><option value="" disabled className="bg-[#1A1F2E] text-gray-500">{p.label || 'בחר'}</option>{options.map((o, idx) => <option key={idx} value={o} className="bg-[#1A1F2E] text-white">{o}</option>)}</select>
                                 <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

const PreviewContent = ({ subcategory, selectedIds, userValues, onCopy }) => {
    const [copied, setCopied] = useState(false);
    
    // Generate text for clipboard (with group titles)
    const generateTextForCopy = () => {
        let text = "";
        (subcategory.sections || []).forEach(section => {
            const active = section.sentences.filter(s => selectedIds.has(s.id));
            if (active.length) {
                // Add group title
                text += section.title + "\n";
                // Add selected sentences from this group
                active.forEach(sen => {
                    let line = "• ";
                    sen.parts.forEach((p, i) => {
                        if (p.type === 'text') line += p.value;
                        else {
                            const val = userValues[`${sen.id}-${i}`];
                            line += val ? val : `[${p.label}]`;
                        }
                    });
                    text += line + "\n";
                });
                text += "\n"; // Add spacing between groups
            }
        });
        return text.trim();
    };
    
    // Render preview content with styled group titles
    const renderPreviewContent = () => {
        const sectionsWithSelected = (subcategory.sections || []).filter(section => {
            return section.sentences.some(s => selectedIds.has(s.id));
        });
        
        if (sectionsWithSelected.length === 0) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                    <FileText size={64} className="mb-4 text-white/10"/>
                    <p>בחר משפטים להצגה</p>
                </div>
            );
        }
        
        return (
            <div className="space-y-6">
                {sectionsWithSelected.map((section) => {
                    const active = section.sentences.filter(s => selectedIds.has(s.id));
                    if (active.length === 0) return null;
                    
                    return (
                        <div key={section.id} className="space-y-2">
                            {/* Group title */}
                            <h4 className="text-lg font-bold text-white mb-3 pb-2 border-b border-white/10">
                                {section.title}
                            </h4>
                            {/* Selected sentences from this group */}
                            {active.map((sen) => {
                                let line = "• ";
                                sen.parts.forEach((p, i) => {
                                    if (p.type === 'text') line += p.value;
                                    else {
                                        const val = userValues[`${sen.id}-${i}`];
                                        line += val ? val : `[${p.label}]`;
                                    }
                                });
                                return (
                                    <p key={sen.id} className="text-gray-300 leading-relaxed">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };
    
    const handleCopy = () => {
        onCopy(generateTextForCopy());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const hasContent = selectedIds.size > 0;
    
    return (
        <>
            <div className="flex-1 overflow-y-auto p-6 text-gray-300 font-sans text-base leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {hasContent ? renderPreviewContent() : (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                        <FileText size={64} className="mb-4 text-white/10"/>
                        <p>בחר משפטים להצגה</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                <Button variant="primary" size="xl" onClick={handleCopy} disabled={!hasContent} className={`w-full ${copied ? 'from-green-600 to-emerald-600 shadow-green-500/20' : ''}`}>
                    {copied ? 'הועתק בהצלחה!' : 'העתק הכל ללוח'}
                </Button>
            </div>
        </>
    );
};

const Breadcrumbs = ({ view, subcategory, onHome, onCategories, onSubcategories }) => (
    <nav className="mb-6 flex items-center text-sm text-gray-400 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar"><span onClick={onHome} className="cursor-pointer hover:text-white transition-colors">בית</span><span className="mx-2 text-white/20">/</span><span onClick={onCategories} className={`cursor-pointer hover:text-white transition-colors ${view === 'categories' ? 'font-bold text-white' : ''}`}>תבניות</span>{(view === 'subcategories' || view === 'builder') && <><span className="mx-2 text-white/20">/</span><span onClick={view === 'builder' ? onSubcategories : undefined} className={`cursor-pointer hover:text-white transition-colors ${view === 'subcategories' ? 'font-bold text-white' : ''}`}>תת קטגוריות</span></>}{view === 'builder' && subcategory && <><span className="mx-2 text-white/20">/</span><span className="font-bold text-blue-400">{subcategory.title}</span></>}</nav>
);

const AboutPage = () => <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-bold text-white mb-8">אודות</h1><div className="bg-[#121620] p-8 rounded-2xl border border-white/10"><p className="text-xl text-gray-400">DocsGenius נולדה כדי לחסוך זמן ולמנוע טעויות.</p></div></div>;
const PricingPage = ({ onStart }) => <div className="max-w-7xl mx-auto px-4 py-16"><div className="text-center mb-16"><h1 className="text-4xl font-bold text-white mb-4">מחירים</h1></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Card className="p-8 flex flex-col"><h3 className="text-xl font-bold text-white mb-2">חינם</h3><div className="text-4xl font-bold text-gray-200 mb-6">₪0</div><Button variant="secondary" onClick={onStart}>התחל</Button></Card><Card className="p-8 flex flex-col border-blue-500/50 bg-blue-900/10"><h3 className="text-xl font-bold text-white mb-2">פרו</h3><div className="text-4xl font-bold text-blue-400 mb-6">₪49</div><Button variant="primary" onClick={onStart}>שדרג</Button></Card><Card className="p-8 flex flex-col"><h3 className="text-xl font-bold text-white mb-2">ארגון</h3><div className="text-4xl font-bold text-gray-200 mb-6">מותאם</div><Button variant="secondary">צור קשר</Button></Card></div></div>;
const ContactPage = ({ showToast }) => <div className="max-w-2xl mx-auto px-4 py-16"><h1 className="text-3xl font-bold text-white mb-8 text-center">צור קשר</h1><Card className="p-8"><form className="space-y-6" onSubmit={(e)=>{e.preventDefault();showToast('נשלח!')}}><input className="w-full bg-[#0B0F17] border border-white/10 rounded p-3 text-white" placeholder="שם מלא" required /><input className="w-full bg-[#0B0F17] border border-white/10 rounded p-3 text-white" placeholder="אימייל" type="email" required /><textarea className="w-full bg-[#0B0F17] border border-white/10 rounded p-3 text-white" placeholder="הודעה" rows="4" required></textarea><Button type="submit" size="lg" className="w-full">שלח</Button></form></Card></div>;
const TermsPage = () => <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-300"><h1 className="text-3xl font-bold text-white mb-6">תנאי שימוש</h1><p>השימוש באתר כפוף לתקנון.</p></div>;
const PrivacyPage = () => <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-300"><h1 className="text-3xl font-bold text-white mb-6">פרטיות</h1><p>המידע נשמר מקומית בדפדפן.</p></div>;
const AccessibilityPage = () => <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-300"><h1 className="text-3xl font-bold text-white mb-6">נגישות</h1><p>האתר מותאם לתקני נגישות AA.</p></div>;