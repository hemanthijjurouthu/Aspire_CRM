import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  Alert,
  Fade,
  Grow,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CustomerAdd() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/customers', formData);
      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer. Please try again.');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          mt: 8,
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Header Section with Blue Background */}
        <Fade in timeout={800}>
          <Box 
            sx={{ 
              mt: 6,
              mb: 4,
              p: { xs: 3, md: 5 },
              background: '#007BFF', // blue background
              borderRadius: 4,
              color: 'white',
              boxShadow: '0 20px 60px rgba(0, 123, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-20%, 20%)',
              },
            }}
          >
            <Box
              sx={{
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'white' }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                  mb: 1,
                  letterSpacing: '-0.5px',
                }}
              >
                Add New Customer
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1.05rem' }}>
                Fill in the details below to create a new customer record
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Form Section */}
        <Grow in timeout={1000}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 5, md: 6 },
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              background: 'linear-gradient(to bottom, #ffffff 0%, #fafbff 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              },
            }}
          >
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    border: '1px solid rgba(211, 47, 47, 0.2)',
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="#1a202c" sx={{ mb: 0.5 }}>
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basic contact details and identification
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.15)' }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Information */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(245, 87, 108, 0.3)',
                    }}
                  >
                    <LocationOnIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="#1a202c" sx={{ mb: 0.5 }}>
                      Additional Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location and supplementary details
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4, borderColor: 'rgba(245, 87, 108, 0.15)' }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: '#f5576c' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any additional notes or comments about this customer..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <NotesIcon sx={{ color: '#f5576c' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'flex-end',
                  pt: 4,
                  borderTop: '2px solid rgba(0,0,0,0.06)',
                }}
              >
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/customers')}
                  startIcon={<ArrowBackIcon />}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Create Customer
                </Button>
              </Box>
            </form>
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
}

export default CustomerAdd;
