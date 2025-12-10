import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  alpha,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';

const drawerWidth = 260;

function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#4a90e2' },
    { text: 'Leads', icon: <LeaderboardIcon />, path: '/leads', color: '#f59e0b' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers', color: '#10b981' },
  ];

  const adminMenuItems = [
    { text: 'User Management', icon: <ManageAccountsIcon />, path: '/users', color: '#8b5cf6' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Toolbar sx={{ minHeight: { xs: 60, sm: 70 } }} />
      
      {/* Main Navigation Section */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            color: '#64748b', 
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
          }}
        >
          MAIN MENU
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile && onMobileClose) onMobileClose();
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    minHeight: 48,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&.Mui-selected': {
                      backgroundColor: alpha(item.color, 0.12),
                      color: item.color,
                      '&:hover': {
                        backgroundColor: alpha(item.color, 0.18),
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '70%',
                        backgroundColor: item.color,
                        borderRadius: '0 4px 4px 0',
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(item.color, 0.08),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: isSelected ? item.color : '#64748b',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '0.9375rem',
                      color: isSelected ? item.color : '#1e293b',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {/* Admin Section */}
      {isAdmin && (
        <>
          <Divider sx={{ mx: 2, borderColor: alpha('#64748b', 0.12) }} />
          <Box sx={{ px: 2, py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 1 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}
              >
                ADMINISTRATION
              </Typography>
              <Chip 
                label="Admin" 
                size="small"
                icon={<AdminPanelSettingsIcon />}
                sx={{ 
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: alpha('#8b5cf6', 0.12),
                  color: '#8b5cf6',
                  '& .MuiChip-icon': {
                    fontSize: 14,
                    color: '#8b5cf6',
                  },
                }}
              />
            </Box>
            <List sx={{ mt: 1 }}>
              {adminMenuItems.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile && onMobileClose) onMobileClose();
                      }}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        minHeight: 48,
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&.Mui-selected': {
                          backgroundColor: alpha(item.color, 0.12),
                          color: item.color,
                          '&:hover': {
                            backgroundColor: alpha(item.color, 0.18),
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 4,
                            height: '70%',
                            backgroundColor: item.color,
                            borderRadius: '0 4px 4px 0',
                          },
                        },
                        '&:hover': {
                          backgroundColor: alpha(item.color, 0.08),
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 40,
                          color: isSelected ? item.color : '#64748b',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: '0.9375rem',
                          color: isSelected ? item.color : '#1e293b',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </>
      )}

      {/* Footer/Branding Section */}
      <Box sx={{ mt: 'auto', p: 2, mb: 2 }}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4a90e2 0%, #357ABD 100%)',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.25)',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 1.5,
            }}
          >
            <BusinessIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              fontSize: '0.875rem',
              mb: 0.5,
            }}
          >
          Aspire CRM
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: alpha('#fff', 0.8),
              fontSize: '0.7rem',
              display: 'block',
            }}
          >
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '4px 0 12px rgba(0,0,0,0.08)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${alpha('#64748b', 0.1)}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;