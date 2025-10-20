import { useState } from "react";
import "./App.css";
import Option1 from "./components/Option1";
import Option2 from "./components/Option2";
import Option3 from "./components/Option3";
import Option4 from "./components/Option4";
import mockData from "./mock/mock.json";

function App() {
  const [activeOption, setActiveOption] = useState(1);

  const renderContent = () => {
    switch (activeOption) {
      case 1:
        return <Option1 data={mockData} />;
      case 2:
        return <Option2 data={mockData} />;
      case 3:
        return <Option3 data={mockData} />;
      case 4:
        return <Option4 data={mockData} />;
      default:
        return <Option1 data={mockData} />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <button className={activeOption === 1 ? "active" : ""} onClick={() => setActiveOption(1)}>
          Default
        </button>
        <button className={activeOption === 2 ? "active" : ""} onClick={() => setActiveOption(2)}>
          Option 2 : Blueprint
        </button>
        <button className={activeOption === 3 ? "active" : ""} onClick={() => setActiveOption(3)}>
          Option 3 : Mantine
        </button>
        <button className={activeOption === 4 ? "active" : ""} onClick={() => setActiveOption(4)}>
          Option 4 : React JSON Viewer
        </button>
      </nav>
      {renderContent()}
    </div>
  );
}

export default App;
