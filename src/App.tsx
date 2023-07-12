import SideBar from "./components/SideBar";
import Content from "./components/Content";

import "./App.css";

function App() {
  return (
    <div className="overflow-hidden h-full flex items-center">
      <SideBar />
      <Content />
    </div>
  );
}

export default App;
