import GlossyTabs from './components/GlossyTabs.jsx';
import Summary from './sections/Summary.jsx';
import Experience from './sections/Experience.jsx';
import Education from './sections/Education.jsx';
import Certifications from './sections/Certifications.jsx';

function App() {
  const tabs = [
    { label: 'Summary', content: <Summary /> },
    { label: 'Experience', content: <Experience /> },
    { label: 'Education', content: <Education /> },
    { label: 'Certifications', content: <Certifications /> },
  ];

  return <GlossyTabs tabs={tabs} initialIndex={0} />;
}

export default App;
