import { useState } from 'react';
import styled from 'styled-components';
import { Field, Label, Input, Toolbar, PrimaryButton } from './EditControls.jsx';
import { useAuth } from './AuthContext.jsx';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.22));
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 16px;
  box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 24px 40px rgba(0,0,0,0.45);
  color: #e5e7eb;
  padding: 18px;

  @media (min-width: 700px) {
    padding: 22px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.2px;
`;

const CloseButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18));
  box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.25);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: #fca5a5; /* red-300 */
  font-size: 14px;
  margin-top: 8px;
`;

export default function AdminLoginDialog({ open, onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Backdrop role="dialog" aria-modal="true">
      <Dialog>
        <Header>
          <Title>Admin Login</Title>
          <CloseButton aria-label="Close" onClick={onClose}>Close</CloseButton>
        </Header>
        <form onSubmit={submit}>
          <Field>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <ErrorText>{error}</ErrorText>}
          <Toolbar>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Checking…' : 'Login as Admin'}
            </PrimaryButton>
          </Toolbar>
        </form>
      </Dialog>
    </Backdrop>
  );
}