import React from 'react';
import styled from 'styled-components';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  color: 'blue' | 'cyan' | 'green' | 'yellow' | 'violet';
}

const colorMap = {
  blue: {
    gradient: 'linear-gradient(71deg, #110e1e, #1a2a4f, #110e1e)',
    border: 'linear-gradient(71deg, #0e1525, #2055a2, #0e1525)',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    iconBorder: 'rgba(59, 130, 246, 0.3)',
    iconColor: '#60A5FA',
  },
  cyan: {
    gradient: 'linear-gradient(71deg, #0e1820, #1a3f4f, #0e1820)',
    border: 'linear-gradient(71deg, #0e1820, #20a2a2, #0e1820)',
    iconBg: 'rgba(34, 211, 238, 0.1)',
    iconBorder: 'rgba(34, 211, 238, 0.3)',
    iconColor: '#22D3EE',
  },
  green: {
    gradient: 'linear-gradient(71deg, #0e1810, #1a4f2a, #0e1810)',
    border: 'linear-gradient(71deg, #0e1810, #20a250, #0e1810)',
    iconBg: 'rgba(34, 197, 94, 0.1)',
    iconBorder: 'rgba(34, 197, 94, 0.3)',
    iconColor: '#22C55E',
  },
  yellow: {
    gradient: 'linear-gradient(71deg, #1a1810, #4f3a1a, #1a1810)',
    border: 'linear-gradient(71deg, #1a1810, #a28220, #1a1810)',
    iconBg: 'rgba(234, 179, 8, 0.1)',
    iconBorder: 'rgba(234, 179, 8, 0.3)',
    iconColor: '#EAB308',
  },
  violet: {
    gradient: 'linear-gradient(71deg, #18101a, #3a1a4f, #18101a)',
    border: 'linear-gradient(71deg, #18101a, #8220a2, #18101a)',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    iconBorder: 'rgba(139, 92, 246, 0.3)',
    iconColor: '#8B5CF6',
  },
};

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, color }) => {
  const colors = colorMap[color];

  return (
    <StyledWrapper colors={colors}>
      <div className="container-card">
        <div className="icon-container">{icon}</div>
        <div className="content">
          <p className="card-title">{title}</p>
          <div className="card-value">{value}</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ colors: typeof colorMap.blue }>`
  .container-card {
    position: relative;
    border: 2px solid transparent;
    background: ${(props) => props.colors.gradient};
    background-clip: padding-box;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
  }

  .container-card::after {
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
    content: "";
    z-index: -1;
    border-radius: 20px;
    background: ${(props) => props.colors.border};
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
    border-radius: 12px;
    background: ${(props) => props.colors.iconBg};
    border: 1px solid ${(props) => props.colors.iconBorder};
    color: ${(props) => props.colors.iconColor};
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-weight: 500;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    margin-bottom: 4px;
  }

  .card-value {
    font-weight: 700;
    line-height: 1.2;
    color: white;
    font-size: 18px;
  }
`;

export default InfoCard;
