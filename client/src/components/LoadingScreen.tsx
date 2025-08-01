import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingScreenProps {
  overlay?: boolean;
  message?: string;
  progress?: number;
}

const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'overlay',
})<{ overlay?: boolean }>(({ theme, overlay }) => ({
  position: overlay ? 'fixed' : 'relative',
  top: overlay ? 0 : 'auto',
  left: overlay ? 0 : 'auto',
  right: overlay ? 0 : 'auto',
  bottom: overlay ? 0 : 'auto',
  zIndex: overlay ? 9999 : 'auto',
  background: overlay 
    ? 'rgba(0, 0, 0, 0.8)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: overlay ? '100vh' : '100vh',
  width: '100%',
  padding: theme.spacing(4),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  marginBottom: theme.spacing(1),
  
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const Tagline = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.2rem',
  fontWeight: 400,
  textAlign: 'center',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const LoadingCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  minWidth: '300px',
  textAlign: 'center',
  
  [theme.breakpoints.down('sm')]: {
    minWidth: '250px',
    padding: theme.spacing(2),
  },
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: theme.spacing(2),
  fontSize: '1rem',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
}));

const AnimatedDots = styled(Box)({
  '&::after': {
    content: '""',
    animation: 'dots 1.5s infinite',
  },
  '@keyframes dots': {
    '0%, 20%': {
      content: '"."',
    },
    '40%': {
      content: '".."',
    },
    '60%, 100%': {
      content: '"..."',
    },
  },
});

const FeaturesList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: 'right',
  direction: 'rtl',
}));

const FeatureItem = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.9rem',
  marginBottom: theme.spacing(0.5),
  '&::before': {
    content: '"🎮"',
    marginLeft: theme.spacing(1),
  },
}));

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  overlay = false, 
  message = 'טוען את GameCraft Pro Ultimate',
  progress 
}) => {
  const features = [
    'מחולל קוד חכם מבוסס AI',
    'עורך ויזואלי דרג-אנד-דראפ',
    'מאגרי נכסים עצומים',
    'ייצוא לכל הפלטפורמות',
    'הגנות משפטיות מתקדמות'
  ];

  return (
    <LoadingContainer overlay={overlay}>
      <LogoContainer>
        <Logo>
          🎮 GameCraft Pro Ultimate
        </Logo>
        <Tagline>
          סביבת פיתוח משחקים מהפכנית
        </Tagline>
      </LogoContainer>

      <LoadingCard elevation={0}>
        <LoadingText>
          {message}
          <AnimatedDots />
        </LoadingText>
        
        <ProgressContainer>
          <StyledLinearProgress 
            variant={progress !== undefined ? "determinate" : "indeterminate"}
            value={progress}
          />
        </ProgressContainer>
        
        {progress !== undefined && (
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            {Math.round(progress)}% הושלם
          </Typography>
        )}

        <FeaturesList>
          {features.map((feature, index) => (
            <FeatureItem 
              key={index}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: 'fadeIn 0.5s ease-out forwards',
                opacity: 0,
              }}
            >
              {feature}
            </FeatureItem>
          ))}
        </FeaturesList>
      </LoadingCard>
    </LoadingContainer>
  );
};

export default LoadingScreen;