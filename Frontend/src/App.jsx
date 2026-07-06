import React from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import Header from './components/Header';
import Hub from './components/Hub';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import LifeArchitect from './games/LifeArchitect';
import SqlHeist from './games/SqlHeist';
import AlgorithmArena from './games/AlgorithmArena';
import AptitudeDistrict from './games/AptitudeDistrict';
import StartupGarage from './games/StartupGarage';
import InternshipDetective from './games/InternshipDetective';
import CodeInspector from './games/CodeInspector';
import InterviewEscapeRoom from './games/InterviewEscapeRoom';
import ResumeBuilderTycoon from './games/ResumeBuilderTycoon';

export default function App() {
  const { activeGame } = usePlayerStore();

  // Dynamic Theme Class mapping to CSS variables in index.css
  const getThemeClass = () => {
    switch (activeGame) {
      case 'landing':
        return 'theme-landing';
      case 'career-tower':
        return 'theme-career-tower';
      case 'sql-heist':
        return 'theme-sql-heist';
      case 'algo-arena':
        return 'theme-algo-arena';
      case 'apti-rush':
        return 'theme-apti-rush';
      case 'startup-garage':
        return 'theme-startup-garage';
      case 'internship-detective':
        return 'theme-internship-detective';
      case 'code-inspector':
        return 'theme-code-inspector';
      case 'interview-escape':
        return 'theme-interview-escape';
      case 'resume-tycoon':
        return 'theme-resume-tycoon';
      default:
        return 'theme-hub';
    }
  };

  // State router for mounting active game mode
  const renderGameContent = () => {
    switch (activeGame) {
      case 'landing':
        return <LandingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'career-tower':
        return <LifeArchitect />;
      case 'sql-heist':
        return <SqlHeist />;
      case 'algo-arena':
        return <AlgorithmArena />;
      case 'apti-rush':
        return <AptitudeDistrict />;
      case 'startup-garage':
        return <StartupGarage />;
      case 'internship-detective':
        return <InternshipDetective />;
      case 'code-inspector':
        return <CodeInspector />;
      case 'interview-escape':
        return <InterviewEscapeRoom />;
      case 'resume-tycoon':
        return <ResumeBuilderTycoon />;
      default:
        return <Hub />;
    }
  };

  return (
    <div className={getThemeClass()} style={styles.appContainer}>
      {activeGame !== 'landing' && <Header />}
      <main style={styles.mainContent}>
        {renderGameContent()}
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'background-color 0.8s ease, color 0.5s ease',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  }
};
