import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Select, MenuItem, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = 'http://127.0.0.1:5000';

const TrackApplications = ({ profile }) => {
  const [applications, setApplications] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobLink: '',
    position: '',
    status: 'Applied',
  });

  useEffect(() => {
    fetch(`${API_URL}/applications/${profile.id}`)
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, userId: profile.id }),
    }).then(() => {
      setFormData({
        companyName: '',
        jobLink: '',
        position: '',
        status: 'applied',
      });
      setFormVisible(false);
      fetch(`${API_URL}/applications/${profile.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Updated applications data:', data);
          setApplications(data);
        });
    });
  };

  const handleDelete = (_id) => {
    fetch(`${API_URL}/applications/${_id}`, {
      method: 'DELETE',
    }).then(() => {
      fetch(`${API_URL}/applications/${profile.id}`)
        .then((response) => response.json())
        .then((data) => setApplications(data));
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'blue';
      case 'Interview':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'inherit';
    }
  };

  const handleRowClick = (application) => {
    setFormData({
      companyId: application.companyId,
      companyName: application.companyName,
      jobLink: application.jobLink,
      position: application.position,
      status: application.status,
    });
    setEditingApplicationId(application._id);
    setFormVisible(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updating application:", formData);
    fetch(`${API_URL}/applications/${editingApplicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(() => {
        setFormData({
          companyId: "",
          companyName: "",
          jobLink: "",
          position: "",
          status: "Applied",
        });
        setEditingApplicationId(null);
        setFormVisible(false);
        fetch(`${API_URL}/applications/${profile.id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Updated applications data:", data);
            setApplications(data);
          });
      })
      .catch((error) => console.error("Error updating application:", error));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>
      <Box sx={{ position: 'fixed', right: 16, bottom: 16 }}>
        <IconButton color="primary" aria-label="Add application" onClick={() => setFormVisible(!formVisible)}>
          <AddIcon fontSize="large" sx={{ bgcolor: 'black', color: 'white', borderRadius: '50%' }} />
        </IconButton>
      </Box>
      <Modal open={formVisible} onClose={() => setFormVisible(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setFormVisible(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Application
          </Typography>
          <form onSubmit={editingApplicationId ? handleUpdate : handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <TextField label="Job Link" type="url" name="jobLink" value={formData.jobLink} onChange={handleChange} required />
              <TextField label="Position" name="position" value={formData.position} onChange={handleChange} required />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Interview">Interview</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  {editingApplicationId ? "Update" : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <List>
        {applications.map((application) => (
          <ListItem
            key={application._id}
            sx={{ my: 1, borderBottom: "1px solid #ccc", cursor: "pointer" }}
            onClick={() => handleRowClick(application)}
          >            
        <ListItemText
              primary={`${application.companyName}`}
              secondary={`${application.position}`}
            />
            <ListItemSecondaryAction>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: 'white',
                  borderRadius: '4px',
                  display: 'inline-block',
                  backgroundColor: getStatusColor(application.status),
                  padding: '4px 8px',
                }}
              >
                {application.status}
              </Typography>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(application._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TrackApplications;

