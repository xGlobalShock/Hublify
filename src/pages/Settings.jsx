import React, { useState, useRef, useEffect } from 'react';
import '../styles/Settings.css';
import { MdClose, MdPalette, MdColorLens, MdArticle, MdPerson } from 'react-icons/md';
import { BiChevronDown, BiLink } from 'react-icons/bi';
import { FaPaintbrush, FaFont, FaBrush, FaUser, FaUpload, FaUsers } from 'react-icons/fa6';
import { TbBackground } from 'react-icons/tb';
import { PiLinkSimpleBold } from 'react-icons/pi';
import { AiOutlineBgColors } from 'react-icons/ai';
import { FaCalendar } from 'react-icons/fa6';
import StreamSchedule from './StreamSchedule';
import StreamersList from './StreamersList';

const Settings = ({ 
  onClose,
  profileName,
  setProfileName,
  profileBio,
  setProfileBio,
  profileGender,
  setProfileGender,
  profileCountry,
  setProfileCountry,
  countrySearch,
  setCountrySearch,
  showCountryDropdown,
  setShowCountryDropdown,
  profilePicture,
  setProfilePicture,
  nameAnimation,
  setNameAnimation,
  nameColor,
  setNameColor,
  interfaceColor,
  setInterfaceColor,
  fontFamily,
  setFontFamily,
  socialLinks,
  setSocialLinks,
  newLink,
  setNewLink,
  showPlatformDropdown,
  setShowPlatformDropdown,
  SOCIAL_PLATFORMS,
  GENDER_OPTIONS,
  COUNTRIES,
  COUNTRY_FLAGS,
  FONT_PRESETS,
  setShowBgModal,
  setShowColorModal,
  setShowNameTextModal,
  addSocialLink,
  removeSocialLink,
  saveProfile,
  handleCancelEdit,
  handleProfilePictureChange,
  streamSchedule,
  setStreamSchedule,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStreamersManager, setShowStreamersManager] = useState(false);
  const [streamersList, setStreamersList] = useState([]);
  const countryDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);

  // Load streamers list from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`streamers_list_${currentUser?.id}`);
    if (saved) {
      setStreamersList(JSON.parse(saved));
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setCountrySearch('');
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
    };

    if (showCountryDropdown || showGenderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCountryDropdown, showGenderDropdown]);

  const SIDEBAR_ITEMS = [
    { id: 'profile', label: 'Profile Info', Icon: FaUser },
    { id: 'appearance', label: 'Appearance', Icon: FaPaintbrush },
    { id: 'social', label: 'Social Links', Icon: PiLinkSimpleBold },
    { id: 'schedule', label: 'Stream Schedule', Icon: FaCalendar },
    { id: 'streamers', label: 'Suggested Streamers', Icon: FaUsers }
  ];

  return (
    <div className="settings-page-overlay" onClick={onClose}>
      <div className="settings-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close-btn-top" onClick={onClose}><MdClose className="settings-close-icon" /></button>
        
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-header">
            <h2>Settings</h2>
          </div>
          
          <nav className="settings-nav">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {React.createElement(item.Icon, { className: 'settings-nav-icon', style: { color: '#ffffff' } })}
                <span className="settings-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-tab-content">
              <h3 className="settings-tab-title">Profile Information</h3>
              
              <div className="settings-profile-grid">
                {/* Top Row: Avatar + Name and Country Column */}
                <div className="settings-top-row">
                  <div className="settings-avatar-section">
                    <div className="settings-avatar-wrapper">
                      <label className="settings-input-label-compact">Your Photo</label>
                      <div className="settings-avatar-display">
                        {typeof profilePicture === 'string' && profilePicture.startsWith('data:')
                          ? <img 
                              src={profilePicture} 
                              alt="Profile" 
                              className="settings-avatar-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span className="avatar-emoji-settings">👤</span>';
                              }}
                            />
                          : <span className="avatar-emoji-settings">{profilePicture}</span>
                        }
                      </div>
                      <label htmlFor="avatar-upload" className="settings-upload-btn">
                        <FaUpload />
                        <span>Upload</span>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="settings-separator"></div>

                  <div className="settings-name-country-column">
                    <div className="settings-form-group-compact">
                      <label className="settings-input-label-compact">Your Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        maxLength="50"
                        placeholder="Name"
                        className="settings-input-compact"
                      />
                    </div>
                    <div className="settings-form-group-compact">
                      <label className="settings-input-label-compact">Country</label>
                      <div className="settings-country-input-wrapper" ref={countryDropdownRef}>
                        {!showCountryDropdown ? (
                          <button
                            className="settings-country-btn-compact"
                            onClick={() => setShowCountryDropdown(true)}
                          >
                            {profileCountry && profileCountry !== 'Not specified' && (
                              <img 
                                src={`https://flagpedia.net/data/flags/icon/24x18/${COUNTRY_FLAGS[profileCountry]}.png`}
                                alt={profileCountry}
                                className="settings-country-flag"
                              />
                            )}
                            <span>{profileCountry === 'Not specified' ? 'Select Country' : profileCountry}</span>
                            <i className="bx bx-chevron-down"></i>
                          </button>
                        ) : (
                          <div className="settings-country-search-container">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country..."
                              className="settings-country-search-expanded"
                              autoFocus
                            />
                            {profileCountry && profileCountry !== 'Not specified' && (
                              <button
                                className="settings-country-clear-btn"
                                onClick={() => {
                                  setProfileCountry('Not specified');
                                  setCountrySearch('');
                                  setShowCountryDropdown(false);
                                }}
                                title="Clear selection"
                              >
                                ✕
                              </button>
                            )}
                            <div className="settings-country-dropdown-compact">
                              {COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).map(country => (
                                <div
                                  key={country}
                                  className="settings-country-option-compact"
                                  onClick={() => {
                                    setProfileCountry(country);
                                    setCountrySearch('');
                                    setShowCountryDropdown(false);
                                  }}
                                >
                                  <img 
                                    src={`https://flagpedia.net/data/flags/icon/24x18/${COUNTRY_FLAGS[country]}.png`}
                                    alt={country}
                                    className="settings-country-option-flag"
                                  />
                                  <span>{country}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="settings-form-group-compact">
                      <label className="settings-input-label-compact">Gender</label>
                      <div className="settings-gender-dropdown-wrapper" ref={genderDropdownRef}>
                        <button
                          className="settings-gender-btn-dropdown"
                          onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        >
                          <span>
                            {profileGender && profileGender !== 'Not specified' 
                              ? profileGender
                              : 'Select Gender'
                            }
                          </span>
                          <i className="bx bx-chevron-down"></i>
                        </button>
                        {showGenderDropdown && (
                          <div className="settings-gender-dropdown-menu">
                            <div
                              className="settings-gender-option"
                              onClick={() => {
                                setProfileGender('Not specified');
                                setShowGenderDropdown(false);
                              }}
                            >
                              <span>Select Gender</span>
                            </div>
                            {GENDER_OPTIONS.map(option => (
                              <div
                                key={option.id}
                                className="settings-gender-option"
                                onClick={() => {
                                  setProfileGender(option.label);
                                  setShowGenderDropdown(false);
                                }}
                              >
                                {React.createElement(option.Icon, { className: 'gender-option-icon', style: { color: option.color } })}
                                <span>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Bio */}
                <div className="settings-form-group-compact settings-bio-row">
                  <label className="settings-input-label-compact">Bio</label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    maxLength="200"
                    placeholder="Tell us about yourself..."
                    className="settings-textarea-compact settings-textarea-bio-small"
                  />
                  <small className="settings-char-count-compact">{profileBio.length}/200</small>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="settings-tab-content">
              <h3 className="settings-tab-title">Customize Your Appearance</h3>
              
              <div className="settings-appearance-grid">
                <button 
                  onClick={() => setShowBgModal(true)} 
                  className="settings-appearance-card"
                >
                  <TbBackground className="settings-appearance-icon" style={{ color: '#ff6b6b' }} />
                  <span className="settings-appearance-label">Change Background</span>
                  <span className="settings-appearance-desc">Select from 15 animated backgrounds</span>
                </button>
                
                <button 
                  onClick={() => setShowColorModal(true)} 
                  className="settings-appearance-card"
                >
                  <AiOutlineBgColors className="settings-appearance-icon" style={{ color: '#4ecdc4' }} />
                  <span className="settings-appearance-label">Interface Colors</span>
                  <span className="settings-appearance-desc">Customize colors and theme</span>
                </button>

                <button 
                  onClick={() => setShowNameTextModal(true)} 
                  className="settings-appearance-card"
                >
                  <FaFont className="settings-appearance-icon" style={{ color: '#ffd93d' }} />
                  <span className="settings-appearance-label">Name & Text Styling</span>
                  <span className="settings-appearance-desc">Font and animation settings</span>
                </button>
              </div>

              {/* Quick Color Preview */}
              <div className="settings-color-preview">
                <div className="preview-item">
                  <label>Interface Color Preview</label>
                  <div 
                    className="color-preview-box" 
                    style={{ backgroundColor: interfaceColor }}
                  />
                </div>
                <div className="preview-item">
                  <label>Name Color Preview</label>
                  <div 
                    className="color-preview-box" 
                    style={{ backgroundColor: nameColor }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="settings-tab-content">
              <h3 className="settings-tab-title">Social Media Links</h3>
              
              {/* Add New Link */}
              <div className="settings-social-form">
                <div className="settings-social-form-row">
                  <div className="settings-social-platform-dropdown">
                  <button
                    className="settings-social-platform-button"
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                  >
                    {(() => {
                      const selected = SOCIAL_PLATFORMS.find(p => p.id === newLink.platform);
                      return (
                        <>
                          {selected?.Icon && React.createElement(selected.Icon, { className: 'social-form-icon', style: { color: selected?.color } })}
                          <span>{selected?.label || 'Select a platform...'}</span>
                        </>
                      );
                    })()}
                    <BiChevronDown className="social-dropdown-chevron" />
                  </button>
                  
                  {showPlatformDropdown && (
                    <div className="settings-social-platform-options">
                      {SOCIAL_PLATFORMS.map(p => (
                        <button
                          key={p.id}
                          className={`settings-social-platform-option ${newLink.platform === p.id ? 'selected' : ''}`}
                          onClick={() => {
                            setNewLink({ ...newLink, platform: p.id });
                            setShowPlatformDropdown(false);
                          }}
                        >
                          {React.createElement(p.Icon, { className: 'social-option-icon', style: { color: p.color } })}
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="Enter URL (e.g., https://twitter.com/yourprofile)"
                  className="settings-social-url-input"
                />
                
                  <button onClick={addSocialLink} className="settings-add-social-btn">
                    Add Link
                  </button>
                </div>
              </div>

              {/* Current Social Links */}
              <div className="settings-current-socials">
                <h4>Your Social Links ({Object.keys(socialLinks).length})</h4>
                {Object.keys(socialLinks).length === 0 ? (
                  <p className="settings-empty-state">No social links added yet. Add one above!</p>
                ) : (
                  <div className="settings-socials-list">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      const socialPlatform = SOCIAL_PLATFORMS.find(p => p.id === platform);
                      return (
                        <div key={platform} className="settings-social-item">
                          <div className="settings-social-item-info">
                            {socialPlatform?.Icon && React.createElement(socialPlatform.Icon, { className: 'social-item-icon', style: { color: socialPlatform?.color } })}
                            <div className="settings-social-item-details">
                              <span className="settings-social-item-label">{socialPlatform?.label}</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="settings-social-item-url">
                                {url}
                              </a>
                            </div>
                          </div>
                          <button
                            className="settings-social-item-remove"
                            onClick={() => removeSocialLink(platform)}
                          >
                            <i className="bx bx-x"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stream Schedule Tab */}
          {activeTab === 'schedule' && (
            <StreamSchedule 
              streamSchedule={streamSchedule} 
              setStreamSchedule={setStreamSchedule}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'streamers' && (
            <div className="settings-tab-content">
              <h3 className="settings-tab-title">Suggested Streamers</h3>
              <p className="settings-description">Manage the list of streamers displayed on your profile. Add your favorite streamers to showcase them on your profile page.</p>
              <button
                className="settings-open-streamers-btn"
                onClick={() => setShowStreamersManager(true)}
              >
                <FaUsers /> Manage Streamers ({streamersList.length})
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button onClick={saveProfile} className="settings-save-btn">
            Save Changes
          </button>
          <button onClick={handleCancelEdit} className="settings-cancel-btn">
            Cancel
          </button>
        </div>

        {showStreamersManager && (
          <StreamersList
            streamersList={streamersList}
            setStreamersList={(newList) => {
              setStreamersList(newList);
              localStorage.setItem(`streamers_list_${currentUser?.id}`, JSON.stringify(newList));
            }}
            onClose={() => setShowStreamersManager(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
