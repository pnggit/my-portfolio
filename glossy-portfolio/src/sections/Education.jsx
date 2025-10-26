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

const Program = styled.div`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(0,0,0,0.18));
`;

const Degree = styled.div`
  font-weight: 600;
`;

const School = styled.div`
  color: #cbd5e1; /* slate-300 */
`;

const Period = styled.div`
  color: #9ca3af; /* gray-400 */
  font-size: 15px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export default function Education() {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [programs, setPrograms] = useState([
    {
      degree: 'B.Tech — Computer Science',
      school: 'IIT Example',
      period: '2015 — 2019',
      details: 'Focused on algorithms, web development, and UI engineering.',
    },
    {
      degree: 'M.S. — Human-Computer Interaction',
      school: 'Example University',
      period: '2019 — 2021',
      details: 'Researched design systems and motion-driven interfaces.',
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('education');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  const save = () => {
    localStorage.setItem('education', JSON.stringify(programs));
    setEditing(false);
  };

  const updateProgram = (idx, patch) => {
    setPrograms((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const addProgram = () => {
    setPrograms((prev) => [
      ...prev,
      { degree: 'New Degree', school: 'New School', period: 'Year — Year', details: 'Key coursework and achievements.' },
    ]);
  };

  const removeProgram = (idx) => {
    setPrograms((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Title>Education</Title>

      {!editing && isAdmin && (
        <Toolbar>
          <EditButton onClick={() => setEditing(true)}>Edit</EditButton>
        </Toolbar>
      )}

      {editing && isAdmin ? (
        <div>
          {programs.map((p, i) => (
            <Program key={i}>
              <Field>
                <Label>Degree</Label>
                <Input value={p.degree} onChange={(e) => updateProgram(i, { degree: e.target.value })} />
              </Field>
              <Field>
                <Label>School</Label>
                <Input value={p.school} onChange={(e) => updateProgram(i, { school: e.target.value })} />
              </Field>
              <Field>
                <Label>Period</Label>
                <Input value={p.period} onChange={(e) => updateProgram(i, { period: e.target.value })} />
              </Field>
              <Field>
                <Label>Details</Label>
                <Textarea value={p.details} onChange={(e) => updateProgram(i, { details: e.target.value })} />
              </Field>
              <InlineActions>
                <PillDanger onClick={() => removeProgram(i)}>Remove</PillDanger>
              </InlineActions>
            </Program>
          ))}
          <Toolbar>
            <PillAction onClick={addProgram}>Add Program</PillAction>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </Toolbar>
        </div>
      ) : (
        <>
          {programs.map((p, i) => (
            <Program key={i}>
              <Degree>{p.degree}</Degree>
              <School>{p.school}</School>
              <Period>{p.period}</Period>
              <div style={{ color: '#cbd5e1', marginTop: 8 }}>{p.details}</div>
            </Program>
          ))}
        </>
      )}
    </div>
  );
}