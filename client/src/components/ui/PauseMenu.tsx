import { usePortfolio } from '@/lib/stores/usePortfolio';
import { useAudio } from '@/lib/stores/useAudio';
import { SOCIAL_LINKS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Globe, FileText, Play, Volume2, VolumeX } from 'lucide-react';

export function PauseMenu() {
  const { phase, togglePause, setPhase } = usePortfolio();
  const { isMuted, toggleMute } = useAudio();
  
  if (phase !== 'paused') return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] border-2 border-cyan-500 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl shadow-cyan-500/50"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            PAUSED
          </h2>
          <p className="text-gray-400">BragaWork City</p>
        </div>
        
        {/* Menu Options */}
        <div className="space-y-4">
          {/* Resume */}
          <button
            onClick={togglePause}
            className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Resume Game
          </button>
          
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            Sound: {isMuted ? 'OFF' : 'ON'}
          </button>
          
          {/* Resume/CV */}
          <a
            href={SOCIAL_LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            View Resume
          </a>
          
          {/* Social Links */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-center text-gray-400 text-sm mb-3">Connect with me</p>
            <div className="flex justify-center gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
                title="GitHub"
              >
                <Github className="w-6 h-6 text-white" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all transform hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-sky-600 hover:bg-sky-500 rounded-lg transition-all transform hover:scale-110"
                title="Twitter"
              >
                <Twitter className="w-6 h-6 text-white" />
              </a>
              <a
                href={SOCIAL_LINKS.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-700 hover:bg-green-600 rounded-lg transition-all transform hover:scale-110"
                title="Portfolio"
              >
                <Globe className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
          
          {/* Exit */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm"
          >
            Exit to Main Menu
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Press ESC to resume
        </div>
      </motion.div>
    </motion.div>
  );
}
