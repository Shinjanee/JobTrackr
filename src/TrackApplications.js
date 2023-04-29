import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000'; 

const TrackApplications = () => {
  const [applications, setApplications] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobLink: '',
    position: '',
    status: 'applied',
  });

  useEffect(() => {
    fetch(`${API_URL}/applications`)
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); 
    fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(() => {
      setFormData({
        companyName: '',
        jobLink: '',
        position: '',
        status: 'applied',
      });
      setFormVisible(false);
      fetch(`${API_URL}/applications`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Updated applications data:", data); 
          setApplications(data);
        });
    });
  };  

  const handleDelete = (_id) => {
    fetch(`${API_URL}/applications/${_id}`, {
      method: 'DELETE',
    }).then(() => {
      fetch(`${API_URL}/applications`)
        .then((response) => response.json())
        .then((data) => setApplications(data));
    });
  };  

  return (
    <div>
      <h2>Track Applications</h2>
      <button onClick={() => setFormVisible(!formVisible)}>Add Application</button>
      {formVisible && (
        <form onSubmit={handleSubmit}>
          <label>Company Name: </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <label>Job Link: </label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            required
          />
          <label>Position: </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <label>Status: </label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      )}
      <ul>
      {applications.map((application) => (
        <li key={application._id}>
          {application.companyName} - {application.position} - {application.status}
          <button onClick={() => handleDelete(application._id)}>Delete</button>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default TrackApplications;
