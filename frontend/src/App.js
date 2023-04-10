import { createContext, useState } from "react";
import Search from "./Search";
import Details from "./Details";
export const ChangeScreen = createContext()

function App() {
  let screen = useState([0,{}])
  return (
    <ChangeScreen.Provider value={screen}>
      <div className="App">
        {screen[0][0]===0 && <Search />}
        {screen[0][0]===1 && <Details />}
      </div>
    </ChangeScreen.Provider>
  );
}

export default App;
