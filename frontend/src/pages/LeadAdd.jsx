import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
  Divider,
  Fade,
  Grow,
  InputAdornment,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SourceIcon from '@mui/icons-material/TrendingUp';
import FlagIcon from '@mui/icons-material/Flag';
import NotesIcon from '@mui/icons-material/Notes';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const statusOptions = ['New', 'Contacted', 'In Progress', 'Converted', 'Lost'];

function LeadAdd() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/leads', formData);
      enqueueSnackbar('Lead created successfully!', { variant: 'success' });
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      const message = error.response?.data?.message || 'Failed to create lead';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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
        {/* Animated Header Section */}
        <Fade in timeout={800}>
          <Box 
            sx={{ 
              mt: { xs: 4, sm: 6, md: 8 }, // Responsive top margin
              mb: 4,
              p: { xs: 3, md: 5 },
              background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
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
              <LeaderboardIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'white' }} />
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
                Add New Lead
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1.05rem' }}>
                Capture potential customer information and track their journey
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
                background: 'linear-gradient(90deg, #007BFF 0%, #0056b3 50%, #00d4ff 100%)',
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Lead Information Section */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="#1a202c" sx={{ mb: 0.5 }}>
                      Lead Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basic contact details and lead source
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 123, 255, 0.15)' }} />

                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#007BFF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'white' } }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#007BFF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'white' } }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#007BFF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'white' } }}
                    />
                  </Grid>

                  {/* Source */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="e.g., Website, Referral, Social Media"
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SourceIcon sx={{ color: '#007BFF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'white' } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Status & Notes Section */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)',
                    }}
                  >
                    <FlagIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="#1a202c" sx={{ mb: 0.5 }}>
                      Status & Additional Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track lead progress and add relevant notes
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 4, borderColor: 'rgba(40, 167, 69, 0.15)' }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlagIcon sx={{ color: '#28a745' }} />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      placeholder="Add any additional notes or comments about this lead..."
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <NotesIcon sx={{ color: '#28a745' }} />
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
                  onClick={() => navigate('/leads')}
                  disabled={loading}
                  startIcon={<ArrowBackIcon />}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                >
                  {loading ? 'Creating...' : 'Create Lead'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
}

export default LeadAdd;
