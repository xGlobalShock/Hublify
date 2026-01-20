import React, { useState, useEffect } from 'react';
import '../styles/ProfileSetup.css';
import LightRays from '../effects/LightRays';
import Lightning from '../effects/Lightning';
import Hyperspeed from '../effects/Hyperspeed';
import LiquidEther from '../effects/LiquidEther';
import FloatingLines from '../effects/FloatingLines';
import Galaxy from '../effects/Galaxy';
import ColorBends from '../effects/ColorBends';
import Plasma from '../effects/Plasma';
import Aurora from '../effects/Aurora';
import Prism from '../effects/Prism';
import DarkVeil from '../effects/DarkVeil';
import LightPillar from '../effects/LightPillar';
import Iridescence from '../effects/Iridescence';
import LiquidChrome from '../effects/LiquidChrome';

const GENDER_OPTIONS = [
  { id: 'he-him', label: 'He/Him' },
  { id: 'she-her', label: 'She/Her' },
  { id: 'they-them', label: 'They/Them' },
  { id: 'prefer-not', label: 'Prefer Not to Say' }
];

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen'
];

/**
 * ProfileSetup: Multi-step onboarding form
 * Collects: name, gender, country, description, profile links
 */
function ProfileSetup({ currentUser, onSetupComplete }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    country: '',
    description: '',
    profileLinks: {
      github: '',
      twitter: '',
      portfolio: ''
    },
    background: 'floatinglines',
    streamSchedule: [],
    streamers: []
  });

  // Country search
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Streaming schedule form
  const [scheduleForm, setScheduleForm] = useState({
    day: '1',
    time: '20:00',
    game: 'Just Chatting',
    timezone: 'UTC+0'
  });
  
  // Streamer form
  const [streamerInput, setStreamerInput] = useState('');
  
  // BACKGROUNDS data with components
  const BACKGROUNDS = [
    { id: 'lightrays-white', label: 'Light Rays (White)', component: LightRays, props: { raysColor: '#ffffff' } },
    { id: 'lightrays-blue', label: 'Light Rays (Blue)', component: LightRays, props: { raysColor: '#0099ff', saturation: 1.8, lightSpread: 1.5, rayLength: 3, fadeDistance: 0.6 } },
    { id: 'lightning', label: 'Lightning', component: Lightning },
    { id: 'hyperspeed', label: 'Hyperspeed', component: Hyperspeed },
    { id: 'liquidether', label: 'Liquid Ether', component: LiquidEther },
    { id: 'floatinglines', label: 'Floating Lines', component: FloatingLines },
    { id: 'galaxy', label: 'Galaxy', component: Galaxy },
    { id: 'colorbends', label: 'Color Bends', component: ColorBends },
    { id: 'plasma', label: 'Plasma', component: Plasma },
    { id: 'aurora', label: 'Aurora', component: Aurora },
    { id: 'prism', label: 'Prism', component: Prism },
    { id: 'darkveil', label: 'Dark Veil', component: DarkVeil },
    { id: 'lightpillar', label: 'Light Pillar', component: LightPillar, props: { topColor: '#FF9FFC', bottomColor: '#5227FF', intensity: 1.0, rotationSpeed: 0.0, glowAmount: 0.002, pillarWidth: 3.0, pillarHeight: 0.4, noiseIntensity: 0 } },
    { id: 'iridescence', label: 'Iridescence', component: Iridescence, props: { color: [1, 1, 1], mouseReact: false, amplitude: 0.1, speed: 1.0 } },
    { id: 'liquidchrome', label: 'Liquid Chrome', component: LiquidChrome, props: { baseColor: [0.1, 0.1, 0.1], speed: 0.2, amplitude: 0.3, interactive: false } }
  ];
  
  const DAYS_OF_WEEK = [
    { day: '1', label: 'Monday' },
    { day: '2', label: 'Tuesday' },
    { day: '3', label: 'Wednesday' },
    { day: '4', label: 'Thursday' },
    { day: '5', label: 'Friday' },
    { day: '6', label: 'Saturday' },
    { day: '7', label: 'Sunday' }
  ];
  
  const GAMES = [
    'Apex Legends', 'Valorant', 'League of Legends', 'Counter-Strike 2', 'Dota 2',
    'Fortnite', 'Call of Duty', 'Minecraft', 'Just Chatting', 'IRL', 'Other'
  ];

  // Background pagination state
  const [backgroundPage, setBackgroundPage] = useState(0);
  const BACKGROUNDS_PER_PAGE = 6;
  const totalBackgroundPages = Math.ceil(BACKGROUNDS.length / BACKGROUNDS_PER_PAGE);
  const startIdx = backgroundPage * BACKGROUNDS_PER_PAGE;
  const endIdx = startIdx + BACKGROUNDS_PER_PAGE;
  const paginatedBackgrounds = BACKGROUNDS.slice(startIdx, endIdx);

  // Load from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(`setupForm_${currentUser?.id}`);
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (e) {
        console.error('Failed to load saved form:', e);
      }
    }
  }, [currentUser?.id]);

  // Auto-save form to localStorage
  useEffect(() => {
    localStorage.setItem(`setupForm_${currentUser?.id}`, JSON.stringify(formData));
  }, [formData, currentUser?.id]);

  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getBackgroundPreviewStyle = (bgId) => {
    const previewStyles = {
      'lightrays-white': { background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e7ff 50%, #0f172a 100%)' },
      'lightrays-blue': { background: 'radial-gradient(circle at 30% 30%, #0099ff 0%, #667eea 50%, #0f172a 100%)' },
      'lightning': { background: 'linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
      'hyperspeed': { background: 'linear-gradient(90deg, #000428 0%, #004e92 50%, #1a7fa0 100%)' },
      'liquidether': { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
      'floatinglines': { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' },
      'galaxy': { background: 'radial-gradient(circle at 40% 60%, #ff006e 0%, #9d00ff 40%, #000428 100%)' },
      'colorbends': { background: 'linear-gradient(45deg, #ff006e 0%, #ffbe0b 25%, #00ff88 50%, #00d4ff 75%, #667eea 100%)' },
      'plasma': { background: 'linear-gradient(135deg, #ff006e 0%, #ffbe0b 50%, #0099ff 100%)' },
      'aurora': { background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 40%, #667eea 70%, #764ba2 100%)' },
      'prism': { background: 'linear-gradient(45deg, #ff0080 0%, #ff8c00 33%, #40e0d0 66%, #ff0080 100%)' },
      'darkveil': { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' },
      'lightpillar': { background: 'linear-gradient(180deg, #FF9FFC 0%, #5227FF 50%, #0f172a 100%)' },
      'iridescence': { background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 33%, #c7d2e0 66%, #ffffff 100%)' },
      'liquidchrome': { background: 'linear-gradient(135deg, #1a1a1a 0%, #4a5568 50%, #1a1a1a 100%)' }
    };
    return previewStyles[bgId] || { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
  };

  const handleLinkChange = (platform, url) => {
    setFormData(prev => ({
      ...prev,
      profileLinks: {
        ...prev.profileLinks,
        [platform]: url
      }
    }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!formData.gender) {
        setError('Please select your gender');
        return;
      }
      if (!formData.country) {
        setError('Please select your country');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate all required fields one more time
      if (!formData.name.trim() || !formData.gender || !formData.country) {
        throw new Error('Missing required information');
      }

      // Build profile links (filter out empty URLs)
      const profileLinks = Object.entries(formData.profileLinks)
        .filter(([, url]) => url.trim())
        .map(([platform, url]) => ({ platform, url }));

      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        gender: formData.gender,
        country: formData.country,
        description: formData.description.trim(),
        profileLinks
      };

      // Call backend endpoint
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/user/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Setup submission failed');
      }

      // Success!
      const data = await response.json();
      
      // Update auth data in localStorage
      const authData = JSON.parse(localStorage.getItem('prismAuth'));
      authData.user.is_onboarded = true;
      localStorage.setItem('prismAuth', JSON.stringify(authData));
      console.log('✅ Updated is_onboarded in auth:', authData.user);

      // Save profile data to localStorage for persistence across logins
      const profileKey = `socialProfile_${currentUser?.id}`;
      const profileData = {
        name: formData.name.trim(),
        gender: formData.gender,
        country: formData.country,
        bio: formData.description.trim(),
        picture: '👤',
        background: formData.background,
        interfaceColor: '#667eea',
        nameColor: '#ffffff',
        fontFamily: 'default',
        buttonStyle: 'style1',
        nameAnimation: 'none',
        links: profileLinks,
        streamSchedule: formData.streamSchedule,
        streamers: formData.streamers
      };
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      console.log('✅ Saved profile to localStorage:', profileKey, profileData);
      console.log('✅ Current localStorage keys:', Object.keys(localStorage));

      // Clear setup form
      localStorage.removeItem(`setupForm_${currentUser?.id}`);

      setSuccessMessage('Profile setup complete! Redirecting...');
      
      // Call completion callback
      setTimeout(() => {
        onSetupComplete?.();
      }, 1500);
    } catch (err) {
      console.error('Setup submission error:', err);
      setError(err.message || 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="setup-background"></div>
      
      <div className="setup-card">
        {/* Header */}
        <div className="setup-header">
          <h1>Complete Your Profile</h1>
          <p>Help us get to know you better</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
          <div className="progress-text">Step {step} of 7</div>
        </div>

        {/* Error Message */}
        {error && <div className="setup-error">{error}</div>}

        {/* Success Message */}
        {successMessage && <div className="setup-success">{successMessage}</div>}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="setup-step">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                maxLength={100}
                className="form-input"
              />
              <span className="char-count">{formData.name.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="form-select"
              >
                <option value="">Select your gender</option>
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <div className="country-search-wrapper">
                <input
                  id="country"
                  type="text"
                  placeholder="Search country..."
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="form-input"
                />
                
                {showCountryDropdown && (
                  <div className="dropdown-menu">
                    {filteredCountries.slice(0, 10).map(country => (
                      <button
                        key={country}
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          handleInputChange('country', country);
                          setCountrySearch(country);
                          setShowCountryDropdown(false);
                        }}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.country && <div className="selected-value">Selected: {formData.country}</div>}
            </div>
          </div>
        )}

        {/* Step 2: Biography */}
        {step === 2 && (
          <div className="setup-step">
            <h2>About You</h2>
            
            <div className="form-group">
              <label htmlFor="description">Bio & Description</label>
              <textarea
                id="description"
                placeholder="Tell us about yourself... (Optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
                rows={6}
                className="form-textarea"
              />
              <span className="char-count">{formData.description.length}/500</span>
            </div>
          </div>
        )}

        {/* Step 3: Profile Links */}
        {step === 3 && (
          <div className="setup-step">
            <h2>Social & Web Links</h2>
            <p className="step-description">Share your profile links (all optional)</p>
            
            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <input
                id="github"
                type="url"
                placeholder="https://github.com/yourprofile"
                value={formData.profileLinks.github}
                onChange={(e) => handleLinkChange('github', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter / X</label>
              <input
                id="twitter"
                type="url"
                placeholder="https://twitter.com/yourhandle"
                value={formData.profileLinks.twitter}
                onChange={(e) => handleLinkChange('twitter', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio / Website</label>
              <input
                id="portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.profileLinks.portfolio}
                onChange={(e) => handleLinkChange('portfolio', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="setup-step">
            <h2>Review Your Profile</h2>
            
            <div className="review-section">
              <h3>Personal Information</h3>
              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">{formData.name}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Gender:</span>
                <span className="review-value">
                  {GENDER_OPTIONS.find(g => g.id === formData.gender)?.label}
                </span>
              </div>
              <div className="review-item">
                <span className="review-label">Country:</span>
                <span className="review-value">{formData.country}</span>
              </div>
            </div>

            {formData.description && (
              <div className="review-section">
                <h3>Bio</h3>
                <div className="review-bio">{formData.description}</div>
              </div>
            )}

            {Object.entries(formData.profileLinks).some(([, url]) => url) && (
              <div className="review-section">
                <h3>Social & Web Links</h3>
                {Object.entries(formData.profileLinks)
                  .filter(([, url]) => url)
                  .map(([platform, url]) => (
                    <div key={platform} className="review-item">
                      <span className="review-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}:</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="review-link">
                        {url}
                      </a>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Background Selection */}
        {step === 5 && (
          <div className="setup-step">
            <h2>Choose Your Background</h2>
            <p className="step-subtitle">Select a background theme for your profile</p>
            
            <div className="background-pagination-info">
              Page {backgroundPage + 1} of {totalBackgroundPages}
            </div>
            
            <div className="background-grid">
              {paginatedBackgrounds.map(bg => {
                const BackgroundComponent = bg.component;
                const bgProps = bg.props || {};
                return (
                  <div
                    key={bg.id}
                    className={`background-option ${formData.background === bg.id ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, background: bg.id }))}
                  >
                    <div className="bg-preview-container">
                      {BackgroundComponent ? (
                        <div className="bg-component-preview">
                          <BackgroundComponent {...bgProps} />
                        </div>
                      ) : (
                        <div className="bg-preview" style={getBackgroundPreviewStyle(bg.id)}>
                          {bg.label}
                        </div>
                      )}
                    </div>
                    <span className="bg-label">{bg.label}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination controls */}
            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setBackgroundPage(prev => Math.max(0, prev - 1))}
                disabled={backgroundPage === 0}
              >
                ← Previous
              </button>
              <span className="pagination-text">
                {backgroundPage + 1} / {totalBackgroundPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setBackgroundPage(prev => Math.min(totalBackgroundPages - 1, prev + 1))}
                disabled={backgroundPage === totalBackgroundPages - 1}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Streaming Schedule */}
        {step === 6 && (
          <div className="setup-step">
            <h2>Set Your Streaming Schedule</h2>
            <p className="step-subtitle">Add when you typically stream (optional)</p>
            
            <div className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Day of Week</label>
                  <select
                    value={scheduleForm.day}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, day: e.target.value }))}
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d.day} value={d.day}>{d.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Game/Category</label>
                  <select
                    value={scheduleForm.game}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, game: e.target.value }))}
                  >
                    {GAMES.map(game => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="button"
                className="btn-secondary-small"
                onClick={() => {
                  if (scheduleForm.day && scheduleForm.time) {
                    setFormData(prev => ({
                      ...prev,
                      streamSchedule: [
                        ...prev.streamSchedule,
                        { ...scheduleForm, id: Date.now() }
                      ]
                    }));
                    setScheduleForm({ day: '1', time: '20:00', game: 'Just Chatting', timezone: 'UTC+0' });
                  }
                }}
              >
                + Add Schedule Entry
              </button>
              
              <div className="schedule-list">
                {formData.streamSchedule.map(entry => (
                  <div key={entry.id} className="schedule-item">
                    <span>{DAYS_OF_WEEK.find(d => d.day === entry.day)?.label} at {entry.time} - {entry.game}</span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        streamSchedule: prev.streamSchedule.filter(s => s.id !== entry.id)
                      }))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Suggested Streamers */}
        {step === 7 && (
          <div className="setup-step">
            <h2>Follow Suggested Streamers</h2>
            <p className="step-subtitle">Add streamers you want to recommend (optional)</p>
            
            <div className="streamers-form">
              <div className="form-group">
                <label>Streamer Name or URL</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={streamerInput}
                    onChange={(e) => setStreamerInput(e.target.value)}
                    placeholder="Enter streamer name or Twitch URL"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && streamerInput.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          streamers: [
                            ...prev.streamers,
                            { id: Date.now(), name: streamerInput.trim() }
                          ]
                        }));
                        setStreamerInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary-small"
                    onClick={() => {
                      if (streamerInput.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          streamers: [
                            ...prev.streamers,
                            { id: Date.now(), name: streamerInput.trim() }
                          ]
                        }));
                        setStreamerInput('');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="streamers-list">
                {formData.streamers.map(streamer => (
                  <div key={streamer.id} className="streamer-item">
                    <span>{streamer.name}</span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        streamers: prev.streamers.filter(s => s.id !== streamer.id)
                      }))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="setup-buttons">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={isLoading}
            >
              ← Back
            </button>
          )}
          
          {step < 7 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={isLoading}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Completing...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
