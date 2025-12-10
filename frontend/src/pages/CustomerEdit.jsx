import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Fade,
  Grow,
  InputAdornment,
  Card,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';

function CustomerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axiosClient.get(`/customers/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      enqueueSnackbar('Failed to fetch customer details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosClient.put(`/customers/${id}`, formData);
      enqueueSnackbar('Customer updated successfully!', { variant: 'success' });
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      enqueueSnackbar('Failed to update customer', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
        <Navbar onMenuClick={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
        <Fade in timeout={800}>
          <Box>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/customers')}
              sx={{
                mb: 3,
                color: '#667eea',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                },
              }}
            >
              Back to Customers
            </Button>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                fontWeight="800"
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: '-0.5px',
                }}
              >
                Edit Customer
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                Update customer information and details
              </Typography>
            </Box>

            {/* Form Card */}
            <Grow in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: { xs: 3, sm: 4 },
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Customer Details
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                    Fill in the information below to update this customer
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Name Field */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                          Full Name *
                        </Typography>
                        <TextField
                          fullWidth
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter customer's full name"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#667eea', fontSize: 22 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              bgcolor: 'white',
                              transition: 'all 0.3s',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#667eea',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Email and Phone Row */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {/* Email Field */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                            Email Address *
                          </Typography>
                          <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="customer@example.com"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: '#4facfe', fontSize: 22 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2.5,
                                bgcolor: 'white',
                                transition: 'all 0.3s',
                                '& fieldset': {
                                  borderColor: 'rgba(0,0,0,0.1)',
                                  borderWidth: '2px',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#4facfe',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#4facfe',
                                  borderWidth: '2px',
                                },
                              },
                            }}
                          />
                        </Box>

                        {/* Phone Field */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                            Phone Number *
                          </Typography>
                          <TextField
                            fullWidth
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1 (555) 123-4567"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: '#43e97b', fontSize: 22 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2.5,
                                bgcolor: 'white',
                                transition: 'all 0.3s',
                                '& fieldset': {
                                  borderColor: 'rgba(0,0,0,0.1)',
                                  borderWidth: '2px',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#43e97b',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#43e97b',
                                  borderWidth: '2px',
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Company Field */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                          Company
                        </Typography>
                        <TextField
                          fullWidth
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Company name (optional)"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessIcon sx={{ color: '#f5576c', fontSize: 22 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              bgcolor: 'white',
                              transition: 'all 0.3s',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f5576c',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f5576c',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Address Field */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                          Address
                        </Typography>
                        <TextField
                          fullWidth
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address, city, state, ZIP code"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon sx={{ color: '#feb019', fontSize: 22 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              bgcolor: 'white',
                              transition: 'all 0.3s',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#feb019',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#feb019',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Notes Field */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#2d3748', fontSize: '0.9rem' }}>
                          Notes
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Additional notes or comments about this customer..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                <NotesIcon sx={{ color: '#fa709a', fontSize: 22 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              bgcolor: 'white',
                              transition: 'all 0.3s',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#fa709a',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fa709a',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Action Buttons */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2,
                          pt: 2,
                          borderTop: '2px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                          sx={{
                            flex: { xs: '1', sm: '0 1 auto' },
                            borderRadius: 2.5,
                            py: 1.5,
                            px: 5,
                            textTransform: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f92 100%)',
                              boxShadow: '0 12px 30px rgba(102, 126, 234, 0.5)',
                              transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                              background: 'linear-gradient(135deg, #a0a0a0 0%, #808080 100%)',
                            },
                          }}
                        >
                          {saving ? 'Updating...' : 'Update Customer'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/customers')}
                          disabled={saving}
                          sx={{
                            flex: { xs: '1', sm: '0 1 auto' },
                            borderRadius: 2.5,
                            py: 1.5,
                            px: 5,
                            textTransform: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            borderWidth: '2px',
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderWidth: '2px',
                              borderColor: '#5568d3',
                              bgcolor: 'rgba(102, 126, 234, 0.08)',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Box>
              </Card>
            </Grow>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default CustomerEdit;