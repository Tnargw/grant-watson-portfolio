import { Header } from '../components/Header';
import { Background, Contact, Footer, HowIWork, PageHeader, Skills } from '../components/Sections';
import { useTheme } from '../hooks/useTheme';

export default function AboutPage() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header current="about" theme={theme} onToggleTheme={toggle} />

      <main id="main">
        <PageHeader
          eyebrow="About"
          title="What I work with, and how I work"
          lede="The stack, what I am like on a team, and where I have worked and studied."
        />
        <Skills />
        <HowIWork />
        <Background />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
