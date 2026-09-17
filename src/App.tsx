import { Header } from './components/Header';
import {
  Background,
  Contact,
  Footer,
  HowIWork,
  Landing,
  Skills,
  SmallerWork,
  Work,
} from './components/Sections';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header theme={theme} onToggleTheme={toggle} />

      <main id="main">
        {/* Landing first and short. Work leads everything past it, because the
            projects are the reason to keep reading. */}
        <Landing />
        <Work />
        <SmallerWork />
        <Skills />
        <HowIWork />
        <Background />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
