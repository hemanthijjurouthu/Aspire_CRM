import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Fade, // <-- Import Fade for animation
} from '@mui/material';
import {
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon, // Icon for Admin header
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// --- STYLING CONSTANTS ---
const PRIMARY_COLOR = '#1976d2'; // MUI primary blue
const BACKGROUND_COLOR = '#f4f7f9'; // Light background for the main content
const HEADER_BG = '#e3f2fd'; // Light blue for header background

function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false); // New state for animation
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    
    // Trigger the content fade-in animation after a short delay
    const animationTimer = setTimeout(() => {
        setContentLoaded(true);
    }, 200);

    return () => clearTimeout(animationTimer);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch users', {
        variant: 'error',
      });
    } finally {
        // Delay setting loading to false slightly to allow the animation to catch up
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({ name: '', email: '', password: '', role: 'agent' });
    setErrors({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', email: '', password: '', role: 'agent' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCreateUser = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await axiosClient.post('/users', formData);
      enqueueSnackbar('User created successfully', { variant: 'success' });
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create user', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axiosClient.put(`/users/${userId}/status`, { isActive: !currentStatus });
      enqueueSnackbar(
        `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        { variant: 'success' }
      );
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update user status', {
        variant: 'error',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosClient.delete(`/users/${userId}`);
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete user', {
        variant: 'error',
      });
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: BACKGROUND_COLOR, minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box 
        component="main" 
        sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 }, 
            mt: 8, 
            width: { xs: '100%', md: 'auto' } 
        }}
      >
        
        {/* --- Header Section --- */}
        <Box 
            sx={{ 
                mb: { xs: 3, sm: 4 }, 
                p: { xs: 2, sm: 3 }, 
                bgcolor: HEADER_BG, 
                borderRadius: 2,
                borderLeft: `5px solid ${PRIMARY_COLOR}`,
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminIcon color="primary" sx={{ fontSize: { xs: 30, sm: 36 } }} />
            <Typography variant="h4" fontWeight="700" color="primary.dark" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
              User Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ 
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                fontWeight: 600,
            }}
          >
            Create New User
          </Button>
        </Box>

        {/* --- Content Area (Animated) --- */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : (
            <Fade in={!loading} timeout={800}>
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        overflowX: 'auto', 
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)',
                    }}
                >
                    <Table sx={{ minWidth: { xs: 500, sm: 800 } }}>
                    <TableHead sx={{ bgcolor: BACKGROUND_COLOR }}>
                        <TableRow>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Role</TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Created At</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#757575' }}>
                            No users found. Click 'Create New User' to add one.
                            </TableCell>
                        </TableRow>
                        ) : (
                        users.map((user) => (
                            <TableRow 
                                key={user._id}
                                sx={{ 
                                    '&:hover': { bgcolor: '#f5f5f5' },
                                    transition: 'background-color 0.3s',
                                }}
                            >
                            <TableCell sx={{ fontSize: '0.875rem' }}>{user.name}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: '0.875rem' }}>{user.email}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                                <Chip
                                label={user.role.toUpperCase()}
                                color={user.role === 'admin' ? 'secondary' : 'default'}
                                size="small"
                                sx={{ 
                                    fontWeight: 600,
                                    bgcolor: user.role === 'admin' ? '#f3e5f5' : '#e0e0e0', // Light purple for admin, grey for agent
                                    color: user.role === 'admin' ? '#9c27b0' : '#424242',
                                }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                                <Chip
                                label={user.isActive ? 'Active' : 'Inactive'}
                                color={user.isActive ? 'success' : 'error'}
                                size="small"
                                sx={{ 
                                    fontWeight: 600,
                                    bgcolor: user.isActive ? '#e8f5e9' : '#ffebee', // Lighter green/red
                                    color: user.isActive ? '#388e3c' : '#d32f2f',
                                }}
                                />
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: '0.875rem', color: '#757575' }}>
                                {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
                                <IconButton
                                    size="small"
                                    color={user.isActive ? 'warning' : 'success'}
                                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                                    title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                    sx={{ 
                                        padding: { xs: '6px', sm: '8px' },
                                        bgcolor: user.isActive ? '#fff3e0' : '#e8f5e9', // Light backgrounds for buttons
                                        '&:hover': {
                                            bgcolor: user.isActive ? '#ffe0b2' : '#c8e6c9',
                                        }
                                    }}
                                >
                                    {user.isActive ? <BlockIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} /> : <CheckCircleIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />}
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteUser(user._id)}
                                    title="Delete User"
                                    sx={{ 
                                        padding: { xs: '6px', sm: '8px' },
                                        bgcolor: '#ffebee',
                                        '&:hover': {
                                            bgcolor: '#ffcdd2',
                                        }
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                                </IconButton>
                                </Box>
                            </TableCell>
                            </TableRow>
                        ))
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Fade>
        )}

        {/* Create User Dialog (No change in functionality, only styling inherited from MUI) */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>Create New User</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              disabled={submitting}
            />
            <FormControl fullWidth margin="normal" disabled={submitting}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #eee', pt: 2 }}>
            <Button onClick={handleCloseDialog} disabled={submitting} sx={{ color: '#757575' }}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              variant="contained"
              disabled={submitting}
              sx={{ fontWeight: 600 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Users;