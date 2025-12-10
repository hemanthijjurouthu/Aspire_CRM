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
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import NotesIcon from '@mui/icons-material/Notes';
import SourceIcon from '@mui/icons-material/Share';

const statusOptions = ['New', 'Contacted', 'In Progress', 'Converted', 'Lost'];

function LeadEdit() {
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
    source: '',
    status: 'New',
    notes: '',
  });

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await axiosClient.get(`/leads/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch lead details', { variant: 'error' });
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
      await axiosClient.put(`/leads/${id}`, formData);
      enqueueSnackbar('Lead updated successfully!', { variant: 'success' });
      navigate('/leads');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to update lead', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // ----------- Loading Screen ----------
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

  // ----------- Main UI ----------
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
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <Fade in timeout={800}>
          <Box>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/leads')}
              sx={{
                mb: 3,
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(102,126,234,0.08)' },
              }}
            >
              Back to Leads
            </Button>

            {/* Page Title */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.6rem' },
                  background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Edit Lead
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                Update lead details and status
              </Typography>
            </Box>

            {/* FORM CARD */}
            <Grow in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
                    p: { xs: 3, sm: 4 },
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    Lead Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Modify lead information below
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                      {/* Name */}
                      <Field
                        label="Lead Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<PersonIcon sx={{ color: '#667eea' }} />}
                      />

                      {/* Email & Phone */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <Field
                          label="Email *"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          icon={<EmailIcon sx={{ color: '#4facfe' }} />}
                        />

                        <Field
                          label="Phone *"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          icon={<PhoneIcon sx={{ color: '#43e97b' }} />}
                        />
                      </Box>

                      {/* Source */}
                      <Field
                        label="Lead Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        icon={<SourceIcon sx={{ color: '#f5576c' }} />}
                      />

                      {/* Status */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                          Status
                        </Typography>
                        <TextField
                          fullWidth
                          select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessCenterIcon sx={{ color: '#feb019' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputStyles('#feb019')}
                        >
                          {statusOptions.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      {/* Notes */}
                      <Field
                        label="Notes"
                        name="notes"
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        icon={<NotesIcon sx={{ color: '#fa709a' }} />}
                      />

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                          sx={{
                            borderRadius: 2.5,
                            px: 5,
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg,#667eea,#764ba2)',
                          }}
                        >
                          Update Lead
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => navigate('/leads')}
                          sx={{
                            borderRadius: 2.5,
                            px: 5,
                            py: 1.5,
                            textTransform: 'none',
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

// ----------- Reusable Field Component ----------
function Field({ label, icon, ...props }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        {...props}
        InputProps={{
          startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
        }}
        sx={inputStyles(icon.props.sx.color)}
      />
    </Box>
  );
}

// ----------- Styled Input ----------
const inputStyles = (color) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    bgcolor: 'white',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)', borderWidth: 2 },
    '&:hover fieldset': { borderColor: color },
    '&.Mui-focused fieldset': { borderColor: color, borderWidth: 2 },
  },
});

export default LeadEdit;
