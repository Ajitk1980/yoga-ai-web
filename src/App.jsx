import HeroSection from './components/HeroSection';
import ClassDirectory from './components/ClassDirectory';
import AIConcierge from './components/AIConcierge';

function App() {
  return (
    <div className="min-h-screen bg-sand-50">
      <main>
        <HeroSection />
        <AIConcierge />
        <ClassDirectory />
      </main>

      <footer className="bg-charcoal-900 text-charcoal-400 py-12 px-6 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-serif text-white mb-2">Yoga AI</h2>
            <p className="text-sm"> elevating your practice through intelligence.</p>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-charcoal-600">
          © {new Date().getFullYear()} Yoga AI Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
