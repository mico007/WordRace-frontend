import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [playerId, setPlayerId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setPlayerId(uid);
    const tokenExpirationTime =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationTime);
    localStorage.setItem(
      'playerData',
      JSON.stringify({
        playerId: uid,
        token: token,
        expiration: tokenExpirationTime.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setPlayerId(null);
    localStorage.removeItem('playerData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('playerData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.playerId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, playerId };
};