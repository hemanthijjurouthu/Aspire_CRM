import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grow,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

function Leads() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/leads');
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      enqueueSnackbar('Failed to fetch leads', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.source && lead.source.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredLeads(filtered);
  }, [searchQuery, leads]);

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/leads/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      enqueueSnackbar('Lead deleted successfully', { variant: 'success' });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      enqueueSnackbar('Failed to delete lead', { variant: 'error' });
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const getStatusColor = (status) => {
    const colors = {
      New: 'primary',
      Contacted: 'info',
      'In Progress': 'warning',
      Converted: 'success',
      Lost: 'error',
    };
    return colors[status] || 'default';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8, width: '100%' }}>
        {/* Header & Add Lead */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, letterSpacing: '-0.5px' }}>
                  Leads
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                  Manage and view all your leads
                </Typography>
              </Box>
              <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => navigate('/leads/add')} sx={{ width: { xs: '100%', sm: 'auto' }, borderRadius: 2.5, py: 1.5, px: 4, textTransform: 'none', fontSize: '1.05rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                Add Lead
              </Button>
            </Box>

            {/* Search */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
              <TextField
                fullWidth
                placeholder="Search leads by name, email, phone, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#667eea', fontSize: 28 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white', '& fieldset': { border: 'none' } } }}
              />
            </Paper>
          </Box>
        </Fade>

        {/* Leads Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
          </Box>
        ) : filteredLeads.length === 0 ? (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" fontWeight="600" color="text.secondary" gutterBottom>
              No leads found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first lead'}
            </Typography>
            {!searchQuery && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/leads/add')} sx={{ borderRadius: 2, py: 1.5, px: 4, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}>
                Add Your First Lead
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredLeads.map((lead, index) => (
              <Grow key={lead._id} in timeout={500 + index * 100}>
                <Grid item xs={12} sm={6} lg={4}>
                  <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)', borderColor: '#667eea' } }} onClick={() => navigate(`/leads/${lead._id}`)}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 64, height: 64, background: getAvatarColor(lead.name), fontSize: '1.5rem', fontWeight: 700, mr: 2 }}>
                          {getInitials(lead.name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lead.name}
                          </Typography>
                          <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" sx={{ fontSize: '0.75rem' }} />
                        </Box>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Email: {lead.email}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Phone: {lead.phone}</Typography>
                        {lead.source && <Typography variant="body2" color="text.secondary">Source: {lead.source}</Typography>}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" color="primary" onClick={() => navigate(`/leads/${lead._id}`)}>
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" color="info" onClick={() => navigate(`/leads/edit/${lead._id}`)}>
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: lead._id })}>
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}

        {/* Delete Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this lead?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, id: null })} disabled={loading}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Leads;