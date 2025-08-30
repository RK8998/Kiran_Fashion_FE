import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({
  user: null,
  saveLoggedInUser: (data: any) => {
    return;
  },
});

const GlobalContextProvider = (props: React.PropsWithChildren) => {
  const [user, setUser] = useState(null);

  const saveLoggedInUser = (userData: any) => {
    if (!userData) return;

    setUser(userData);
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        saveLoggedInUser,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
