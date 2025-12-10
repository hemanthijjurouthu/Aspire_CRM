import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TodayIcon from '@mui/icons-material/Today';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// --- STYLING CONSTANTS ---
const BLUE_PALETTE = {
  primary: '#1976d2', // Dark Blue
  secondary: '#42a5f5', // Medium Blue
  accent: '#00bcd4', // Cyan/Light Blue for highlights
  success: '#4caf50', // Standard Green for success (conversion rate)
  error: '#f44336', // Standard Red for errors/lost leads
  background: '#e3f2fd', // Lightest Blue background
  cardBg: 'white',
};

// INCREASED LEFT PADDING for medium and large screens
const CARD_SECTION_PADDING_LEFT = { xs: 0, sm: 0, md: 4, lg: '9vw' }; 

// Lead Status Colors (Blue-Focused)
const getStatusColor = (status) => {
  const colors = {
    New: '#2196f3', // Blue
    Contacted: '#00bcd4', // Cyan
    'In Progress': '#ff9800', // Orange (Kept for process visibility)
    Converted: BLUE_PALETTE.success, // Green
    Lost: BLUE_PALETTE.error, // Red
  };
  return colors[status] || '#757575';
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: LeaderboardIcon,
      color: BLUE_PALETTE.primary,
      bgColor: '#e3f2fd',
      subtitle: 'All leads in pipeline',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: PeopleIcon,
      color: BLUE_PALETTE.success,
      bgColor: '#e8f5e9',
      subtitle: 'Active customers',
    },
    {
      title: 'Converted Leads',
      value: stats?.convertedLeads || 0,
      icon: TrendingUpIcon,
      color: BLUE_PALETTE.secondary,
      bgColor: '#e1f5fe',
      subtitle: 'Successfully closed',
    },
    {
      title: "Today's Leads",
      value: stats?.todayLeads || 0,
      icon: TodayIcon,
      color: BLUE_PALETTE.accent,
      bgColor: '#e0f7fa',
      subtitle: 'New today',
    },
  ];

  const calculateConversionRate = () => {
    const total = stats?.totalLeads || 0;
    const converted = stats?.convertedLeads || 0;
    return total > 0 ? Math.round((converted / total) * 100) : 0;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f7f9', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8 }}>
        
        {/* --- 1. Header with Blue Gradient --- */}
        <Box 
          sx={{ 
            mb: { xs: 3, sm: 4, md: 5 },
            p: { xs: 3, sm: 4, md: 5 },
            background: `linear-gradient(135deg, ${BLUE_PALETTE.primary} 0%, ${BLUE_PALETTE.secondary} 100%)`,
            borderRadius: { xs: 2, md: 3 },
            color: 'white',
            boxShadow: `0 10px 30px ${BLUE_PALETTE.primary}40`,
            transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
            🚀 Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Welcome back, **{user.name || 'User'}**! Here's your CRM performance at a glance.
          </Typography>
        </Box>

        {/* --- 2. Stats Cards (APPLIED INCREASED PADDING LEFT) --- */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : (
          <>
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3, md: 4 }} 
              sx={{ 
                mb: { xs: 3, sm: 4, md: 5 }, 
                pl: CARD_SECTION_PADDING_LEFT, // APPLIED INCREASED LEFT PADDING
              }} 
            >
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                const isConversionCard = index === 2;
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        background: BLUE_PALETTE.cardBg,
                        borderRadius: { xs: 2, md: 3 },
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                          transition: 'height 0.3s ease-in-out',
                        },
                        '&:hover': {
                          transform: { xs: 'none', md: 'translateY(-10px)' },
                          boxShadow: { xs: 'none', md: `0 18px 45px ${stat.color}40` },
                          border: `1px solid ${stat.color}40`,
                          '&::before': {
                            height: '8px',
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: { xs: 2, md: 3 } }}>
                          <Avatar
                            sx={{
                              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                              color: 'white',
                              width: { xs: 48, sm: 56, md: 64 },
                              height: { xs: 48, sm: 56, md: 64 },
                              boxShadow: `0 8px 16px ${stat.color}40`,
                            }}
                          >
                            <IconComponent sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                          </Avatar>
                          {isConversionCard && (
                            <Chip
                              icon={<ArrowUpwardIcon sx={{ fontSize: 16 }} />}
                              label={`${calculateConversionRate()}%`}
                              size="small"
                              sx={{ 
                                background: `linear-gradient(135deg, ${BLUE_PALETTE.success}, ${BLUE_PALETTE.success}dd)`,
                                color: 'white',
                                fontWeight: 700,
                                boxShadow: `0 4px 12px ${BLUE_PALETTE.success}30`,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#1a202c', letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5, color: '#2d3748', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {stat.subtitle}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* --- 3. Charts and Details (APPLIED INCREASED PADDING LEFT) --- */}
            <Grid 
              container 
              spacing={{ xs: 3, sm: 4, md: 5 }}
              sx={{ pl: CARD_SECTION_PADDING_LEFT }} // APPLIED INCREASED LEFT PADDING
            >
              {/* Leads by Status */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 3, sm: 4, md: 5 },
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: { xs: 2, md: 3 },
                    background: BLUE_PALETTE.cardBg,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: { xs: 'none', md: '0 10px 40px rgba(0,0,0,0.15)' },
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${BLUE_PALETTE.primary}, ${BLUE_PALETTE.secondary})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${BLUE_PALETTE.primary}30`,
                      }}
                    >
                      <LeaderboardIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                      Leads Pipeline Status
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 3, md: 4 } }} />
                  {stats?.leadsByStatus && Object.keys(stats.leadsByStatus).length > 0 ? (
                    <Box>
                      {Object.entries(stats.leadsByStatus).map(([status, count]) => {
                        const total = stats?.totalLeads || 1;
                        const percentage = Math.round((count / total) * 100);
                        const statusColor = getStatusColor(status);
                        return (
                          <Box 
                            key={status} 
                            sx={{ 
                              mb: { xs: 2.5, md: 3 },
                              p: { xs: 1.5, md: 2 },
                              borderRadius: 2,
                              bgcolor: '#f8f9fc',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              borderLeft: `5px solid ${statusColor}00`,
                              '&:hover': {
                                bgcolor: '#f1f3f9',
                                transform: { xs: 'none', md: 'translateX(6px)' },
                                borderLeft: `5px solid ${statusColor}`,
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1, md: 1.5 }, flexWrap: 'wrap', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: statusColor,
                                    boxShadow: `0 2px 8px ${statusColor}40`,
                                  }}
                                />
                                <Typography variant="body1" fontWeight="600" sx={{ color: '#2d3748', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  {status}
                                </Typography>
                              </Box>
                              <Chip
                                label={`${count} (${percentage}%)`}
                                size="small"
                                sx={{ 
                                  fontWeight: 700,
                                  bgcolor: 'white',
                                  border: `1px solid ${statusColor}30`,
                                  color: statusColor,
                                }}
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: { xs: 8, md: 10 },
                                borderRadius: 5,
                                bgcolor: '#e2e8f0',
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, ${statusColor}, ${statusColor}dd)`,
                                  borderRadius: 5,
                                  boxShadow: `0 2px 8px ${statusColor}40`,
                                  transition: 'transform 0.5s ease-out',
                                },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No leads data available</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 3, sm: 4, md: 5 },
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: { xs: 2, md: 3 },
                    background: BLUE_PALETTE.cardBg,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: { xs: 'none', md: '0 10px 40px rgba(0,0,0,0.15)' },
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${BLUE_PALETTE.accent}, ${BLUE_PALETTE.accent}aa)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${BLUE_PALETTE.accent}30`,
                      }}
                    >
                      <TodayIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                      Today's Key Metrics
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 3, md: 4 } }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                    {/* Today's Leads */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 2, md: 3 },
                        p: { xs: 2, md: 3 },
                        background: '#e3f2fd',
                        borderRadius: 2.5,
                        border: `2px solid ${BLUE_PALETTE.primary}20`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: { xs: 'none', md: 'scale(1.03)' },
                          boxShadow: { xs: 'none', md: `0 8px 24px ${BLUE_PALETTE.primary}20` },
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        background: `linear-gradient(135deg, ${BLUE_PALETTE.primary}, ${BLUE_PALETTE.secondary})`,
                        width: { xs: 48, md: 56 }, 
                        height: { xs: 48, md: 56 },
                        boxShadow: `0 4px 12px ${BLUE_PALETTE.primary}40`,
                      }}>
                        <TodayIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" fontWeight="800" color={BLUE_PALETTE.primary} sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                          {stats?.todayLeads || 0}
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#1565c0', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          New Leads Created Today
                        </Typography>
                      </Box>
                    </Box>

                    {/* Today's Customers */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 2, md: 3 },
                        p: { xs: 2, md: 3 },
                        background: '#e8f5e9',
                        borderRadius: 2.5,
                        border: `2px solid ${BLUE_PALETTE.success}20`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: { xs: 'none', md: 'scale(1.03)' },
                          boxShadow: { xs: 'none', md: `0 8px 24px ${BLUE_PALETTE.success}20` },
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        background: `linear-gradient(135deg, ${BLUE_PALETTE.success}, ${BLUE_PALETTE.success}dd)`,
                        width: { xs: 48, md: 56 }, 
                        height: { xs: 48, md: 56 },
                        boxShadow: `0 4px 12px ${BLUE_PALETTE.success}40`,
                      }}>
                        <PeopleIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" fontWeight="800" color={BLUE_PALETTE.success} sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                          {stats?.todayCustomers || 0}
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#2e7d32', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          New Customers Added Today
                        </Typography>
                      </Box>
                    </Box>

                    {/* Conversion Rate */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 2, md: 3 },
                        p: { xs: 2, md: 3 },
                        background: '#e1f5fe',
                        borderRadius: 2.5,
                        border: `2px solid ${BLUE_PALETTE.accent}20`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: { xs: 'none', md: 'scale(1.03)' },
                          boxShadow: { xs: 'none', md: `0 8px 24px ${BLUE_PALETTE.accent}20` },
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        background: `linear-gradient(135deg, ${BLUE_PALETTE.secondary}, ${BLUE_PALETTE.accent})`,
                        width: { xs: 48, md: 56 }, 
                        height: { xs: 48, md: 56 },
                        boxShadow: `0 4px 12px ${BLUE_PALETTE.secondary}40`,
                      }}>
                        <TrendingUpIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" fontWeight="800" color={BLUE_PALETTE.secondary} sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                          {calculateConversionRate()}%
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#01579b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Conversion Rate
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* --- 4. Admin-only: User Performance Statistics (APPLIED INCREASED PADDING LEFT) --- */}
            {isAdmin && stats?.userStats && stats.userStats.length > 0 && (
              <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
                <Box sx={{ 
                    mb: { xs: 3, md: 4 }, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1.5, md: 2 },
                    pl: CARD_SECTION_PADDING_LEFT, // APPLIED INCREASED LEFT PADDING TO HEADER
                }}>
                  <Box
                    sx={{
                      width: { xs: 40, md: 48 },
                      height: { xs: 40, md: 48 },
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${BLUE_PALETTE.accent} 0%, ${BLUE_PALETTE.primary} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${BLUE_PALETTE.accent}30`,
                    }}
                  >
                    <PeopleIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                  </Box>
                  <Typography variant="h5" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Agent Performance (Admin View)
                  </Typography>
                </Box>
                <Grid 
                  container 
                  spacing={{ xs: 2, sm: 3, md: 4 }}
                  sx={{ pl: CARD_SECTION_PADDING_LEFT }} // APPLIED INCREASED LEFT PADDING
                >
                  {stats.userStats.map((userStat) => (
                    <Grid item xs={12} md={6} lg={4} key={userStat._id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 2.5, sm: 3, md: 3.5 },
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: { xs: 2, md: 3 },
                          height: '100%',
                          background: BLUE_PALETTE.cardBg,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: { xs: 'none', md: 'translateY(-6px)' },
                            boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.15)' },
                            border: `1px solid ${BLUE_PALETTE.primary}40`,
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
                          <Avatar sx={{ 
                            background: `linear-gradient(135deg, ${BLUE_PALETTE.primary}, ${BLUE_PALETTE.secondary})`,
                            width: { xs: 48, md: 56 }, 
                            height: { xs: 48, md: 56 },
                            fontSize: { xs: 20, md: 24 },
                            fontWeight: 700,
                            boxShadow: `0 4px 12px ${BLUE_PALETTE.primary}40`,
                          }}>
                            {userStat.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                              {userStat.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {userStat.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ mb: { xs: 2, md: 3 } }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: { xs: 1.5, md: 2 },
                              borderRadius: 2,
                              bgcolor: '#f8f9fc',
                            }}
                          >
                            <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Total Leads
                            </Typography>
                            <Typography variant="h5" fontWeight="800" sx={{ color: BLUE_PALETTE.primary, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                              {userStat.totalLeads}
                            </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: { xs: 1.5, md: 2 },
                              borderRadius: 2,
                              bgcolor: '#f0fdf4',
                            }}
                          >
                            <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Converted Leads
                            </Typography>
                            <Typography variant="h5" fontWeight="800" sx={{ color: BLUE_PALETTE.success, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                              {userStat.convertedLeads}
                            </Typography>
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1, md: 1.5 } }}>
                              <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Conversion Rate
                              </Typography>
                              <Typography variant="h6" fontWeight="800" sx={{ color: '#2d3748', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                                {userStat.conversionRate.toFixed(1)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={userStat.conversionRate}
                              sx={{
                                height: { xs: 8, md: 10 },
                                borderRadius: 5,
                                bgcolor: '#e2e8f0',
                                '& .MuiLinearProgress-bar': {
                                  background: userStat.conversionRate > 50 
                                    ? 'linear-gradient(90deg, #16a34a, #22c55e)' 
                                    : userStat.conversionRate > 25 
                                    ? 'linear-gradient(90deg, #ea580c, #f97316)' 
                                    : 'linear-gradient(90deg, #dc2626, #ef4444)',
                                  borderRadius: 5,
                                  boxShadow: userStat.conversionRate > 50 
                                    ? '0 2px 8px rgba(22, 163, 74, 0.4)'
                                    : userStat.conversionRate > 25
                                    ? '0 2px 8px rgba(234, 88, 12, 0.4)'
                                    : '0 2px 8px rgba(220, 38, 38, 0.4)',
                                  transition: 'transform 0.5s ease-out',
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;