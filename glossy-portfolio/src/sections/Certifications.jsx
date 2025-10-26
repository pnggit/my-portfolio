import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toolbar, InlineActions, EditButton, PrimaryButton, SecondaryButton, PillAction, PillDanger, Field, Label, Input } from '../components/EditControls.jsx';
import { useAuth } from '../components/AuthContext.jsx';

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 26px;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Card = styled.div`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(0,0,0,0.18));
`;

const List = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 18px;
  color: #cbd5e1;
`;

export default function Certifications() {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState([
    'AWS Certified Solutions Architect — Associate',
    'Google Professional Cloud Architect',
    'Certified Kubernetes Administrator (CKA)',
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('certifications');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = () => {
    localStorage.setItem('certifications', JSON.stringify(items));
    setEditing(false);
  };

  const addItem = () => {
    setItems((prev) => [...prev, 'New Certification']);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? value : it)));
  };

  return (
    <div>
      <Title>Certifications</Title>

      {!editing && isAdmin && (
        <Toolbar>
          <EditButton onClick={() => setEditing(true)}>Edit</EditButton>
        </Toolbar>
      )}

      {editing && isAdmin ? (
        <div>
          <Card>
            {items.map((it, i) => (
              <Field key={i}>
                <Label>Certification #{i + 1}</Label>
                <Input value={it} onChange={(e) => updateItem(i, e.target.value)} />
                <InlineActions>
                  <PillDanger onClick={() => removeItem(i)}>Remove</PillDanger>
                </InlineActions>
              </Field>
            ))}
          </Card>
          <Toolbar>
            <PillAction onClick={addItem}>Add Certification</PillAction>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </Toolbar>
        </div>
      ) : (
        <Card>
          <List>
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </List>
        </Card>
      )}
    </div>
  );
}