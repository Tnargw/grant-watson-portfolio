import { Header } from '../components/Header';
import { Contact, Footer, PageHeader, SmallerWork, Work } from '../components/Sections';
import { useTheme } from '../hooks/useTheme';

export default function WorkPage() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header current="work" theme={theme} onToggleTheme={toggle} />

      <main id="main">
        <PageHeader
          eyebrow="Selected work"
          title="Four things I built"
          lede="What each one was for, what I built, and the one problem from each that I would most want to be asked about."
        />
        <Work />
        <SmallerWork />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
