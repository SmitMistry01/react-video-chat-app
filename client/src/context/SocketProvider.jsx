import React, { createContext,useMemo ,useContext} from "react";
import { io } from 'socket.io-client'
export const SocketContext = createContext(null);
//In React, useContext and createContext are used for managing and sharing state between components without needing to pass props down manually through each level. 

//This is particularly useful for deeply nested components where "prop drilling" becomes inconvenient.

//Context Creation: A context (MyContext) is created, and a provider component (MyProvider) is defined to manage the state.
//Provider Usage: The MyProvider wraps the main application, making the context available to MyComponent.
//Context Consumption: Inside MyComponent, the context is accessed using useContext, allowing you to read and update the shared state.

export const useSocket = () =>
{
    const socket = useContext(SocketContext);
    return socket;
}

//useMemo =>
//When you have expensive calculations (e.g., large data processing or complex calculations) that you want to avoid recalculating on every render.

//When you want to optimize performance by memoizing values passed to child components.
export const SocketProvider = (props) => {
  const socket = useMemo(() => io("localhost:8000"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
