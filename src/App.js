import React, { useState, useEffect } from 'react';
import Lightning from './effects/Lightning';
import Hyperspeed from './effects/Hyperspeed';
import LiquidEther from './effects/LiquidEther';
import FloatingLines from './effects/FloatingLines';
import Galaxy from './effects/Galaxy';
import LightRays from './effects/LightRays';
import ColorBends from './effects/ColorBends';
import Plasma from './effects/Plasma';
import Aurora from './effects/Aurora';
import Prism from './effects/Prism';
import DarkVeil from './effects/DarkVeil';
import LightPillar from './effects/LightPillar';
import Iridescence from './effects/Iridescence';
import LiquidChrome from './effects/LiquidChrome';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import StaggeredBackgroundPreview from './lib/StaggeredBackgroundPreview';
import BackgroundCategoryModal from './lib/BackgroundCategoryModal';
import Settings from './pages/Settings';
import SchedulePreview from './lib/SchedulePreview';
import StreamersPreview from './pages/StreamersDisplay';
import { FaXTwitter, FaInstagram, FaTiktok, FaYoutube, FaDiscord, FaTwitch, FaGithub, FaLinkedin, FaFacebook, FaReddit, FaSpotify, FaSoundcloud, FaPatreon, FaRightFromBracket, FaRightToBracket, FaCircle, FaMars, FaVenus, FaTransgender, FaQuestion, FaFont } from 'react-icons/fa6';
import { MdCoffeeMaker, MdEdit, MdColorLens } from 'react-icons/md';
import { SiRumble, SiKick } from 'react-icons/si';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdHelp } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import './App.css';
import './styles/SchedulePreview.css';
import './styles/StreamersPreview.css';

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
  { id: 'lightpillar', label: 'Light Pillar', component: LightPillar, props: { topColor: '#FF9FFC', bottomColor: '#5227FF', intensity: 1.0, rotationSpeed: 0.3, glowAmount: 0.005, pillarWidth: 3.0, pillarHeight: 0.4, noiseIntensity: 0.5 } },
  { id: 'iridescence', label: 'Iridescence', component: Iridescence, props: { color: [1, 1, 1], mouseReact: false, amplitude: 0.1, speed: 1.0 } },
  { id: 'liquidchrome', label: 'Liquid Chrome', component: LiquidChrome, props: { baseColor: [0.1, 0.1, 0.1], speed: 0.2, amplitude: 0.3, interactive: false } }
];

