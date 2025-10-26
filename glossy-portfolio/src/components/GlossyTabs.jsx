import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { EditButton } from './EditControls.jsx';
import AdminLoginDialog from './AdminLoginDialog.jsx';
import { useAuth } from './AuthContext.jsx';

const AppShell = styled.div`
  min-height: 100vh;
  background: radial-gradient(1200px 800px at 10% 10%, rgba(56,189,248,0.14), transparent 40%),
              radial-gradient(1000px 600px at 90% 10%, rgba(34,197,94,0.12), transparent 35%),
              #0f172a; /* slate-900 */
  color: #e5e7eb; /* gray-200 */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 60px;

  @media (max-width: 480px) {
    padding: 24px 16px 48px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: 0 8px 16px rgba(0,0,0,0.25), inset 0 1px rgba(255,255,255,0.08);
  object-fit: cover;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.14));
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  position: sticky;
  top: 0;
  backdrop-filter: blur(6px);
  padding: 12px 0;

  @media (max-width: 480px) {
    gap: 10px;
    padding: 10px 0;
  }
`;

const TabButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18));
  box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.25);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: inset 0 1px rgba(255,255,255,0.12), 0 12px 24px rgba(0,0,0,0.3);
    border-color: rgba(56,189,248,0.5); /* sky-400 */
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(56,189,248,0.8);
    box-shadow: 0 0 0 3px rgba(56,189,248,0.35);
  }

  &.active {
    border-color: rgba(34,197,94,0.7); /* green-500 */
    background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.22));
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 15px;
  }
`;

const Panel = styled(motion.div)`
  margin-top: 18px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22));
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  box-shadow: inset 0 1px rgba(255,255,255,0.08), 0 24px 40px rgba(0,0,0,0.35);
  padding: 20px;

  @media (min-width: 700px) {
    padding: 28px;
  }

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

export function GlossyTabs({ tabs, initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex);
  const [showLogin, setShowLogin] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <AppShell>
      <Container>
        <Header>
          <TitleRow>
            <Avatar src="/profile-photo.svg" alt="Profile photo" />
            <Title>Professional Profile</Title>
          </TitleRow>
          <RightActions>
            <EditButton onClick={() => setShowLogin(true)}>
              {isAdmin ? 'Admin Session' : 'Login as Admin'}
            </EditButton>
          </RightActions>
        </Header>

        <TabList role="tablist" aria-label="Sections">
          {tabs.map((t, i) => (
            <TabButton
              key={t.label}
              role="tab"
              aria-selected={i === index}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
            >
              {t.label}
            </TabButton>
          ))}
        </TabList>

        <AnimatePresence mode="wait">
          <Panel
            key={tabs[index].label}
            role="tabpanel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {tabs[index].content}
          </Panel>
        </AnimatePresence>
      
        <AdminLoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </Container>
    </AppShell>
  );
}

export default GlossyTabs;