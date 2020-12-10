import React from 'react';
import { Text } from '../../components';
import { MainHeader } from '../../components/business/MainHeader';
import { customThemeType, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';

export { LoadingPage };

function LoadingPage() {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <>
      <MainHeader />
      <span style={style.loadingPage}>
        <div className="loading-wheel" style={style.loadingWheel} />
        <Text>{wordings.loading}</Text>
      </span>
    </>
  );

  function buildStyle(theme: customThemeType) {
    return {
      loadingPage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      loadingWheel: {
        color: theme.colors.line.level1,
      },
    } as const;
  }
}
