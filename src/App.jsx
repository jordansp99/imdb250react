import React from 'react'; // Import React!
import './App.css';
import Header from './Header'; // Correct import

function App() {
  return (
    <div className="App"> {/* It's good practice to wrap your JSX in a single element */}
      <Header /> {/* Use the Header component */}
      <p>Content in App component</p>
    </div>
  );
}

export default App;