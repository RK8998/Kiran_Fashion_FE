import React, { createContext, useState } from 'react';

type GlobalContextType = {
  user: null | any;
  saveLoggedInUser: (data: any) => void;
};

// export const GlobalContext = createContext({
//   user: null,
//   saveLoggedInUser: (data: any) => void,
// });

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
  saveLoggedInUser: () => {},
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
