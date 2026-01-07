import { useState, useEffect } from 'react'
import { concepts } from './data'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from './components/ProgressBar'
import ConceptCard from './components/ConceptCard'
import Quiz from './components/Quiz'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import VideoAnalysis from './components/VideoAnalysis'
import UserProfile from './components/UserProfile'
import AccessibilityToolbar from './components/AccessibilityToolbar'
import ReadingRuler from './components/ReadingRuler'
import MindMap from './components/MindMap'
import { ChevronRight, ChevronLeft, Award, RotateCcw, Home, ArrowLeft } from 'lucide-react'

function App() {
  const [screen, setScreen] = useState('login');
  const [videoUrl, setVideoUrl] = useState('');

  // Lesson State
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  // 'standard', 'remedial', 'advanced'
  const [level, setLevel] = useState('standard');

  const [quizState, setQuizState] = useState('pending'); // 'pending', 'answered'
  const [canProceed, setCanProceed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Accessibility State
  const [accessSettings, setAccessSettings] = useState({
    font: 'lexend',
    theme: 'default',
    readingRuler: false,
    adhdMode: false,
    bionicMode: false,
    fontSize: 1,
    lineHeight: 1.8,
    colorBlindness: 'none'
  });

  // Initialize Skill Tree on first load
  useEffect(() => {
    if (!localStorage.getItem('aacl_skill_tree')) {
      const initialSkills = [
        { id: 'motion', label: 'Motion Basics', level: 0, unlocked: true },
        { id: 'velocity', label: 'Velocity', level: 0, unlocked: false },
        { id: 'acceleration', label: 'Acceleration', level: 0, unlocked: false },
        { id: 'equations', label: 'Equations', level: 0, unlocked: false },
        { id: 'freefall', label: 'Free Fall', level: 0, unlocked: false },
      ];
      localStorage.setItem('aacl_skill_tree', JSON.stringify(initialSkills));
    }
  }, []);

  // Apply visual settings
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (accessSettings.font === 'opendyslexic') {
      body.style.fontFamily = 'OpenDyslexic, sans-serif';
    } else {
      body.style.fontFamily = 'Lexend, sans-serif';
    }
    body.style.lineHeight = accessSettings.lineHeight;
    html.style.fontSize = `${accessSettings.fontSize * 16}px`;

    body.className = '';
    if (accessSettings.theme === 'dark') {
      body.classList.add('dark-mode');
      body.style.backgroundColor = '#111827';
      body.style.color = '#F3F4F6';
    } else if (accessSettings.theme === 'high-contrast') {
      body.classList.add('high-contrast');
      body.style.backgroundColor = '#000000';
      body.style.color = '#FFFF00';
    } else {
      body.style.backgroundColor = '#FAF9F6';
      body.style.color = '#1F2937';
    }

    html.style.filter = 'none';
    if (accessSettings.colorBlindness === 'achromatopsia') {
      html.style.filter = 'grayscale(100%)';
    }
  }, [accessSettings]);


  const updateSettings = (newSettings) => {
    setAccessSettings(prev => ({ ...prev, ...newSettings }));
  };

  // --- Adaptive Logic ---
  const concept = concepts[currentStep];

  const handleAnswer = (isCorrect) => {
    setQuizState('answered');

    if (level === 'standard') {
      if (isCorrect) {
        setScore(s => s + 10);

        // Update Skill Tree to Level 1
        const saved = localStorage.getItem('aacl_skill_tree');
        if (saved) {
          let skills = JSON.parse(saved);
          skills = skills.map(s => s.id === concept.id ? { ...s, level: 1, unlocked: true } : s);
          localStorage.setItem('aacl_skill_tree', JSON.stringify(skills));
        }

        setTimeout(() => {
          setLevel('advanced');
          setQuizState('pending');
        }, 1200);
      } else {
        setScore(s => Math.max(0, s - 2));
        // Drop to Remedial
        setTimeout(() => {
          setLevel('remedial');
          setQuizState('pending');
        }, 1500);
      }
    }
    else if (level === 'advanced') {
      if (isCorrect) {
        setScore(s => s + 20);
        // Update Skill Tree Stats if passed Mastery Check
        const saved = localStorage.getItem('aacl_skill_tree');
        if (saved) {
          let skills = JSON.parse(saved);
          // 1. Mark current concept as Mastered (Level 3)
          skills = skills.map(s => s.id === concept.id ? { ...s, level: 3, unlocked: true } : s);

          // 2. Unlock Next Concept
          const currentIndex = concepts.findIndex(c => c.id === concept.id);
          if (currentIndex !== -1 && currentIndex < concepts.length - 1) {
            const nextId = concepts[currentIndex + 1].id;
            skills = skills.map(s => s.id === nextId ? { ...s, unlocked: true } : s);
          }

          localStorage.setItem('aacl_skill_tree', JSON.stringify(skills));
        }
      }
      setCanProceed(true);
    }
    else if (level === 'remedial') {
      if (isCorrect) {
        setScore(s => s + 5);
        // Update Skill Tree to Level 1
        const saved = localStorage.getItem('aacl_skill_tree');
        if (saved) {
          let skills = JSON.parse(saved);
          skills = skills.map(s => s.id === concept.id ? { ...s, level: 1, unlocked: true } : s);
          localStorage.setItem('aacl_skill_tree', JSON.stringify(skills));
        }
      }
      setCanProceed(true);
    }
  };

  const nextStep = () => {
    if (currentStep < concepts.length - 1) {
      setCurrentStep(c => c + 1);
      setLevel('standard'); // Reset level for new concept
      setQuizState('pending');
      setCanProceed(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
      setLevel('standard');
      setQuizState('pending');
      setCanProceed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setScore(0);
    setLevel('standard');
    setQuizState('pending');
    setCanProceed(false);
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const Tools = () => (
    <>
      <AccessibilityToolbar settings={accessSettings} updateSettings={updateSettings} />
      <ReadingRuler enabled={accessSettings.readingRuler} mode={accessSettings.adhdMode ? 'focus' : 'ruler'} />
    </>
  );

  // Screen Rendering
  if (screen === 'login') return <><Login onLogin={() => setScreen('dashboard')} /><Tools /></>;
  if (screen === 'dashboard') return <><Dashboard onStartLesson={() => setScreen('lesson')} onStartVideo={(url) => { setVideoUrl(url); setScreen('video'); }} onOpenProfile={() => setScreen('profile')} onStartMindMap={() => setScreen('mindmap')} /><Tools /></>;
  if (screen === 'profile') return <><UserProfile onBack={() => setScreen('dashboard')} /><Tools /></>;
  if (screen === 'video') return <><VideoAnalysis videoUrl={videoUrl} onBack={() => setScreen('dashboard')} bionicMode={accessSettings.bionicMode} /><Tools /></>;
  if (screen === 'mindmap') return <><MindMap onBack={() => setScreen('dashboard')} /><Tools /></>;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 max-w-lg w-full text-center shadow-2xl border border-white/40"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200">
            <Award size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lesson Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">You showed great persistence and curiosity today.</p>

          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Total Mastery Score</p>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{score}</p>
          </div>

          <div className="space-y-3">
            <button onClick={restart} className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
              <RotateCcw size={20} /> Restart Lesson
            </button>
            <button onClick={() => setScreen('dashboard')} className="w-full py-4 rounded-xl bg-white text-gray-700 font-bold text-lg hover:bg-gray-50 border border-gray-200 transition-colors flex items-center justify-center gap-2">
              <Home size={20} /> Back to Dashboard
            </button>
          </div>
        </motion.div>
        <Tools />
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 selection:bg-indigo-100 overflow-x-hidden ${accessSettings.theme === 'high-contrast' ? 'high-contrast-mode' : ''}`}>
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-mesh opacity-30"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-mesh animation-delay-2000 opacity-30"></div>
        <div className="absolute bottom-0 left-20 w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-mesh animation-delay-4000 opacity-30"></div>
      </div>

      <Tools />

      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setScreen('dashboard')} className="p-3 bg-white hover:bg-gray-50 rounded-2xl shadow-sm transition-all border border-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
            Ph
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Physics 11</h1>
            <div className="flex items-center gap-2 text-sm md:text-base opacity-70 font-medium text-gray-500">
              <span>Motion in a Straight Line</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50 flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full animate-pulse ${level === 'advanced' ? 'bg-yellow-400' : level === 'remedial' ? 'bg-emerald-400' : 'bg-primary'}`}></span>
            <span className="text-sm font-bold text-gray-700">
              {level === 'advanced' ? 'Mastery Mode' : level === 'remedial' ? 'Guided Mode' : 'Standard Mode'}
            </span>
          </div>
        </div>
      </header>

      <ProgressBar score={score} />

      <main className="max-w-4xl mx-auto relative z-10 perspective-1000">
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${currentStep}-${level}`}
            initial={{ opacity: 0, x: 20, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -20, rotateY: 5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ConceptCard concept={concept} level={level} bionicMode={accessSettings.bionicMode} />
            <Quiz concept={concept} level={level} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto mt-16 flex justify-between items-center pb-20 pt-8 border-t border-gray-200/50 relative z-10">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} /> Previous
        </button>

        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1
               ${canProceed
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600'
              : 'bg-gray-300 cursor-not-allowed shadow-none hover:translate-y-0'}
            `}
        >
          {currentStep === concepts.length - 1 ? "Finish Lesson" : "Next Concept"} <ChevronRight size={20} />
        </button>
      </footer>
    </div>
  )
}

export default App
