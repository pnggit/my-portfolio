import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toolbar, InlineActions, EditButton, PrimaryButton, SecondaryButton, PillAction, PillDanger, Field, Label, Input, Textarea } from '../components/EditControls.jsx';
import { useAuth } from '../components/AuthContext.jsx';

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 26px;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Role = styled.div`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(0,0,0,0.18));
`;

const Company = styled.div`
  font-weight: 600;
`;

const Period = styled.div`
  color: #9ca3af; /* gray-400 */
  font-size: 15px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Bullets = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 18px;
  color: #cbd5e1;
`;

export default function Experience() {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [roles, setRoles] = useState([
    {
      company: 'Senior Frontend Engineer — Acme Corp',
      period: '2022 — Present · Remote',
      bullets: [
        'Led migration to Vite + React hooks, reducing bundle by 35%.',
        'Built reusable design system with styled-components and Storybook.',
        'Delivered animated glossy UI surfaces using framer-motion.',
      ],
    },
    {
      company: 'Frontend Engineer — Globex',
      period: '2019 — 2022 · Bangalore',
      bullets: [
        'Implemented responsive dashboards and a11y-compliant navigation.',
        'Improved performance via code-splitting and memoization.',
        'Collaborated cross-functionally to ship features on time.',
      ],
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('experience');
    if (saved) setRoles(JSON.parse(saved));
  }, []);

  const save = () => {
    localStorage.setItem('experience', JSON.stringify(roles));
    setEditing(false);
  };

  const updateRole = (idx, patch) => {
    setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRole = () => {
    setRoles((prev) => [
      ...prev,
      { company: 'New Role', period: 'Year — Year · Location', bullets: ['Responsibility A', 'Responsibility B'] },
    ]);
  };

  const removeRole = (idx) => {
    setRoles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Title>Experience</Title>

      {!editing && isAdmin && (
        <Toolbar>
          <EditButton onClick={() => setEditing(true)}>Edit</EditButton>
        </Toolbar>
      )}

      {editing && isAdmin ? (
        <div>
          {roles.map((r, i) => (
            <Role key={i}>
              <Field>
                <Label>Company / Role</Label>
                <Input value={r.company} onChange={(e) => updateRole(i, { company: e.target.value })} />
              </Field>
              <Field>
                <Label>Period</Label>
                <Input value={r.period} onChange={(e) => updateRole(i, { period: e.target.value })} />
              </Field>
              <Field>
                <Label>Highlights (one per line)</Label>
                <Textarea
                  value={r.bullets.join('\n')}
                  onChange={(e) => updateRole(i, { bullets: e.target.value.split('\n').filter(Boolean) })}
                />
              </Field>
              <InlineActions>
                <PillDanger onClick={() => removeRole(i)}>Remove</PillDanger>
              </InlineActions>
            </Role>
          ))}
          <Toolbar>
            <PillAction onClick={addRole}>Add Role</PillAction>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </Toolbar>
        </div>
      ) : (
        <>
          {roles.map((r, i) => (
            <Role key={i}>
              <Company>{r.company}</Company>
              <Period>{r.period}</Period>
              <Bullets>
                {r.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </Bullets>
            </Role>
          ))}
        </>
      )}
    </div>
  );
}