import "./App.css";

import Player from "./comps/Player";
import { ContentProvider } from "./context/Provider";

function App() {
	return (
  <ContentProvider>
    <div className="App">
			<Player />
		</div>
  </ContentProvider>
		
	);
}

export default App;
