import { Header } from './components/Header';
import {
  Background,
  Contact,
  Footer,
  Hero,
  HowIWork,
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
        <Hero />
        <Skills />
        <Work />
        <SmallerWork />
        <HowIWork />
        <Background />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
