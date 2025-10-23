import styled from 'styled-components';

export const LogList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

export const LogItem = styled.li`
  color: #E0E1DD;
  font-size: 14px;
  padding: 8px 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.4;

  &:first-child {
    background-color: rgba(58, 141, 255, 0.1);
  }
`;

export const Timestamp = styled.span`
  color: #888;
  font-size: 12px;
  margin-right: 8px;
`;