import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MatchJD = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tries, setTries] = useState(parseInt(localStorage.getItem('tries')) || 5);
  const buttonRef = useRef();

  useEffect(() => {
    setInputText('');
    updateButtonStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('tries', tries);
    updateButtonStatus();
  }, [tries]);

  useEffect(() => {
    updateButtonStatus();
  }, [inputText]);

  const updateButtonStatus = () => {
    if (inputText === '' || inputText.length < 50 || tries <= 0) {
      buttonRef.current.disabled = true;
      buttonRef.current.style.backgroundColor = '#ddd';
      buttonRef.current.style.color = '#999';
    } else {
      buttonRef.current.disabled = false;
      buttonRef.current.style.backgroundColor = '#3f51b5';
      buttonRef.current.style.color = '#fff';
    }
  };

  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleRightArrowClick = async () => {
    if (tries > 0) {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: inputText,
        max_tokens: 1024,
        n: 1,
        stop: ['\n']
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      setOutputText(response.data.choices[0].text);
      setTries(prevTries => prevTries - 1);
    }
  };
  
  return (
    <div key={tries}>
      <h2>Match JD</h2>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <textarea
          style={{ flex: 1, height: '400px', resize: 'none', overflowY: 'scroll' }}
          value={inputText}
          onChange={handleInputTextChange}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px' }}>
          <button onClick={handleRightArrowClick} style={{ fontSize: '32px', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', backgroundColor: '#3f51b5', color: 'white', border: 'none', cursor: 'pointer' }} ref={buttonRef} disabled={!inputText || inputText.length < 50 || tries === 0}>
            &rarr;
          </button>
        </div>
        <textarea
          style={{ flex: 1, height: '400px', resize: 'none', overflowY: 'scroll' }}
          value={outputText}
          readOnly
        />
      </div>
      <p>Attempts remaining: {tries}</p>
    </div>
  );
}

export default MatchJD;
