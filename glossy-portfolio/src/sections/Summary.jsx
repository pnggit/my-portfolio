import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toolbar, EditButton, PrimaryButton, SecondaryButton, Field, Label, Textarea } from '../components/EditControls.jsx';
import { useAuth } from '../components/AuthContext.jsx';

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 26px;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const P = styled.p`
  margin: 8px 0;
  color: #cbd5e1; /* slate-300 */
`;

const List = styled.ul`
  margin: 12px 0 0 0;
  padding: 0 0 0 18px;
  color: #cbd5e1;
`;

export default function Summary() {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [overview, setOverview] = useState(
    'Results-driven software engineer specializing in modern frontend architectures,\n' +
    'delivering high-quality, accessible user interfaces with React, TypeScript, and\n' +
    'performance-first design.'
  );
  const [bullets, setBullets] = useState([
    'Expertise in React hooks, state management, and component design.',
    'Strong focus on UX, accessibility (a11y), and responsive layouts.',
    'Hands-on with CI/CD, testing, and design systems.',
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('summary');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.overview) setOverview(parsed.overview);
      if (parsed.bullets) setBullets(parsed.bullets);
    }
  }, []);

  const save = () => {
    localStorage.setItem('summary', JSON.stringify({ overview, bullets }));
    setEditing(false);
  };

  return (
    <div>
      <Title>Summary</Title>

      {!editing && isAdmin && (
        <Toolbar>
          <EditButton onClick={() => setEditing(true)}>Edit</EditButton>
        </Toolbar>
      )}

      {editing && isAdmin ? (
        <div>
          <Field>
            <Label>Overview</Label>
            <Textarea value={overview} onChange={(e) => setOverview(e.target.value)} />
          </Field>
          <Field>
            <Label>Highlights (one per line)</Label>
            <Textarea
              value={bullets.join('\n')}
              onChange={(e) => setBullets(e.target.value.split('\n').filter(Boolean))}
            />
          </Field>
          <Toolbar>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </Toolbar>
        </div>
      ) : (
        <>
          {overview.split('\n').map((line, i) => (
            <P key={i}>{line}</P>
          ))}
          <List>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </List>
        </>
      )}
    </div>
  );
}