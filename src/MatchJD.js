import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { RiLoader4Line } from 'react-icons/ri';
import './MatchJD_style.css';

const API_URL = 'http://127.0.0.1:5000';

const MatchJD = ({ profile, hasResume }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tries, setTries] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const buttonRef = useRef();

  const updateButtonDisabledStatus = () => {
    if (inputText === '' || inputText.length < 50 || tries <= 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    fetchUpdatedTries();
  }, []);
  

  useEffect(() => {
    if (tries !== null) {
      updateButtonDisabledStatus();
    }
  }, [tries, inputText]);

  const fetchUpdatedTries = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/tries/reset/${profile.id}`);
      setTries(response.data.tries);
    } catch (error) {
      console.error("Error fetching updated tries:", error);
    }
  };  

  const updateTries = async (newTries) => {
    try {
      await axios.put(`${API_URL}/users/tries/${profile.id}`, {
        tries: newTries
      });
    } catch (error) {
      console.error("Error updating tries:", error);
    }
  };

  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleRightArrowClick = async () => {
    if (tries <= 0) {
      return;
    }
  
    try {
      setOutputText("")
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/users/openai/${profile.id}`, {
        inputText: inputText
      });
  
      // Handle the response data here
      setOutputText(response.data.reply);
      const newTries = tries - 1;
      setTries(newTries);
      updateTries(newTries);
      updateButtonDisabledStatus();
  
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }
    finally {
      setIsLoading(false);
    }
  };  

  const fetchQuestionsAndAnswers = async () => {
    setIsQuestionsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/openai/questions/${profile.id}`, {
        jobDescription: inputText,
        resumeText: outputText
      });
      const data = await response.data;
      setQuestionsAndAnswers(
        data.questions_and_answers.map((item) => ({ ...item, showAnswer: false }))
      );
      setInputText('');
    } catch (error) {
      console.error('Error fetching questions and answers:', error);
    } finally {
      setIsQuestionsLoading(false);
    }
  };


  const toggleAnswerVisibility = (index) => {
    setQuestionsAndAnswers(
      questionsAndAnswers.map((item, i) => {
        if (i === index) {
          return { ...item, showAnswer: !item.showAnswer };
        }
        return item;
      })
    );
  };


  
    return (
      <div>
        {hasResume ? (
          <>
            {tries === null ? (
              <div>Loading...</div>
            ) : (
              <>
                <h2>Match JD</h2>
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <textarea
                    style={{ flex: 1, height: '400px', resize: 'none', overflowY: 'scroll' }}
                    value={inputText}
                    onChange={handleInputTextChange}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px' }}>
                    {isLoading ? (
                      <div className="loading-indicator">
                        <RiLoader4Line className="spinner" />
                      </div>
                    ) : (
                      <button
                        onClick={handleRightArrowClick}
                        style={{
                          fontSize: '32px',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                          backgroundColor: isDisabled ? '#ddd' : '#000',
                          color: isDisabled ? '#999' : '#fff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        disabled={isDisabled}
                      >
                      &rarr;
                    </button>              
                    )}
                  </div>
                  <textarea
                    style={{ flex: 1, height: '400px', resize: 'none', overflowY: 'scroll' }}
                    value={outputText}
                    readOnly
                  />
                </div>
                {inputText.length < 50 && tries > 0 && <p style={{ color: 'red' }}>Add at least 50 words.</p>}
                {tries <= 0 && <p style={{ color: "red" }}>No more tries remaining. Try after 2 hours.</p>}
                <p>Attempts remaining: {tries}</p>
                {tries > 0 && (
                  <button
                    onClick={fetchQuestionsAndAnswers}
                    style={{
                      backgroundColor: inputText === '' || outputText === '' ? 'gray' : 'black',
                      color: 'white',
                      borderRadius: '5px',
                      padding: '10px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      margin: '20px 0',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      textAlign: 'center',
                      fontSize: '16px',
                    }}
                    disabled={inputText === '' || outputText === ''}
                  >
                    {isQuestionsLoading ? (
                      <RiLoader4Line className="spinner" />
                    ) : (
                      'Fetch Questions and Answers'
                    )}
                  </button>
                )}
                {
                  questionsAndAnswers.map((item, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', borderRadius: '4px', margin: '10px', padding: '10px' }}>
                      <h3 onClick={() => toggleAnswerVisibility(index)} style={{ cursor: 'pointer' }}>
                        Q{index + 1}: {item.question}
                      </h3>
                      {item.showAnswer && (
                        <p style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                          {item.answer}
                        </p>
                      )}
                    </div>
                  ))
                }
              </>
            )}
          </>
        ) : (
          <p>Please add your resume to use this functionality.</p>
        )}
      </div>
    );
}

export default MatchJD;

