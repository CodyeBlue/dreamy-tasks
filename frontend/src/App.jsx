import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [textInput, setTextInput] = useState('');
  const [listItems, setListItems] = useState([]);

  // Load existing tasks from the server when the page opens
  useEffect(() => {
    fetch('https://dreamy-tasks-backend.onrender.com')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setListItems(data);
        }
      })
      .catch(error => console.error("Error loading tasks:", error));
  }, []);

  function addLists() {
    if (textInput.trim() === '') return; // if box is empty do not do anything

    fetch('http://localhost:5000/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: textInput }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // updating lists for add a new text already exists
        setListItems([...listItems, textInput]);

        // clean the box for the next "product"
        setTextInput('');
      } else {
        alert("Error saving file on backend.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Backend server is disconnected!");
    });
  }

  // Clear all tasks from both screen and txt file
  function clearAllLists() {
    fetch('http://localhost:5000/api/clear', {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setListItems([]);
        alert("All tasks have been cleared!");
      } else {
        alert("Error clearing the file on backend.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Backend server is disconnected!");
    });
  }

  return (
    <div className="app-container">
      <div className="main-card">
        <h1>Hello World! 🌍</h1>

        <input className="text-box" type="text" name="name" placeholder="Type something..." value={textInput} onChange={(e) => setTextInput(e.target.value)} />
        
        {/* Container to put both buttons side by side */}
        <div className="button-container">
          <button type="button" className="buttons" onClick={addLists}>Confirm</button>
          <button type="button" className="clear-button" onClick={clearAllLists}>Clear </button>
        </div>

        <ul>
          {listItems.map((work, index) => (
            <li key={index} className="work-cloud">
              {work}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
