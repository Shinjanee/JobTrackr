import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Button, TextField, Select, MenuItem, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const API_URL = process.env.REACT_APP_API_URL;

const TrackApplications = ({ profile }) => {
  const [applications, setApplications] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
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
  }, [profile.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        status: 'Applied',
      });
      setFormVisible(false);
      fetch(`${API_URL}/applications/${profile.id}`)
        .then((response) => response.json())
        .then((data) => {
          setApplications(data);
        });
    });
  };

  const handleDelete = (e, _id) => {
    e.stopPropagation();
    setSelectedApplicationId(_id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    fetch(`${API_URL}/applications/${selectedApplicationId}`, {
      method: 'DELETE',
    }).then(() => {
      setDeleteConfirmationOpen(false);
      setSelectedApplicationId(null);
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
            setApplications(data);
          });
      })
      .catch((error) => console.error("Error updating application:", error));
  };

  const columns = [
    { field: 'companyName', headerName: 'Company Name', width: 250 },
    { field: 'position', headerName: 'Position', width: 250 },
    {
      field: 'jobLink',
      headerName: 'Job Link',
      width: 500,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {params.value}
        </a>
      ),
    },
    { 
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div style={{ textAlign: 'right',
                  fontWeight: 'bold',
                  color: 'white',
                  borderRadius: '4px',
                  display: 'inline-block',
                  backgroundColor: getStatusColor(params.value),
                  padding: '4px 8px', }}>
          {params.value}
        </div>
      ),
    },
    {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    sortable: false,
    renderCell: (params) => (
    <IconButton
    color="primary"
    aria-label="delete"
    onClick={(e) => handleDelete(e, params.row._id)}
    >
    <DeleteIcon />
    </IconButton>
    ),
    },
    ];

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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={applications}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => handleRowClick(params.row)}
          disableSelectionOnClick
        />
        </div>
        <Dialog
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
          <DialogTitle>Delete Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirmationOpen(false)}
              sx={{
                bgcolor: 'black',
                color: 'white',
                ':hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirmed}
              sx={{
                bgcolor: 'lightgray',
                color: 'red',
                ':hover': {
                  backgroundColor: 'rgba(128, 128, 128, 0.7)',
                },
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default TrackApplications;

