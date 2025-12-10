import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Fade,
  Grow,
  Card,
  CardContent,
  Chip,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

function LeadDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [postingNote, setPostingNote] = useState(false);

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getInitials = (name = '') => {
    if (!name) return 'LD';
    return name
      .split(' ')
      .map((n) => n[0] || '')
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name = '') => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    const code = (name && name.charCodeAt(0)) || 0;
    return colors[code % colors.length];
  };

  const getStatusColor = (status) => {
    const map = {
      New: 'primary',
      Contacted: 'info',
      'In Progress': 'warning',
      Converted: 'success',
      Lost: 'error',
    };
    return map[status] || 'default';
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setPostingNote(true);
      const updated = [...(lead.leadNotes || []), { text: newNote.trim(), date: new Date().toISOString() }];
      await axiosClient.put(`/leads/${id}`, { leadNotes: updated });
      setNewNote('');
      await fetchLead();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setPostingNote(false);
    }
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

  if (!lead) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
        <Navbar onMenuClick={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed rgba(0,0,0,0.1)',
            }}
          >
            <PersonIcon sx={{ fontSize: 80, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color="text.secondary" gutterBottom>
              Lead not found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The lead you're looking for doesn't exist or may have been removed.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/leads')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 4,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Back to Leads
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8, width: '100%' }}>
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
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                },
              }}
            >
              Back to Leads
            </Button>

            {/* Main Card */}
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
                {/* Header Section with Gradient */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: { xs: 3, sm: 4, md: 5 },
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '300px',
                      height: '300px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '50%',
                      transform: 'translate(50%, -50%)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3, position: 'relative', zIndex: 1 }}>
                    <Avatar
                      sx={{
                        width: { xs: 100, sm: 120, md: 140 },
                        height: { xs: 100, sm: 120, md: 140 },
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        fontWeight: 800,
                        border: '4px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        background: getAvatarColor(lead.name),
                      }}
                    >
                      {getInitials(lead.name)}
                    </Avatar>

                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{
                          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                          mb: 1,
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {lead.name}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
                        <Chip
                          icon={<CalendarTodayIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                          label={`Created ${new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.25)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                          }}
                        />
                        <Chip
                          label={lead.status || 'Unknown'}
                          color={getStatusColor(lead.status)}
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/leads/edit/${id}`)}
                        sx={{
                          mt: 2,
                          bgcolor: 'white',
                          color: '#667eea',
                          fontWeight: 700,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          py: 1.5,
                          px: 4,
                          borderRadius: 2.5,
                          textTransform: 'none',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.95)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 28px rgba(0,0,0,0.2)',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        Edit Lead
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Content Section */}
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    sx={{
                      mb: 3,
                      color: '#2d3748',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    Contact Information
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Email */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(102, 126, 234, 0.04)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                          borderColor: 'rgba(102, 126, 234, 0.2)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                          Email Address
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lead.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Phone */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(79, 172, 254, 0.04)',
                        border: '1px solid rgba(79, 172, 254, 0.1)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(79, 172, 254, 0.08)',
                          borderColor: 'rgba(79, 172, 254, 0.2)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                          {lead.phone || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Source / Company */}
                    {(lead.source || lead.company) && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'rgba(245, 87, 108, 0.04)',
                          border: '1px solid rgba(245, 87, 108, 0.1)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(245, 87, 108, 0.08)',
                            borderColor: 'rgba(245, 87, 108, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                          }}
                        >
                          <BusinessIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                            {lead.company ? 'Company' : 'Source'}
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lead.company || lead.source || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Address */}
                    {lead.address && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'rgba(67, 233, 123, 0.04)',
                          border: '1px solid rgba(67, 233, 123, 0.1)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(67, 233, 123, 0.08)',
                            borderColor: 'rgba(67, 233, 123, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)',
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                            Address
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                            {lead.address}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Notes */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(250, 112, 154, 0.04)',
                        border: '1px solid rgba(250, 112, 154, 0.1)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(250, 112, 154, 0.08)',
                          borderColor: 'rgba(250, 112, 154, 0.2)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)',
                          }}
                        >
                          <NotesIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                          Notes
                        </Typography>
                      </Box>

                      {/* Add Note */}
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || postingNote}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            py: 1,
                            px: 3,
                          }}
                        >
                          {postingNote ? 'Adding...' : 'Add Note'}
                        </Button>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {lead.leadNotes && lead.leadNotes.length > 0 ? (
                        <List>
                          {lead.leadNotes.slice().reverse().map((note, index) => (
                            <ListItem key={index} sx={{ bgcolor: '#fff', mb: 1, borderRadius: 1 }}>
                              <ListItemText
                                primary={note.text}
                                secondary={new Date(note.date).toLocaleString()}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">No notes yet</Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default LeadDetails;