const SOCIAL_PLATFORMS = [
  { id: 'twitter', label: 'X/Twitter', Icon: FaXTwitter, color: '#000000' },
  { id: 'instagram', label: 'Instagram', Icon: FaInstagram, color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', Icon: FaTiktok, color: '#000000' },
  { id: 'youtube', label: 'YouTube', Icon: FaYoutube, color: '#FF0000' },
  { id: 'discord', label: 'Discord', Icon: FaDiscord, color: '#5865F2' },
  { id: 'twitch', label: 'Twitch', Icon: FaTwitch, color: '#9146FF' },
  { id: 'github', label: 'GitHub', Icon: FaGithub, color: '#FFFFFF' },
  { id: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin, color: '#0A66C2' },
  { id: 'facebook', label: 'Facebook', Icon: FaFacebook, color: '#1877F2' },
  { id: 'reddit', label: 'Reddit', Icon: FaReddit, color: '#FF4500' },
  { id: 'kick', label: 'Kick', Icon: SiKick, color: '#10A552' },
  { id: 'beam', label: 'Beam', Icon: FaCircle, color: '#12cdd4' },
  { id: 'spotify', label: 'Spotify', Icon: FaSpotify, color: '#1DB954' },
  { id: 'soundcloud', label: 'SoundCloud', Icon: FaSoundcloud, color: '#FF7700' },
  { id: 'patreon', label: 'Patreon', Icon: FaPatreon, color: '#FF424D' },
  { id: 'buymeacoffee', label: 'Buy Me a Coffee', Icon: MdCoffeeMaker, color: '#FFDD00' },
  { id: 'rumble', label: 'Rumble', Icon: SiRumble, color: '#00CC00' }
];

const GENDER_OPTIONS = [
  { id: 'he-him', label: 'He/Him', color: '#0099ff', Icon: FaMars },
  { id: 'she-her', label: 'She/Her', color: '#ff006e', Icon: FaVenus },
  { id: 'they-them', label: 'They/Them', color: '#ffd700', Icon: FaTransgender },
  { id: 'prefer-not', label: 'Prefer Not to Say', color: '#b8b8d8', Icon: FaQuestion },
  { id: 'not-specified', label: 'Not Specified', color: '#b8b8d8', Icon: FaQuestion }
];

const COUNTRY_FLAGS = {
  'Afghanistan': 'af', 'Albania': 'al', 'Algeria': 'dz', 'Andorra': 'ad', 'Angola': 'ao', 'Argentina': 'ar', 'Armenia': 'am', 'Australia': 'au', 'Austria': 'at', 'Azerbaijan': 'az',
  'Bahamas': 'bs', 'Bahrain': 'bh', 'Bangladesh': 'bd', 'Barbados': 'bb', 'Belarus': 'by', 'Belgium': 'be', 'Belize': 'bz', 'Benin': 'bj', 'Bhutan': 'bt', 'Bolivia': 'bo', 'Bosnia and Herzegovina': 'ba', 'Botswana': 'bw', 'Brazil': 'br', 'Brunei': 'bn', 'Bulgaria': 'bg', 'Burkina Faso': 'bf', 'Burundi': 'bi',
  'Cambodia': 'kh', 'Cameroon': 'cm', 'Canada': 'ca', 'Cape Verde': 'cv', 'Central African Republic': 'cf', 'Chad': 'td', 'Chile': 'cl', 'China': 'cn', 'Colombia': 'co', 'Comoros': 'km', 'Congo': 'cg', 'Costa Rica': 'cr', 'Croatia': 'hr', 'Cuba': 'cu', 'Cyprus': 'cy', 'Czech Republic': 'cz',
  'Denmark': 'dk', 'Djibouti': 'dj', 'Dominica': 'dm', 'Dominican Republic': 'do',
  'Ecuador': 'ec', 'Egypt': 'eg', 'El Salvador': 'sv', 'Equatorial Guinea': 'gq', 'Eritrea': 'er', 'Estonia': 'ee', 'Ethiopia': 'et',
  'Fiji': 'fj', 'Finland': 'fi', 'France': 'fr',
  'Gabon': 'ga', 'Gambia': 'gm', 'Georgia': 'ge', 'Germany': 'de', 'Ghana': 'gh', 'Greece': 'gr', 'Grenada': 'gd', 'Guatemala': 'gt', 'Guinea': 'gn', 'Guinea-Bissau': 'gw', 'Guyana': 'gy',
  'Haiti': 'ht', 'Honduras': 'hn', 'Hungary': 'hu',
  'Iceland': 'is', 'India': 'in', 'Indonesia': 'id', 'Iran': 'ir', 'Iraq': 'iq', 'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Ivory Coast': 'ci',
  'Jamaica': 'jm', 'Japan': 'jp', 'Jordan': 'jo',
  'Kazakhstan': 'kz', 'Kenya': 'ke', 'Kiribati': 'ki', 'Kosovo': 'xk', 'Kuwait': 'kw', 'Kyrgyzstan': 'kg',
  'Laos': 'la', 'Latvia': 'lv', 'Lebanon': 'lb', 'Lesotho': 'ls', 'Liberia': 'lr', 'Libya': 'ly', 'Liechtenstein': 'li', 'Lithuania': 'lt', 'Luxembourg': 'lu',
  'Madagascar': 'mg', 'Malawi': 'mw', 'Malaysia': 'my', 'Maldives': 'mv', 'Mali': 'ml', 'Malta': 'mt', 'Marshall Islands': 'mh', 'Mauritania': 'mr', 'Mauritius': 'mu', 'Mexico': 'mx', 'Micronesia': 'fm', 'Moldova': 'md', 'Monaco': 'mc', 'Mongolia': 'mn', 'Montenegro': 'me', 'Morocco': 'ma', 'Mozambique': 'mz', 'Myanmar': 'mm',
  'Namibia': 'na', 'Nauru': 'nr', 'Nepal': 'np', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nicaragua': 'ni', 'Niger': 'ne', 'Nigeria': 'ng', 'North Korea': 'kp', 'North Macedonia': 'mk', 'Norway': 'no',
  'Oman': 'om',
  'Pakistan': 'pk', 'Palau': 'pw', 'Palestine': 'ps', 'Panama': 'pa', 'Papua New Guinea': 'pg', 'Paraguay': 'py', 'Peru': 'pe', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt',
  'Qatar': 'qa',
  'Romania': 'ro', 'Russia': 'ru', 'Rwanda': 'rw',
  'Saint Kitts and Nevis': 'kn', 'Saint Lucia': 'lc', 'Saint Vincent and the Grenadines': 'vc', 'Samoa': 'ws', 'San Marino': 'sm', 'Sao Tome and Principe': 'st', 'Saudi Arabia': 'sa', 'Senegal': 'sn', 'Serbia': 'rs', 'Seychelles': 'sc', 'Sierra Leone': 'sl', 'Singapore': 'sg', 'Slovakia': 'sk', 'Slovenia': 'si', 'Solomon Islands': 'sb', 'Somalia': 'so', 'South Africa': 'za', 'South Korea': 'kr', 'South Sudan': 'ss', 'Spain': 'es', 'Sri Lanka': 'lk', 'Sudan': 'sd', 'Suriname': 'sr', 'Sweden': 'se', 'Switzerland': 'ch', 'Syria': 'sy',
  'Taiwan': 'tw', 'Tajikistan': 'tj', 'Tanzania': 'tz', 'Thailand': 'th', 'Timor-Leste': 'tl', 'Togo': 'tg', 'Tonga': 'to', 'Trinidad and Tobago': 'tt', 'Tunisia': 'tn', 'Turkey': 'tr', 'Turkmenistan': 'tm', 'Tuvalu': 'tv',
  'Uganda': 'ug', 'Ukraine': 'ua', 'United Arab Emirates': 'ae', 'United Kingdom': 'gb', 'United States': 'us', 'Uruguay': 'uy', 'Uzbekistan': 'uz',
  'Vanuatu': 'vu', 'Vatican City': 'va', 'Venezuela': 've', 'Vietnam': 'vn',
  'Yemen': 'ye',
  'Zambia': 'zm', 'Zimbabwe': 'zw'
};

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
  'Yemen',
  'Zambia', 'Zimbabwe'
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [background, setBackground] = useState('lightrays-blue');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showNameTextModal, setShowNameTextModal] = useState(false);
  const [nameAnimation, setNameAnimation] = useState('none');
  const [tempNameAnimation, setTempNameAnimation] = useState(null);
  const [profileName, setProfileName] = useState('Your Name');
  const [profileBio, setProfileBio] = useState('');
  const [profileGender, setProfileGender] = useState('Not specified');
  const [profileCountry, setProfileCountry] = useState('Not specified');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [profilePicture, setProfilePicture] = useState('👤');
  const [interfaceColor, setInterfaceColor] = useState('#667eea');
  const [nameColor, setNameColor] = useState('#ffffff');
  
  // Backup state for cancel functionality
  const [backupState, setBackupState] = useState(null);
  const [fontFamily, setFontFamily] = useState('default');
  const [tempInterfaceColor, setTempInterfaceColor] = useState(null);
  const [tempNameColor, setTempNameColor] = useState(null);

  // Update CSS variables when interface color changes
  useEffect(() => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '102, 126, 234';
    };
    
    document.documentElement.style.setProperty('--interface-color', interfaceColor);
    document.documentElement.style.setProperty('--interface-color-rgb', hexToRgb(interfaceColor));
  }, [interfaceColor]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newLink, setNewLink] = useState({ platform: 'twitter', url: '' });
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editLinkData, setEditLinkData] = useState({ platform: '', url: '' });
  const [streamSchedule, setStreamSchedule] = useState([]);
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isStreamersVisible, setIsStreamersVisible] = useState(false);

  const FONT_PRESETS = [
    { name: 'Default', value: 'default', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' },
    { name: 'Serif', value: 'serif', family: 'Georgia, "Times New Roman", serif' },
    { name: 'Monospace', value: 'monospace', family: '"Courier New", Courier, monospace' },
    { name: 'Comic', value: 'comic', family: '"Comic Sans MS", cursive' },
    { name: 'Trebuchet', value: 'trebuchet', family: '"Trebuchet MS", sans-serif' },
    { name: 'Arial', value: 'arial', family: 'Arial, sans-serif' },
    { name: 'Verdana', value: 'verdana', family: 'Verdana, sans-serif' },
    { name: 'Impact', value: 'impact', family: 'Impact, fantasy' },
    { name: 'Brush Script', value: 'brush', family: '"Brush Script MT", cursive' },
    { name: 'Copperplate', value: 'copperplate', family: 'Copperplate, fantasy' },
    { name: 'Palatino', value: 'palatino', family: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { name: 'Lucida', value: 'lucida', family: '"Lucida Console", "Lucida Sans Typewriter", monaco, monospace' }
  ];

  const ANIMATION_PRESETS = [
    { name: 'None', value: 'none' },
    { name: 'Pulse', value: 'pulse' },
    { name: 'Bounce', value: 'bounce' },
    { name: 'Glow', value: 'glow' },
    { name: 'Slide', value: 'slide' },
    { name: 'Fade', value: 'fade' }
  ];

  const COLOR_PRESETS = [
    { name: 'Purple', hex: '#667eea' },
    { name: 'Blue', hex: '#0066ff' },
    { name: 'Cyan', hex: '#00d4ff' },
    { name: 'Green', hex: '#00ff88' },
    { name: 'Pink', hex: '#ff006e' },
    { name: 'Orange', hex: '#ff6b00' },
    { name: 'Red', hex: '#ff0000' },
    { name: 'Yellow', hex: '#ffd700' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Lime', hex: '#84cc16' }
  ];

  // Load profile data from localStorage
  useEffect(() => {
    // Clean up old localStorage data to free up space
    try {
      // Remove old profile picture entries for deleted users
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('profilePicture_') && key.length > 50) {
          // Very long keys are likely large image data from old sessions
          try {
            const value = localStorage.getItem(key);
            if (value && value.length > 500000) { // More than 500KB
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Ignore errors
          }
        }
      });
    } catch (e) {
      // Ignore cleanup errors
    }

    // Check if this is an OAuth callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      setIsProcessingAuth(true);
      return;
    }

    // Check for existing authentication
    const savedAuth = localStorage.getItem('prismAuth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      // Only restore if NOT a guest user (guest sessions don't persist)
      if (!auth.user?.id?.startsWith('guest_')) {
        setCurrentUser(auth.user);
        setIsAuthenticated(true);
        // Load user-specific profile data
        const userProfileKey = `socialProfile_${auth.user?.id}`;
        const savedProfile = localStorage.getItem(userProfileKey) || localStorage.getItem('socialProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setBackground(profile.background || 'hyperspeed');
          setProfileName(profile.name || 'Your Name');
          setProfileBio(profile.bio || '');
          setProfileGender(profile.gender || 'Not specified');
          setProfileCountry(profile.country || 'Not specified');
          setProfilePicture(profile.picture || '👤');
          setInterfaceColor(profile.interfaceColor || '#667eea');
          setNameColor(profile.nameColor || '#ffffff');
          setFontFamily(profile.fontFamily || 'default');
          setNameAnimation(profile.nameAnimation || 'none');
          // Convert old object format to new array format if needed
          if (profile.links && typeof profile.links === 'object' && !Array.isArray(profile.links)) {
            const linksArray = Object.entries(profile.links)
              .filter(([_, url]) => url)
              .map(([platform, url], index) => ({
                id: Date.now().toString() + index,
                platform,
                url
              }));
            setSocialLinks(linksArray);
          } else {
            setSocialLinks(profile.links || []);
          }
          setStreamSchedule(profile.streamSchedule || []);
        }
        return;
      }
    }

    // Load profile data for guests
    const saved = localStorage.getItem('socialProfile');
    if (saved) {
      const profile = JSON.parse(saved);
      setBackground(profile.background || 'hyperspeed');
      setProfileName(profile.name || 'Your Name');
      setProfileBio(profile.bio || '');
      setProfileGender(profile.gender || 'Not specified');
      setProfileCountry(profile.country || 'Not specified');
      setProfilePicture(profile.picture || '👤');
      setInterfaceColor(profile.interfaceColor || '#667eea');
      setNameColor(profile.nameColor || '#ffffff');
      setFontFamily(profile.fontFamily || 'default');
      setNameAnimation(profile.nameAnimation || 'none');
      // Convert old object format to new array format if needed
      if (profile.links && typeof profile.links === 'object' && !Array.isArray(profile.links)) {
        const linksArray = Object.entries(profile.links)
          .filter(([_, url]) => url)
          .map(([platform, url], index) => ({
            id: Date.now().toString() + index,
            platform,
            url
          }));
        setSocialLinks(linksArray);
      } else {
        setSocialLinks(profile.links || []);
      }
      setStreamSchedule(profile.streamSchedule || []);
    }
  }, []);

  // Save profile data to localStorage
  const saveProfile = () => {
    // Check if user is guest
    if (currentUser?.id?.startsWith('guest_')) {
      setShowLoginPrompt(true);
      return;
    }

    // Apply temp colors if they were changed
    const finalInterfaceColor = tempInterfaceColor !== null ? tempInterfaceColor : interfaceColor;
    const finalNameColor = tempNameColor !== null ? tempNameColor : nameColor;
    const finalNameAnimation = tempNameAnimation !== null ? tempNameAnimation : nameAnimation;
    
    setInterfaceColor(finalInterfaceColor);
    setNameColor(finalNameColor);
    setNameAnimation(finalNameAnimation);
    
    // Handle large images - try to compress or reduce quality
    let pictureToSave = profilePicture;
    
    // If it's a data URL image, try to save it
    if (typeof profilePicture === 'string' && profilePicture.startsWith('data:')) {
      try {
        // Try to save the full image to localStorage
        localStorage.setItem(`profilePicture_${currentUser?.id}`, profilePicture);
      } catch (e) {
        // If localStorage is full, try to compress the image        
        // Try to compress the image using Canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Reduce dimensions to 50% and quality to 70%
          canvas.width = img.width * 0.5;
          canvas.height = img.height * 0.5;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          try {
            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
            localStorage.setItem(`profilePicture_${currentUser?.id}`, compressedData);
            pictureToSave = compressedData;
          } catch (compressError) {
            console.warn('Compression failed:', compressError);
            pictureToSave = '👤'; // Fall back to emoji
          }
        };
        img.src = profilePicture;
      }
    }
    
    const profile = {
      background,
      name: profileName,
      bio: profileBio,
      gender: profileGender,
      country: profileCountry,
      picture: pictureToSave,
      interfaceColor: finalInterfaceColor,
      nameColor: finalNameColor,
      fontFamily,
      nameAnimation: finalNameAnimation,
      links: socialLinks,
      streamSchedule: streamSchedule,
      userId: currentUser?.id // Save with user ID
    };
    
    // Save with user-specific key only (don't save generic key to save space)
    const userProfileKey = `socialProfile_${currentUser?.id}`;
    try {
      const profileJson = JSON.stringify(profile);
      localStorage.setItem(userProfileKey, profileJson);
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
      // Try again without the image
      profile.picture = '👤';
      try {
        const profileJson = JSON.stringify(profile);
        localStorage.setItem(userProfileKey, profileJson);
        // Don't show alert to user, just save silently
        console.warn('Profile saved without image due to quota');
      } catch (e2) {
        console.error('Profile too large to save:', e2);
        // Silently fail, state is still updated in UI
      }
    }

    // Clear temp colors
    setTempInterfaceColor(null);
    setTempNameColor(null);
    setTempNameAnimation(null);
    
    setIsEditMode(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result || '👤';
        setProfilePicture(result);
        // Also store in sessionStorage/IndexedDB if it's a large image
        if (result.length > 100000) { // If larger than ~100KB
          try {
            sessionStorage.setItem('tempProfilePicture', result);
          } catch (e) {
            console.warn('Could not store image in sessionStorage:', e);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create backup state when entering edit mode
  const handleEnterEditMode = () => {
    setBackupState({
      profileName,
      profileBio,
      profileGender,
      profileCountry,
      profilePicture,
      interfaceColor,
      nameColor,
      fontFamily,
      selectedBackground: background,
      nameAnimation,
      socialLinks: JSON.parse(JSON.stringify(socialLinks)) // Deep copy
    });
    setIsEditMode(true);
  };

  // Restore from backup when canceling
  const handleCancelEdit = () => {
    if (backupState) {
      setProfileName(backupState.profileName);
      setProfileBio(backupState.profileBio);
      setProfileGender(backupState.profileGender);
      setProfileCountry(backupState.profileCountry);
      setProfilePicture(backupState.profilePicture);
      setInterfaceColor(backupState.interfaceColor);
      setNameColor(backupState.nameColor);
      setFontFamily(backupState.fontFamily);
      setBackground(backupState.selectedBackground);
      setNameAnimation(backupState.nameAnimation);
      setSocialLinks(backupState.socialLinks);
    }
    setIsEditMode(false);
    setBackupState(null);
  };

  const addSocialLink = () => {
    if (newLink.url.trim()) {
      const newLinkObj = {
        id: Date.now().toString(),
        platform: newLink.platform,
        url: newLink.url
      };
      // Ensure socialLinks is always an array
      const currentLinks = Array.isArray(socialLinks) ? socialLinks : [];
      setSocialLinks([...currentLinks, newLinkObj]);
      setNewLink({ platform: 'twitter', url: '' });
    }
  };

  const handleAuthSuccess = (authData) => {
    // Save auth immediately
    localStorage.setItem('prismAuth', JSON.stringify(authData));
    
    // Build profile data object
    let profileData = {
      background: 'floatinglines',
      name: 'Your Name',
      bio: '',
      gender: 'Not specified',
      country: 'Not specified',
      picture: '👤',
      interfaceColor: '#667eea',
      nameColor: '#ffffff',
      fontFamily: 'default',
      nameAnimation: 'none',
      links: {},
      streamSchedule: []
    };

    // Try to load existing profile from localStorage
    const userProfileKey = `socialProfile_${authData.user.id}`;
    const savedProfile = localStorage.getItem(userProfileKey);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        profileData = {
          background: profile.background || 'floatinglines',
          name: profile.name || 'Your Name',
          bio: profile.bio || '',
          gender: profile.gender || 'Not specified',
          country: profile.country || 'Not specified',
          picture: profile.picture || '👤',
          interfaceColor: profile.interfaceColor || '#667eea',
          nameColor: profile.nameColor || '#ffffff',
          fontFamily: profile.fontFamily || 'default',
          nameAnimation: profile.nameAnimation || 'none',
          links: profile.links || {},
          streamSchedule: profile.streamSchedule || []
        };
      } catch (e) {
        console.error('Failed to parse saved profile:', e);
      }
    }

    // For Discord users, use passed profile if available (but don't override saved data)
    if (!authData.isGuest && authData.profile && !savedProfile) {
      profileData = {
        background: authData.profile.background || 'floatinglines',
        name: authData.profile.name || 'Your Name',
        bio: authData.profile.bio || '',
        gender: authData.profile.gender || 'Not specified',
        country: authData.profile.country || 'Not specified',
        picture: authData.profile.picture || '👤',
        interfaceColor: authData.profile.interfaceColor || '#667eea',
        nameColor: authData.profile.nameColor || '#ffffff',
        fontFamily: authData.profile.fontFamily || 'default',
        nameAnimation: authData.profile.nameAnimation || 'none',
        links: authData.profile.links || {},
        streamSchedule: authData.profile.streamSchedule || []
      };
    }
      
    // Load picture from localStorage if available
    const storedImage = localStorage.getItem(`profilePicture_${authData.user.id}`);
    if (storedImage) {
      profileData.picture = storedImage;
    } else if (profileData.picture === 'STORED_IN_SESSION') {
      // Fallback for old sessionStorage entries
      const sessionImage = sessionStorage.getItem(`profilePicture_${authData.user.id}`);
      profileData.picture = sessionImage || '👤';
    }

    // Set all state together
    setCurrentUser(authData.user);
    setIsAuthenticated(true);
    setIsProcessingAuth(false);
    setBackground(profileData.background);
    setProfileName(profileData.name);
    setProfileBio(profileData.bio);
    setProfileGender(profileData.gender);
    setProfileCountry(profileData.country);
    setProfilePicture(profileData.picture);
    setInterfaceColor(profileData.interfaceColor);
    setNameColor(profileData.nameColor);
    setFontFamily(profileData.fontFamily);
    setNameAnimation(profileData.nameAnimation);
    setSocialLinks(profileData.links);
    setStreamSchedule(profileData.streamSchedule);
    
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleAuthError = (error) => {
    console.error('Auth error:', error);
    setIsProcessingAuth(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleDiscordLogin = () => {
    const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_DISCORD_REDIRECT_URI || 'http://localhost:3000/callback';
    
    if (!DISCORD_CLIENT_ID) {
      alert('Discord Client ID is not configured');
      return;
    }

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email&prompt=consent`;
    window.location.href = discordAuthUrl;
  };

  const handleLogout = () => {
    // Reset profile data
    setBackground('hyperspeed');
    setProfileName('Your Name');
    setProfileBio('');
    setProfileGender('Not specified');
    setProfileCountry('Not specified');
    setProfilePicture('👤');
    setInterfaceColor('#667eea');
    setNameColor('#ffffff');
    setFontFamily('default');
    setNameAnimation('none');
    setSocialLinks([]);
    setIsEditMode(false);
    
    // Clear auth
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('prismAuth');
  };

  const removeSocialLink = (linkId) => {
    const currentLinks = Array.isArray(socialLinks) ? socialLinks : [];
    setSocialLinks(currentLinks.filter(link => link.id !== linkId));
  };

  const startEditingLink = (link) => {
    setEditingLinkId(link.id);
    setEditLinkData({ platform: link.platform, url: link.url });
  };

  const saveEditedLink = () => {
    if (editLinkData.url.trim()) {
      const currentLinks = Array.isArray(socialLinks) ? socialLinks : [];
      setSocialLinks(currentLinks.map(link => 
        link.id === editingLinkId 
          ? { ...link, platform: editLinkData.platform, url: editLinkData.url }
          : link
      ));
      setEditingLinkId(null);
      setEditLinkData({ platform: '', url: '' });
    }
  };

  const cancelEditingLink = () => {
    setEditingLinkId(null);
    setEditLinkData({ platform: '', url: '' });
  };

  const reorderSocialLinks = (fromIndex, toIndex) => {
    const currentLinks = Array.isArray(socialLinks) ? socialLinks : [];
    const updatedLinks = [...currentLinks];
    const [movedLink] = updatedLinks.splice(fromIndex, 1);
    updatedLinks.splice(toIndex, 0, movedLink);
    setSocialLinks(updatedLinks);
  };

  const backgroundData = BACKGROUNDS.find(bg => bg.id === background);
  const BackgroundComponent = backgroundData?.component;
  const backgroundProps = backgroundData?.props || {};

  // Show OAuth callback screen
  if (isProcessingAuth) {
    return <OAuthCallback onAuthComplete={handleAuthSuccess} onError={handleAuthError} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login 
      onLoginSuccess={handleAuthSuccess} 
      BACKGROUNDS={BACKGROUNDS}
    />;
  }

  return (
    <div className="App">
      {/* User Profile Header with Settings */}
      <div className="user-profile-header-wrapper">
        <div className="settings-button-container">
          <button 
            type="button"
            className="settings-btn" 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            title="Settings"
          >
            <span className="hamburger-menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Settings Menu Dropdown */}
      {showSettingsMenu && (
        <div className="settings-menu" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
          {/* User Profile Header inside Menu */}
          <div className="settings-menu-header">
            <div className="user-avatar-container">
              {typeof currentUser?.avatar === 'string' && currentUser.avatar.startsWith('http') ? (
                <img src={currentUser.avatar} alt={currentUser.username} className="user-avatar-img" />
              ) : (
                <div className="user-avatar-emoji">{currentUser?.avatar || '👤'}</div>
              )}
            </div>
            <div className="user-greeting">
              <p className="user-greeting-text">Hello, <span className="user-greeting-name" style={{ color: '#00ff00' }} data-login-method={currentUser?.loginMethod}>{currentUser?.username || 'User'}</span></p>
            </div>
          </div>
          <div className="settings-menu-divider"></div>
          <button 
            className="settings-menu-item"
            onClick={() => {
              handleEnterEditMode();
              setShowSettingsMenu(false);
            }}
          >
            <IoSettingsSharp className="settings-menu-icon" />
            <span>Edit Profile</span>
          </button>
          <button 
            className="settings-menu-item logout-item"
            onClick={() => {
              if (currentUser?.id?.startsWith('guest_')) {
                // Show login screen
                setIsAuthenticated(false);
                setCurrentUser(null);
                localStorage.removeItem('prismAuth');
                setShowSettingsMenu(false);
              } else {
                handleLogout();
              }
            }}
          >
            {currentUser?.id?.startsWith('guest_') ? <FaRightToBracket className="settings-menu-icon" /> : <FaRightFromBracket className="settings-menu-icon" />}
            <span>{currentUser?.id?.startsWith('guest_') ? 'Login' : 'Logout'}</span>
          </button>
        </div>
      )}
      {/* Background */}
      {BackgroundComponent && !showBgModal && !showColorModal && (
        <BackgroundComponent key={background} {...backgroundProps} />
      )}

      {/* Profile Content */}
      <div className="profile-container">

        {/* View Mode - Display Profile */}
        {!isEditMode && (
          <div className="profile-view-container">
            <div className="profile-view-card">
              <div className="profile-view-avatar">
                {typeof profilePicture === 'string' && profilePicture.startsWith('data:')
                  ? <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="profile-view-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="avatar-emoji-view">👤</span>';
                      }}
                    />
                  : <span className="avatar-emoji-view">{profilePicture}</span>
                }
                {profileCountry && profileCountry !== 'Not specified' && (
                  <img 
                    src={`https://flagpedia.net/data/flags/icon/24x18/${COUNTRY_FLAGS[profileCountry]}.png`}
                    alt={profileCountry}
                    className="country-flag-badge"
                    title={profileCountry}
                  />
                )}
              </div>
              <h1 className={`profile-view-name profile-name-animated ${nameAnimation}`} style={{ color: nameColor, fontFamily: FONT_PRESETS.find(f => f.value === fontFamily)?.family }}>{profileName}</h1>
              {!isEditMode && profileBio.trim() !== '' && (
                <div className="profile-bio-card">
                  <p className="profile-bio">{profileBio.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < profileBio.split('\n').length - 1 && <br />}
                    </span>
                  ))}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Links - Only in view mode */}
        {!isEditMode && socialLinks.length > 0 && (
          <div className="social-links-container">
            {socialLinks.map((link) => {
              const socialPlatform = SOCIAL_PLATFORMS.find(p => p.id === link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-btn"
                  title={socialPlatform?.label}
                >
                  {React.createElement(socialPlatform?.Icon, { className: 'social-icon', style: { color: socialPlatform?.color } })}
                  <span className="social-label">{socialPlatform?.label}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Settings Page */}
        {isEditMode && (
          <Settings
            onClose={handleCancelEdit}
            profileName={profileName}
            setProfileName={setProfileName}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            profileGender={profileGender}
            setProfileGender={setProfileGender}
            profileCountry={profileCountry}
            setProfileCountry={setProfileCountry}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
            showCountryDropdown={showCountryDropdown}
            setShowCountryDropdown={setShowCountryDropdown}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            nameAnimation={nameAnimation}
            setNameAnimation={setNameAnimation}
            nameColor={nameColor}
            setNameColor={setNameColor}
            interfaceColor={interfaceColor}
            setInterfaceColor={setInterfaceColor}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            newLink={newLink}
            setNewLink={setNewLink}
            showPlatformDropdown={showPlatformDropdown}
            setShowPlatformDropdown={setShowPlatformDropdown}
            SOCIAL_PLATFORMS={SOCIAL_PLATFORMS}
            GENDER_OPTIONS={GENDER_OPTIONS}
            COUNTRIES={COUNTRIES}
            COUNTRY_FLAGS={COUNTRY_FLAGS}
            FONT_PRESETS={FONT_PRESETS}
            setShowBgModal={setShowBgModal}
            setShowColorModal={setShowColorModal}
            setShowNameTextModal={setShowNameTextModal}
            addSocialLink={addSocialLink}
            removeSocialLink={removeSocialLink}
            startEditingLink={startEditingLink}
            saveEditedLink={saveEditedLink}
            cancelEditingLink={cancelEditingLink}
            reorderSocialLinks={reorderSocialLinks}
            editingLinkId={editingLinkId}
            editLinkData={editLinkData}
            setEditLinkData={setEditLinkData}
            saveProfile={saveProfile}
            streamSchedule={streamSchedule}
            setStreamSchedule={setStreamSchedule}
            currentUser={currentUser}
            handleCancelEdit={handleCancelEdit}
            handleProfilePictureChange={handleProfilePictureChange}
          />
        )}
      </div>

      {/* Background Selector Modal */}
      {showBgModal && (
        <BackgroundCategoryModal
          backgrounds={BACKGROUNDS}
          onSelect={(bgId) => {
            const newBg = bgId;
            setBackground(newBg);
            // Save background immediately - but handle quota errors
            try {
              // Try to load existing user profile
              const userProfileKey = `socialProfile_${currentUser?.id}`;
              const existingProfile = localStorage.getItem(userProfileKey);
              if (existingProfile) {
                const profile = JSON.parse(existingProfile);
                profile.background = newBg;
                localStorage.setItem(userProfileKey, JSON.stringify(profile));
              } else {
                // If no user profile exists, save just the background
                const minimalProfile = {
                  background: newBg
                };
                localStorage.setItem(userProfileKey, JSON.stringify(minimalProfile));
              }
            } catch (e) {
              console.warn('Failed to save background:', e);
              // Silently fail - background is already updated in UI state
            }
            setShowBgModal(false);
          }}
          onClose={() => setShowBgModal(false)}
        />
      )}

      {/* Color Selector Modal */}
      {showColorModal && (
        <div className="background-selector-modal" onClick={() => setShowColorModal(false)}>
          <div className="interface-color-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => {
              // Apply temp interface color if changed
              if (tempInterfaceColor !== null) {
                try {
                  // Try to get existing profile and update just the color
                  const userProfileKey = `socialProfile_${currentUser?.id}`;
                  const existingProfile = localStorage.getItem(userProfileKey);
                  if (existingProfile) {
                    const profile = JSON.parse(existingProfile);
                    profile.interfaceColor = tempInterfaceColor;
                    localStorage.setItem(userProfileKey, JSON.stringify(profile));
                  } else {
                    // Fallback: save minimal profile with color
                    const minimalProfile = {
                      interfaceColor: tempInterfaceColor
                    };
                    localStorage.setItem(userProfileKey, JSON.stringify(minimalProfile));
                  }
                  setInterfaceColor(tempInterfaceColor);
                } catch (e) {
                  console.warn('Failed to save color:', e);
                  // Still apply the color even if save fails
                  setInterfaceColor(tempInterfaceColor);
                }
                setTempInterfaceColor(null);
              }
              setShowColorModal(false);
            }}>
              ✕
            </button>
            <h3>Interface Colors</h3>
            <div className="modal-custom-color-picker">
              <label>Custom Color:</label>
              <input
                type="color"
                value={tempInterfaceColor !== null ? tempInterfaceColor : interfaceColor}
                onChange={(e) => {
                  setTempInterfaceColor(e.target.value);
                  setInterfaceColor(e.target.value);
                }}
                className="modal-color-input"
              />
              <span className="modal-color-value">{tempInterfaceColor !== null ? tempInterfaceColor : interfaceColor}</span>
            </div>
            <div className="interface-color-grid">
              {COLOR_PRESETS.map(color => (
                <button
                  key={color.hex}
                  className={`modal-appearance-card ${(tempInterfaceColor !== null ? tempInterfaceColor : interfaceColor) === color.hex ? 'active' : ''}`}
                  onClick={() => {
                    setTempInterfaceColor(color.hex);
                    setInterfaceColor(color.hex);
                  }}
                  title={color.name}
                >
                  <div className="modal-card-color-icon" style={{ backgroundColor: color.hex }}></div>
                  <span className="modal-card-label">{color.name}</span>
                  <span className="modal-card-desc">{color.hex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Name & Text Modal */}
      {showNameTextModal && (
        <div className="background-selector-modal" onClick={() => setShowNameTextModal(false)}>
          <div className="color-selector-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => {
              // Apply temp values if changed
              if (tempNameColor !== null) {
                setNameColor(tempNameColor);
              }
              if (tempNameAnimation !== null) {
                setNameAnimation(tempNameAnimation);
              }
              
              const finalNameAnimation = tempNameAnimation !== null ? tempNameAnimation : nameAnimation;
              const finalNameColor = tempNameColor !== null ? tempNameColor : nameColor;
              
              try {
                // Try to get existing profile and update just the values
                const userProfileKey = `socialProfile_${currentUser?.id}`;
                const existingProfile = localStorage.getItem(userProfileKey);
                if (existingProfile) {
                  const profile = JSON.parse(existingProfile);
                  profile.nameColor = finalNameColor;
                  profile.nameAnimation = finalNameAnimation;
                  localStorage.setItem(userProfileKey, JSON.stringify(profile));
                } else {
                  // Fallback: save minimal profile with values
                  const minimalProfile = {
                    nameColor: finalNameColor,
                    nameAnimation: finalNameAnimation
                  };
                  localStorage.setItem(userProfileKey, JSON.stringify(minimalProfile));
                }
              } catch (e) {
                console.warn('Failed to save name/text settings:', e);
                // Still apply the values even if save fails
              }
              setTempNameColor(null);
              setTempNameAnimation(null);
              setShowNameTextModal(false);
            }}>
              ✕
            </button>
            <h3>Name & Text Styling</h3>
            
            {/* Name Color Section */}
            <div className="modal-section">
              <h4 className="modal-section-title">Name Color</h4>
              <div className="modal-custom-color-picker">
                <label>Custom Color:</label>
                <input
                  type="color"
                  value={tempNameColor !== null ? tempNameColor : nameColor}
                  onChange={(e) => {
                    setTempNameColor(e.target.value);
                  }}
                  className="modal-color-input"
                />
                <span className="modal-color-value">{tempNameColor !== null ? tempNameColor : nameColor}</span>
              </div>
              <div className="modal-color-grid">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color.hex}
                    className={`modal-appearance-card ${(tempNameColor !== null ? tempNameColor : nameColor) === color.hex ? 'active' : ''}`}
                    onClick={() => {
                      setTempNameColor(color.hex);
                    }}
                    title={color.name}
                  >
                    <div className="modal-card-color-icon" style={{ backgroundColor: color.hex }}></div>
                    <span className="modal-card-label">{color.name}</span>
                    <span className="modal-card-desc">{color.hex}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Section */}
            <div className="modal-section">
              <h4 className="modal-section-title">Font Style</h4>
              <div className="modal-font-grid">
                {FONT_PRESETS.map(font => (
                  <button
                    key={font.value}
                    className={`modal-appearance-card ${fontFamily === font.value ? 'active' : ''}`}
                    onClick={() => {
                      setFontFamily(font.value);
                    }}
                    title={font.name}
                  >
                    <FaFont className="modal-card-icon" style={{ color: '#ffd93d' }} />
                    <span className="modal-card-label" style={{ fontFamily: font.family }}>{font.name}</span>
                    <span className="modal-card-desc">Font Style</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Section */}
            <div className="modal-section">
              <h4 className="modal-section-title">Name Animation</h4>
              <div className="modal-animation-grid">
                {ANIMATION_PRESETS.map(animation => (
                  <button
                    key={animation.value}
                    className={`modal-appearance-card ${(tempNameAnimation !== null ? tempNameAnimation : nameAnimation) === animation.value ? 'active' : ''}`}
                    onClick={() => {
                      setTempNameAnimation(animation.value);
                    }}
                    title={animation.name}
                  >
                    <MdColorLens className="modal-card-icon" style={{ color: '#4ecdc4' }} />
                    <span className="modal-card-label">{animation.name}</span>
                    <span className="modal-card-desc">Animation Effect</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal for Guests */}
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowLoginPrompt(false)}>✕</button>
            <h2>Login to Save Your Profile</h2>
            <p>Guest users can explore, but to save your amazing profile customizations, please login with Discord!</p>
            
            <div className="login-prompt-buttons">
              <button 
                className="login-prompt-btn discord"
                onClick={() => {
                  setShowLoginPrompt(false);
                  handleDiscordLogin();
                }}
              >
                <i className="fab fa-discord"></i>
                Login with Discord
              </button>
              <button 
                className="login-prompt-btn cancel"
                onClick={() => setShowLoginPrompt(false)}
              >
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Preview Overlay - Rendered at App level to prevent layout shifts */}
      {!isEditMode && streamSchedule && streamSchedule.length > 0 && (
        <SchedulePreview 
          streamSchedule={streamSchedule}
          isScheduleVisible={isScheduleVisible}
          setIsScheduleVisible={setIsScheduleVisible}
        />
      )}

      {/* Streamers Preview Overlay - Rendered at App level */}
      {!isEditMode && (
        <StreamersPreview
          streamersList={localStorage.getItem(`streamers_list_${currentUser?.id}`) ? JSON.parse(localStorage.getItem(`streamers_list_${currentUser?.id}`)) : []}
          userId={currentUser?.id}
          isStreamersVisible={isStreamersVisible}
          setIsStreamersVisible={setIsStreamersVisible}
        />
      )}
    </div>
  );
}

export default App;
