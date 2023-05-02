import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resume_style.css';

const API_URL = process.env.REACT_APP_API_URL;

const Resume = ({ profile, setHasResume }) => {
  const [resumeText, setResumeText] = useState('');
  const [buttonText, setButtonText] = useState('Save');

  useEffect(() => {
    fetchResumeText();
  }, []);

  const fetchResumeText = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/resume/${profile.id}`);
      if (response.data.resumeText) {
        setResumeText(response.data.resumeText);
        setButtonText('Update');
        setHasResume(true);
      }
      else {
        setHasResume(false);
      }
    } catch (error) {
      console.error("Error fetching resume text:", error);
    }
  };

  const handleResumeTextChange = (event) => {
    setResumeText(event.target.value);
  };

  const handleSubmitClick = async () => {
    try {
      const formattedResumeText = resumeText.replace(/\r?\n|\r/g, '\n');
      await axios.post(`${API_URL}/users/resume/${profile.id}`, {
        resumeText: formattedResumeText
      });
      setButtonText('Update');
    } catch (error) {
      console.error("Error saving or updating resume text:", error);
    }
  };

  return (
    <div>
      <h2>My Resume</h2>
      <textarea
        className="resume-textarea"
        value={resumeText}
        onChange={handleResumeTextChange}
      />
      <button
        className="resume-submit-button"
        onClick={handleSubmitClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Resume;
