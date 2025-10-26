import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin: 8px 0 12px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const InlineActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const EditButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18));
  box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.25);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 15px;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;

  &:hover { transform: translateY(-1px); box-shadow: inset 0 1px rgba(255,255,255,0.12), 0 12px 24px rgba(0,0,0,0.3); border-color: rgba(56,189,248,0.5); }
  &:focus-visible { outline: none; border-color: rgba(56,189,248,0.8); box-shadow: 0 0 0 3px rgba(56,189,248,0.35); }

  @media (max-width: 480px) {
    padding: 9px 12px;
    font-size: 14px;
  }
`;

export const PrimaryButton = styled(EditButton)`
  border-color: rgba(34,197,94,0.6);
  background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.22));
`;

export const SecondaryButton = styled(EditButton)`
  border-color: rgba(255,255,255,0.18);
`;

export const PillAction = styled(EditButton)`
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 14px;

  @media (max-width: 480px) {
    padding: 7px 10px;
    font-size: 13px;
  }
`;

export const PillDanger = styled(PillAction)`
  border-color: rgba(248,113,113,0.6); /* red-400 */
`;

export const Field = styled.div`
  margin: 10px 0;
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22));
  color: #e5e7eb;
  font-size: 16px;

  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 15px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 92px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22));
  color: #e5e7eb;
  font-size: 16px;
  resize: vertical;

  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 15px;
  }
`;