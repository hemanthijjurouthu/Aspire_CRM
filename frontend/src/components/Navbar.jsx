import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Badge,
  Tooltip,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import axiosClient from '../api/axiosClient';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      setUser(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEditOpen = () => {
    setEditDialog(true);
    handleMenuClose();
  };
  const handleEditClose = () => {
    setEditDialog(false);
    setFormData({ name: user?.name || '', email: user?.email || '' });
  };
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.put('/auth/update-profile', formData);
      setUser(response.data);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, sm: 70 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            onClick={onMenuClick}
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 2,
              color: 'white',
              '&:hover': { backgroundColor: alpha('#fff', 0.15) },
            }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <BusinessIcon sx={{ fontSize: 22, color: '#007BFF' }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: 'white',
                letterSpacing: '0.5px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Aspire CRM
            </Typography>
          </Box>

          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-end',
                mr: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}
              >
                {user?.name || 'User'}
              </Typography>
              <Chip
                label={isAdmin ? 'Admin' : 'Agent'}
                size="small"
                icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: alpha('#fff', 0.2),
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white', fontSize: 14 },
                }}
              />
            </Box>

            {/* Avatar */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  padding: 0,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s',
                }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <CheckCircleIcon
                      sx={{
                        width: 16,
                        height: 16,
                        color: '#10b981',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#007BFF',
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {getInitials(user?.name)}
                  </Avatar>
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Account Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            minWidth: 280,
            mt: 1.5,
            borderRadius: 2,
            overflow: 'visible',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2.5, py: 2, bgcolor: alpha('#007BFF', 0.05) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#007BFF', fontWeight: 700, fontSize: '1.1rem' }}>
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="700" sx={{ lineHeight: 1.3, color: '#1f2937' }}>
                {user?.name || 'User'}
              </Typography>
              <Chip
                label={isAdmin ? 'Administrator' : 'Sales Agent'}
                size="small"
                icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  mt: 0.5,
                  backgroundColor: isAdmin ? alpha('#007BFF', 0.15) : alpha('#0056b3', 0.15),
                  color: isAdmin ? '#007BFF' : '#0056b3',
                  '& .MuiChip-icon': { fontSize: 14 },
                }}
              />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            {user?.email || 'No email'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Menu Items */}
        <MenuItem sx={{ py: 1.5, px: 2.5, '&:hover': { backgroundColor: alpha('#007BFF', 0.05) } }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#007BFF' }} />
          </ListItemIcon>
          <Box>
            <Typography variant="body2" fontWeight="600" sx={{ color: '#1f2937' }}>
              Full Name
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.name || 'N/A'}
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem sx={{ py: 1.5, px: 2.5, '&:hover': { backgroundColor: alpha('#007BFF', 0.05) } }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" sx={{ color: '#007BFF' }} />
          </ListItemIcon>
          <Box>
            <Typography variant="body2" fontWeight="600" sx={{ color: '#1f2937' }}>
              Email Address
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'N/A'}
            </Typography>
          </Box>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleEditOpen} sx={{ py: 1.5, px: 2.5, '&:hover': { backgroundColor: alpha('#007BFF', 0.05) } }}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#007BFF' }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="600">Edit Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            '&:hover': {
              backgroundColor: alpha('#ef4444', 0.05),
              '& .MuiListItemIcon-root': { color: '#ef4444' },
              '& .MuiTypography-root': { color: '#ef4444' },
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#64748b' }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#64748b' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialog}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' } }}
      >
        <DialogTitle sx={{ pb: 1, fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ color: '#007BFF' }} />
            Edit Profile
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{ startAdornment: <PersonIcon sx={{ color: '#007BFF', mr: 1, ml: 0.5 }} /> }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007BFF', borderWidth: 2 },
                '&.Mui-focused fieldset': { borderColor: '#007BFF', borderWidth: 2 },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{ startAdornment: <EmailIcon sx={{ color: '#007BFF', mr: 1, ml: 0.5 }} /> }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#007BFF', borderWidth: 2 },
                '&.Mui-focused fieldset': { borderColor: '#007BFF', borderWidth: 2 },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={handleEditClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#d1d5db',
              color: '#64748b',
              '&:hover': { borderColor: '#9ca3af', backgroundColor: alpha('#000', 0.02) },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
              boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #0056b3 0%, #007BFF 100%)', boxShadow: '0 6px 16px rgba(0,123,255,0.4)' },
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
