import Navbar from './components/Navbar';
import JsonEditor from './components/JsonEditor';

const App = () => {

  return (
    <div className="container">
      <Navbar />
      <div className="container mx-auto flex">
        <JsonEditor  />
      </div>
    </div>
  );
};

export default App;
