import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { apiCaller } from '../../api';
import { ButtonWithIcon, Logo, Text, TextInput } from '../../components';
import { localStorage } from '../../services/localStorage';
import { customThemeType, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const history = useHistory();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.logoContainer}>
        <Logo size="medium" />
      </div>
      <form style={styles.formContainer} onSubmit={handleSubmit}>
        <div style={styles.inputContainer}>
          <TextInput
            name="email"
            type="email"
            placeholder={wordings.loginPage.email}
            onChange={changeEmail}
            value={email}
            error={!isFormValid}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <TextInput
            name="password"
            type="password"
            placeholder={wordings.loginPage.password}
            onChange={changePassword}
            value={password}
            error={!isFormValid}
            style={styles.input}
          />
        </div>
        <div style={styles.forgottenPasswordContainer}>
          <Link to="/reset-password-request">
            <Text style={styles.forgottenPasswordText} variant="h3" color="textPrimary">
              {wordings.loginPage.forgottenPassword}
            </Text>
          </Link>
        </div>
        <div style={styles.loginButtonContainer}>
          <ButtonWithIcon
            iconName={isFormValid ? 'login' : 'error'}
            onClick={handleSubmit}
            color={isFormValid ? 'primary' : 'alert'}
            text={wordings.loginPage.login}
            type="submit"
          />
        </div>
        <div style={styles.errorContainer}>
          {!isFormValid && (
            <div style={styles.invalidErrorContainer}>
              <Text style={styles.formErrorText} variant="h3">
                {wordings.loginPage.wrongEmailOrPassword}
              </Text>
              <Text style={styles.formErrorText} variant="h3">
                {wordings.loginPage.pleaseTryAgain}
              </Text>
            </div>
          )}
        </div>
      </form>
    </div>
  );

  function resetIsFormValid() {
    if (!isFormValid) {
      setIsFormValid(true);
    }
  }

  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    resetIsFormValid();
    setEmail(event.target.value);
  }

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    resetIsFormValid();
    setPassword(event.target.value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const {
        data: { email: userEmail, name, role, token },
      } = await apiCaller.post<'login'>('login', { email, password });
      localStorage.bearerTokenHandler.set(token);
      localStorage.userHandler.set({ email: userEmail, name, role });
      history.push('/');
    } catch (error) {
      setIsFormValid(false);
      console.warn(error);
    }
  }

  function buildStyles(theme: customThemeType) {
    const MIN_WIDTH_FORM = 366;
    const ERROR_LINE_HEIGHT = 19;

    return {
      mainContainer: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      },
      logoContainer: {
        marginBottom: theme.spacing * 2,
      },
      formContainer: {
        minWidth: MIN_WIDTH_FORM,
        padding: theme.spacing * 6,
        paddingBottom: theme.spacing * 3,
        borderRadius: theme.shape.borderRadius.m,
        boxShadow: theme.boxShadow.major.out,
      },
      inputContainer: {
        marginBottom: theme.spacing * 3,
      },
      input: {
        display: 'flex',
      },
      forgottenPasswordContainer: {
        marginBottom: theme.spacing * 3,
      },
      forgottenPasswordText: {
        textDecoration: 'underline',
      },
      loginButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: theme.spacing,
      },
      formErrorText: {
        lineHeight: `${ERROR_LINE_HEIGHT}px`,
        textAlign: 'right',
      },
      errorContainer: {
        height: `${2 * ERROR_LINE_HEIGHT}px`,
      },
      invalidErrorContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
    } as const;
  }
};
