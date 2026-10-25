/**
 * ============================================================================
 * MLBB CODEX — Liquid Clear Glass Encyclopedia & Multilingual Engine
 * 100% Client-Side • Powered by Local JSON files in /data
 * Supported Languages: English (en), Burmese Unicode (my), Russian (ru),
 * German (de), Chinese (zh), Japanese (ja)
 * ============================================================================
 */

const state = {
  heroes: [],
  items: [],
  lore: [],
  emblems: [],
  battleSpells: [],
  heroMap: new Map(),
  itemMap: new Map(),
  loreMap: new Map(),
  emblemMap: new Map(),
  currentRoute: 'home',
  lang: localStorage.getItem('mlbb_lang') || 'en',
  theme: localStorage.getItem('mlbb_theme') || 'cyan',
  glassMode: localStorage.getItem('mlbb_glass_mode') || 'dark',
  favorites: JSON.parse(localStorage.getItem('mlbb_favorites') || '[]'),
  quiz: { index: 0, score: 0, streak: 0, selected: null, showHint: false },
  activeModal: null, // { type: 'hero'|'item'|'lore'|'web'|'quiz', id: string }
  bannerIndex: 0,
  heroFilter: { role: 'All', lane: 'All', sort: 'name' },
  itemFilter: { category: 'All', tier: 'All' },
  searchQuery: '',
  account: null,
  accountSeasonSid: 40,
  accountLaneFilter: 'All',
  accountJwt: localStorage.getItem('mlbb_account_jwt') || '',
  audioEnabled: localStorage.getItem('mlbb_audio_enabled') === 'true',
  bgmEnabled: localStorage.getItem('mlbb_bgm_enabled') !== 'false',
  bgmTrackIndex: Number(localStorage.getItem('mlbb_bgm_track') || 0),
  bgmVolume: 0.28,
  draft: {
    enemy: [null, null, null, null, null],
    lanes: ['EXP', 'Jungle', 'Mid', 'Gold', 'Roam']
  },
  sandbox: {
    heroId: 'gusion',
    heroLevel: 15,
    items: ['arcane-boots', 'genius-wand', 'holy-crystal', 'divine-glaive', 'blood-wings', 'winter-crown'],
    dummyType: 'tank'
  },
  selectedTerritory: 'moniyan'
};

/* ============================================================================
   AUTHENTIC IN-GAME HERO VOICE QUOTES (Mobile Legends: Bang Bang)
   ============================================================================ */
const MLBB_HERO_VOICE_LINES = {
  miya: "Wise choice! Watch your back!",
  balmond: "My axe thirsts for blood! What does not kill me makes me stronger!",
  saber: "Kill all at once! One strike, one kill!",
  alice: "Watch your back, darling. The darkness can be fun too!",
  nana: "Do you want to make friends with Nana? Adventure is out there!",
  tigreal: "A real man never hides in the bush! Horns of war sound!",
  alucard: "Nothing lasts forever, we can change the future! Hey, not bad!",
  karina: "My blade is swift and deadly. There is no escaping the shadows!",
  akai: "Let's roll! There is no coincidence in this world!",
  franco: "Time to teach you guys a lesson! Hook, line, and sinker!",
  layla: "Time to shine! We can do it!",
  fanny: "Sir, what's your command? War is not a child's game!",
  chou: "Wipe out all the injustice in the world! Empty your mind, be formless!",
  gusion: "Break the shackles of the past! The perfect combination of might and magic!",
  hayabusa: "Shadow will pierce through everything! Betrayal must be paid with blood!",
  kagura: "A thought to sacrifice, a thought to refine. Curse, spills out of the umbrella!",
  lancelot: "Time to witness the handsome! In bloom of youth, I'm the most beautiful!",
  lesley: "One shot, one kill. You won't even know what hit you!",
  claude: "Dexter, are you ready? Living freely is my only pursuit!",
  guinevere: "Dance for me! I am the top student of the magic academy!",
  ling: "I walk the path between shadows and light. Flight of the finch!",
  granger: "I only play the melody of death. Let the symphony begin!",
  wanwan: "To catch a tiger, you have to be faster! Ready, aim, fire!",
  'yu-zhong': "I would rather betray the world than let the world betray me!",
  beatrix: "Guns, gears, and glorious victory! Time to test my new invention!",
  valentina: "Pain is the best teacher. Everything you have is now mine!",
  joy: "Catch me if you can! Music makes me bounce!",
  nolan: "Cosmic echoes call to me. The multiverse is fragile.",
  cici: "Yoyo, let's put on a show! Catch the rhythm!",
  yin: "Lieh, stay back! I will protect everyone!",
  julian: "A Raven never looks back.",
  xavier: "Defiance is the true power of mankind!",
  melissa: "Nobody controls me! Stitch it up!",
  fredrinn: "Appraise everything with a crystal eye. Drink up, boys!",
  arlott: "Vengeance fuels my spear.",
  novaria: "Stars chart the destiny of the Land of Dawn!",
  ixia: "The desert taught me to survive with grit and sparks!",
  suyou: "Let the immortal blade carve through the storm!",
  lukas: "Raw instincts never deceive.",
  zhuxin: "Butterflies guide the lost souls home.",
  johnson: "Come on! Buckle up, let's ride!",
  cyclops: "Stars are my guide! You can never escape my planetary sphere!",
  estes: "Moonlight, bathe this land with peace and healing.",
  hilda: "Charge! For the clan!",
  aurora: "Listen to the bitter cold. Freeze!",
  karrie: "Speed is the key to life and death.",
  gatotkaca: "I am the iron bone and steel tendon!",
  harley: "Time for a magic show! Don't blink!",
  irithel: "Smash them to dust! Leo, attack!",
  grock: "Welcome to my kingdom. Grock loves nature!",
  argus: "Justice is an illusion, power is eternal!",
  diggie: "Hoot hoot! Time is money, friend!",
  hylos: "Charge forward, my brethren!",
  zhask: "The swarm shall devour this realm!",
  helcurt: "Night falls! Fear the dark!",
  angela: "Love and hope are the two greatest inventions!",
  uranus: "I am eternal light and fortress!",
  selena: "Defiance is so sweet, don't you think?",
  aldous: "My fist is the hammer of destiny!",
  leomord: "Despair is my chariot.",
  lunox: "Balance is the ultimate truth.",
  hanzo: "The Blood Demon sword hungers for souls!",
  belerick: "Every living thing deserves respect.",
  badang: "Feel the power of my thousand fists!",
  khufra: "All shall bow before the Desert Tyrant!",
  esmeralda: "The stars tell me everything.",
  terizla: "Ten years of torture will be repaid!",
  'x-borg': "Fire! Burn everything to ashes!",
  dyrroth: "Kneel before the Prince of the Abyss!",
  baxia: "My shield protects the realm!",
  masha: "The spirit of the bear flows in my blood!",
  cecilion: "For Carmilla, I shall paint the night red.",
  carmilla: "Love transcends life and death.",
  atlas: "The deep sea holds no secrets from me.",
  popol: "Popol and Kupa are the best team!",
  'luo-yi': "Yin and Yang are in perpetual balance.",
  khaleed: "Ride the sands, face the storm!",
  barats: "Detona, snack time!",
  brody: "The memories never fade, the thunder never stops.",
  yve: "The galaxy must maintain equilibrium.",
  mathilda: "Fly with the guidance of the ancestral bird!",
  paquito: "Float like a butterfly, sting like a bee!",
  gloo: "We are one, we are many!",
  phoveus: "The eye sees all sins!",
  natan: "I have traveled through time to rewrite our fate.",
  aamon: "Assassins never walk in the light.",
  floryn: "Together with Dew, we can heal anything."
};

/* ============================================================================
   GAMING THEME MUSIC (BGM) & TACTILE AUDIO SYSTEM (Web Audio API)
   ============================================================================ */
const MLBB_Audio = {
  ctx: null,
  bgmAudio: null,
  bgmPlaying: false,
  bgmVolume: 0.28,
  bgmTrackIndex: Number(localStorage.getItem('mlbb_bgm_track') || 0),
  voices: [],
  voicesLoaded: false,
  activeSpeechBtn: null,
  interactionBound: false,

  bgmTracks: [
    { title: 'Battle of Dawn', subtitle: 'Epic Orchestral Battle Theme', src: 'audio/epic_theme.mp3' },
    { title: 'Sanctuary of Ancients', subtitle: 'Ambient Fantasy Theme', src: 'audio/ambient_theme.mp3' }
  ],

  init() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext not available:', e);
      }
    }
    this.initBGM();
    this.attachAutoTrigger();
  },

  initBGM() {
    if (this.bgmAudio) return;
    try {
      this.bgmAudio = new Audio();
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
      this.bgmAudio.preload = 'auto';

      const savedTrack = Number(localStorage.getItem('mlbb_bgm_track') || 0);
      this.bgmTrackIndex = (savedTrack >= 0 && savedTrack < this.bgmTracks.length) ? savedTrack : 0;
      this.bgmAudio.src = this.bgmTracks[this.bgmTrackIndex].src;

      this.bgmAudio.addEventListener('play', () => {
        this.bgmPlaying = true;
        this.updateBGMUI();
      });

      this.bgmAudio.addEventListener('pause', () => {
        this.bgmPlaying = false;
        this.updateBGMUI();
      });

      this.updateBGMUI();
    } catch (e) {
      console.warn('BGM Init error:', e);
    }
  },

  attachAutoTrigger() {
    if (this.interactionBound) return;
    this.interactionBound = true;

    const startBGMOnInteraction = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (state.bgmEnabled && !this.bgmPlaying) {
        this.playBGM();
      }
      document.removeEventListener('click', startBGMOnInteraction);
      document.removeEventListener('keydown', startBGMOnInteraction);
      document.removeEventListener('touchstart', startBGMOnInteraction);
    };

    document.addEventListener('click', startBGMOnInteraction, { once: true });
    document.addEventListener('keydown', startBGMOnInteraction, { once: true });
    document.addEventListener('touchstart', startBGMOnInteraction, { once: true });
  },

  playBGM() {
    this.init();
    if (!this.bgmAudio) return;
    this.bgmAudio.volume = this.bgmVolume;
    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.bgmPlaying = true;
        state.bgmEnabled = true;
        localStorage.setItem('mlbb_bgm_enabled', 'true');
        this.updateBGMUI();
      }).catch(err => {
        console.warn('Autoplay waiting for user gesture:', err);
      });
    }
  },

  pauseBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.bgmPlaying = false;
    state.bgmEnabled = false;
    localStorage.setItem('mlbb_bgm_enabled', 'false');
    this.updateBGMUI();
  },

  toggleBGM() {
    this.init();
    if (this.bgmPlaying) {
      this.pauseBGM();
    } else {
      this.playBGM();
    }
  },

  nextBGMTrack() {
    this.init();
    this.bgmTrackIndex = (this.bgmTrackIndex + 1) % this.bgmTracks.length;
    localStorage.setItem('mlbb_bgm_track', String(this.bgmTrackIndex));
    if (this.bgmAudio) {
      const wasPlaying = this.bgmPlaying;
      this.bgmAudio.src = this.bgmTracks[this.bgmTrackIndex].src;
      this.bgmAudio.currentTime = 0;
      if (wasPlaying || state.bgmEnabled) {
        this.playBGM();
      } else {
        this.updateBGMUI();
      }
    }
  },

  updateBGMUI() {
    const track = this.bgmTracks[this.bgmTrackIndex] || this.bgmTracks[0];
    const playIcon = document.getElementById('bgm-icon-play');
    const pauseIcon = document.getElementById('bgm-icon-pause');
    const label = document.getElementById('bgm-label');
    const bars = document.getElementById('bgm-eq-visualizer');
    const btn = document.getElementById('bgm-toggle-btn');
    const drawerBtn = document.getElementById('drawer-bgm-btn');

    if (playIcon) playIcon.style.display = this.bgmPlaying ? 'none' : 'inline-block';
    if (pauseIcon) pauseIcon.style.display = this.bgmPlaying ? 'inline-block' : 'none';
    if (label) label.textContent = this.bgmPlaying ? `🎵 ${track.title}` : `🎵 BGM: Paused`;
    if (bars) bars.style.display = this.bgmPlaying ? 'flex' : 'none';
    if (btn) btn.classList.toggle('bgm-active', this.bgmPlaying);
    if (drawerBtn) drawerBtn.textContent = this.bgmPlaying ? `🎵 ${track.title} (Playing)` : `🎵 BGM: Play`;
  },

  playGlassClick() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1850, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.055);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  },

  playHolographicSwish() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.06);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.12);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.13);
  },

  playVictoryChime() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const freqs = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.07, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.48);
    });
  },

  playHeroCommsChime() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  },

  toggleSoundscape(enable) {
    state.audioEnabled = enable;
    localStorage.setItem('mlbb_audio_enabled', String(enable));
    updateAudioButtonsUI();

    if (enable) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      this.playVictoryChime();
    }
  },

  currentVoiceAudio: null,
  activeVoiceBtn: null,

  playHeroVoice(heroId, heroName = '', btnEl = null) {
    if (!heroId) return;

    // Toggle off if currently playing
    if (this.currentVoiceAudio && this.activeVoiceBtn === btnEl) {
      this.stopHeroVoice();
      return;
    }

    // Stop any previously playing hero voice
    this.stopHeroVoice();

    this.init();
    this.playHeroCommsChime();

    const voices = (window.MLBB_STATIC_DATA && window.MLBB_STATIC_DATA.heroVoices) || {};
    const info = voices[heroId] || {};
    const localSrc = info.file || `audio/voices/${heroId}.ogg`;
    const remoteSrc = info.remoteUrl || '';

    // Visual button wave animation
    if (btnEl) {
      this.activeVoiceBtn = btnEl;
      btnEl.classList.add('speaking');
    }

    // Audio ducking: lower BGM volume during hero speech
    if (this.bgmAudio && this.bgmPlaying) {
      this.bgmAudio.volume = Math.max(0.06, this.bgmVolume * 0.25);
    }

    const audio = new Audio(localSrc);
    this.currentVoiceAudio = audio;
    audio.volume = 1.0;

    const cleanup = () => {
      if (btnEl) btnEl.classList.remove('speaking');
      if (this.activeVoiceBtn === btnEl) this.activeVoiceBtn = null;
      if (this.currentVoiceAudio === audio) this.currentVoiceAudio = null;
      if (this.bgmAudio && this.bgmPlaying) {
        this.bgmAudio.volume = this.bgmVolume;
      }
    };

    audio.onended = cleanup;
    audio.onerror = () => {
      // Fallback to remote wiki CDN if local audio can't load
      if (remoteSrc && audio.src !== remoteSrc) {
        audio.src = remoteSrc;
        audio.play().catch(cleanup);
        return;
      }
      cleanup();
    };

    audio.play().catch((err) => {
      console.warn('Hero voice playback:', err);
      cleanup();
    });
  },

  stopHeroVoice() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch (e) {}
      this.currentVoiceAudio = null;
    }
    if (this.activeVoiceBtn) {
      this.activeVoiceBtn.classList.remove('speaking');
      this.activeVoiceBtn = null;
    }
    if (this.bgmAudio && this.bgmPlaying) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  },

  speakHeroVoice(quote, heroName, role = '', btnEl = null) {
    const heroId = (heroName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.playHeroVoice(heroId, heroName, btnEl);
  }
};

function updateAudioButtonsUI() {
  const on = state.audioEnabled;
  const label = document.getElementById('audio-toggle-label');
  const iconOn = document.getElementById('audio-icon-on');
  const iconOff = document.getElementById('audio-icon-off');
  const btn = document.getElementById('audio-toggle-btn');
  const drawerBtn = document.getElementById('drawer-audio-btn');

  if (label) label.textContent = on ? 'SFX: ON' : 'SFX: OFF';
  if (iconOn) iconOn.style.display = on ? 'inline' : 'none';
  if (iconOff) iconOff.style.display = on ? 'none' : 'inline';
  if (btn) btn.classList.toggle('playing', on);
  if (drawerBtn) drawerBtn.textContent = on ? 'SFX: ON' : 'SFX: OFF';

  MLBB_Audio.updateBGMUI();
}

const QUIZ_QUESTIONS = [
  {
    type: 'Hero Ultimate',
    clue: 'Which Moniyan Imperial Vanguard Tank channels the power of Light to pull surrounding enemies inward and stun them for 1.5s with "Implosion"?',
    hint: 'He is Fanny\'s older brother from House Wertz.',
    options: ['Tigreal', 'Khufra', 'Atlas', 'Minotaur'],
    answer: 'Tigreal',
    entityType: 'hero',
    entityId: 'tigreal'
  },
  {
    type: 'Signature Weapon',
    clue: 'Which Tier-3 Attack equipment grants +160 Physical Attack and the "Despair" unique passive (+25% extra Physical Attack against enemies below 50% HP)?',
    hint: 'It is built from two Legion Swords and costs 3010 Gold.',
    options: ['Blade of Despair', 'Malefic Roar', 'Blade of the Heptaseas', 'Sea Halberd'],
    answer: 'Blade of Despair',
    entityType: 'item',
    entityId: 'blade-of-despair'
  },
  {
    type: 'Aerial Assassin',
    clue: 'Which Jungle Assassin uses "Steel Cable" to grapple between terrain walls at zero cooldown and gains up to 20% bonus damage from "Air Superiority"?',
    hint: 'She is known as the Blade Dancer and relies heavily on the Purple Buff.',
    options: ['Fanny', 'Ling', 'Gusion', 'Benedetta'],
    answer: 'Fanny',
    entityType: 'hero',
    entityId: 'fanny'
  },
  {
    type: 'Anti-Dash Tank',
    clue: 'Which Desert Tyrant from the Agelta Drylands wraps himself into a "Bouncing Ball" that knocks airborne any enemy hero attempting to blink or dash across him?',
    hint: 'He was sealed away centuries ago by the astrologer Eslora.',
    options: ['Khufra', 'Belerick', 'Gatotkaca', 'Hylos'],
    answer: 'Khufra',
    entityType: 'hero',
    entityId: 'khufra'
  },
  {
    type: 'Active Stasis Relic',
    clue: 'Which equipment item freezes the wielder for 2 seconds—rendering them untargetable and immune to all damage—without interrupting ongoing channels like Odette\'s Swan Song?',
    hint: 'It provides +45 Adaptive Attack, +400 HP, and +5% Cooldown Reduction.',
    options: ['Winter Crown', 'Wind of Nature', 'Immortality', 'Queen\'s Wings'],
    answer: 'Winter Crown',
    entityType: 'item',
    entityId: 'winter-crown'
  },
  {
    type: 'Onmyouji Master',
    clue: 'Which Mid Lane Mage wields the hundred-spirit "Seimei Umbrella", giving her 6 total skills and a built-in Crowd Control Purify on her second skill?',
    hint: 'She hails from the Cadia Riverlands alongside Hayabusa.',
    options: ['Kagura', 'Odette', 'Lunox', 'Pharsa'],
    answer: 'Kagura',
    entityType: 'hero',
    entityId: 'kagura'
  },
  {
    type: 'Team-Wide CC Immunity',
    clue: 'Which Eruditio Support hero casts "Time Journey" to immediately cleanse all debuffs from nearby allies and grant 3 seconds of team-wide Crowd Control Immunity?',
    hint: 'When eliminated, he turns into an untargetable Egg on the battlefield.',
    options: ['Diggie', 'Angela', 'Estes', 'Rafaela'],
    answer: 'Diggie',
    entityType: 'hero',
    entityId: 'diggie'
  },
  {
    type: 'Trinity On-Hit Core',
    clue: 'Which Attack Speed item converts Critical Chance into Attack Speed and causes every 3rd Basic Attack to trigger on-hit effects (like Demon Hunter Sword and Karrie\'s passive) an extra time?',
    hint: 'It is named after the mythical staff of the Monkey King.',
    options: ['Golden Staff', 'Corrosion Scythe', 'Feather of Heaven', 'Windtalker'],
    answer: 'Golden Staff',
    entityType: 'item',
    entityId: 'golden-staff'
  }
];

/* ============================================================================
   LOCALIZATION HELPERS (UI Strings & Game Term Translation)
   ============================================================================ */
function t(key) {
  const dict = window.MLBB_I18N && window.MLBB_I18N.ui;
  if (!dict) return key;
  const langPack = dict[state.lang] || dict.en;
  return langPack[key] || dict.en[key] || key;
}

function tRole(role) {
  if (state.lang === 'en') return role;
  const rMap = window.MLBB_I18N?.terms?.roles?.[role];
  return (rMap && rMap[state.lang]) || role;
}

function tLane(lane) {
  if (state.lang === 'en') return lane;
  const lMap = window.MLBB_I18N?.terms?.lanes?.[lane];
  return (lMap && lMap[state.lang]) || lane;
}

function tCat(cat) {
  if (state.lang === 'en') return cat;
  const cMap = window.MLBB_I18N?.terms?.categories?.[cat];
  return (cMap && cMap[state.lang]) || cat;
}

function tSlot(slot) {
  if (state.lang === 'en') return slot;
  const sMap = window.MLBB_I18N?.terms?.slots?.[slot];
  return (sMap && sMap[state.lang]) || slot;
}

function applyStaticDomTranslations() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  const qInput = document.getElementById('quick-search-input');
  if (qInput) qInput.placeholder = t('search_placeholder');

  // Update Language Toggle Button
  const langs = window.MLBB_I18N?.languages || [];
  const currentLangObj = langs.find(l => l.code === state.lang) || { code: 'en', short: 'EN', flag: '🌐' };
  const flagEl = document.getElementById('current-lang-flag');
  const codeEl = document.getElementById('current-lang-code');
  if (flagEl) flagEl.textContent = currentLangObj.flag;
  if (codeEl) codeEl.textContent = currentLangObj.short;

  // Update Direct Burmese 1-Click Toggle Pill (from Jay's Navbar)
  const burmeseBtn = document.getElementById('burmese-quick-toggle');
  const burmeseLabel = document.getElementById('burmese-toggle-label');
  if (burmeseBtn && burmeseLabel) {
    burmeseBtn.classList.toggle('active-burmese', state.lang === 'my');
    burmeseLabel.textContent = state.lang === 'my' ? 'မြန်မာ ✓' : 'EN / မြန်မာ';
  }

  document.documentElement.classList.remove('light');
  document.documentElement.classList.add('dark');
  updateFavoritesCountUI();
  renderLanguageDropdown();
}

function isFavorite(type, id) {
  const key = `${type}:${id}`;
  return state.favorites.includes(key);
}

function toggleFavorite(type, id) {
  const key = `${type}:${id}`;
  if (state.favorites.includes(key)) {
    state.favorites = state.favorites.filter(k => k !== key);
  } else {
    state.favorites.push(key);
  }
  localStorage.setItem('mlbb_favorites', JSON.stringify(state.favorites));
  updateFavoritesCountUI();

  // Refresh current view or modal button state
  if (state.currentRoute === 'mylist') renderMyListPage();
  else {
    document.querySelectorAll(`[data-fav-key="${key}"]`).forEach(btn => {
      btn.classList.toggle('saved', isFavorite(type, id));
      btn.innerHTML = isFavorite(type, id) ? '✓' : '+';
    });
  }
  if (state.activeModal && state.activeModal.type === type && state.activeModal.id === id) {
    if (type === 'hero') openHeroModal(id);
    else if (type === 'item') openItemModal(id);
    else if (type === 'lore') openLoreModal(id);
  }
}

function updateFavoritesCountUI() {
  const badge = document.getElementById('nav-fav-count');
  if (badge) {
    badge.textContent = String(state.favorites.length);
  }
}

function renderLanguageDropdown() {
  const menu = document.getElementById('lang-dropdown-menu');
  if (!menu || !window.MLBB_I18N) return;
  menu.innerHTML = window.MLBB_I18N.languages.map(l => `
    <button class="lang-option-btn ${l.code === state.lang ? 'active' : ''}" data-set-lang="${l.code}" role="menuitem">
      <span>${l.flag} ${l.label}</span>
      <span style="font-family: var(--font-mono); font-size: 0.72rem; opacity: 0.75;">${l.short}</span>
    </button>
  `).join('');
}

function setLanguage(langCode) {
  if (!window.MLBB_I18N?.ui?.[langCode]) return;
  state.lang = langCode;
  localStorage.setItem('mlbb_lang', langCode);
  applyStaticDomTranslations();

  // Re-render current active view
  if (state.currentRoute === 'heroes') renderHeroesPage();
  else if (state.currentRoute === 'items') renderItemsPage();
  else if (state.currentRoute === 'lore') renderLorePage();
  else if (state.currentRoute === 'emblems') renderEmblemsPage();
  else if (state.currentRoute === 'account') renderAccountPage();
  else if (state.currentRoute === 'draft') renderDraftPage();
  else if (state.currentRoute === 'sandbox') renderSandboxPage();
  else if (state.currentRoute === 'map') renderWorldMapPage();
  else if (state.currentRoute === 'mylist') renderMyListPage();
  else if (state.currentRoute === 'search') renderSearchPage();
  else renderHomeView();

  // If a modal is open, re-render it in the new language!
  if (state.activeModal) {
    const { type, id } = state.activeModal;
    if (type === 'hero') openHeroModal(id);
    else if (type === 'item') openItemModal(id);
    else if (type === 'lore') openLoreModal(id);
    else if (type === 'web') openConnectionWebModal();
  }
}

function setTheme() {
  state.theme = 'cyan';
  localStorage.setItem('mlbb_theme', 'cyan');
  document.body.setAttribute('data-theme', 'cyan');
}

/* ============================================================================
   3D IN-GAME HERO, SKILL & ARTIFACT ITEM RENDER ENGINE
   ============================================================================ */
function generateHeroPortraitSVG(hero, isBanner = false) {
  if (!hero) return '';
  const c1 = hero.themeColor || '#00e5ff';
  const c2 = hero.accentColor || '#10b981';
  const splashUrl = hero.splash || hero.cardArt || hero.portrait || '';
  const cardArtUrl = hero.cardArt || hero.cutout || hero.portrait || '';
  const cutoutUrl = hero.cutout || hero.cardArt || hero.portrait || '';

  // Wide 3D Floating Hero Showcase for Home Hero Banner, Lore Backdrop & Hero Detail Modal
  if (isBanner && (splashUrl || cardArtUrl)) {
    return `
      <div class="hero-3d-stage" style="width:100%;height:100%;position:relative;overflow:hidden;">
        <img
          src="${splashUrl}"
          alt="${hero.name}"
          loading="lazy"
          referrerpolicy="no-referrer"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 20%;filter:saturate(1.2) contrast(1.06) brightness(0.76);transform:scale(1.04);"
          onerror="this.style.display='none'"
        />
        <div class="arcane-astrolabe-wrap" aria-hidden="true">
          <svg viewBox="0 0 300 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="astrolabe-ring-cw">
              <circle cx="150" cy="150" r="138" stroke="rgba(0, 229, 255, 0.42)" stroke-width="1" stroke-dasharray="5 9"/>
              <circle cx="150" cy="150" r="122" stroke="rgba(0, 229, 255, 0.65)" stroke-width="1.4" stroke-dasharray="26 14 4 14"/>
              <polygon points="150,18 264,216 36,216" stroke="rgba(0, 229, 255, 0.25)" stroke-width="1"/>
            </g>
            <g class="astrolabe-ring-ccw">
              <circle cx="150" cy="150" r="96" stroke="rgba(251, 191, 36, 0.45)" stroke-width="1.2" stroke-dasharray="12 8"/>
              <polygon points="150,282 264,84 36,84" stroke="rgba(0, 229, 255, 0.28)" stroke-width="1"/>
            </g>
            <circle class="astrolabe-ring-pulse" cx="150" cy="150" r="68" stroke="rgba(0, 229, 255, 0.55)" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="hero-3d-floor-ring" style="left:74%;width:320px;bottom:8%;"></div>
        <img
          src="${cutoutUrl}"
          alt="${hero.name} 3D"
          loading="lazy"
          referrerpolicy="no-referrer"
          style="position:absolute;right:4%;bottom:0;height:96%;max-width:46%;object-fit:contain;object-position:bottom center;filter:drop-shadow(0 22px 28px rgba(0,0,0,0.92)) drop-shadow(0 0 22px rgba(0,229,255,0.45));animation:hero3DBreathe 4.8s ease-in-out infinite;z-index:3;"
          onerror="this.style.display='none'"
        />
      </div>
    `;
  }

  // Multi-Layer 3D Floating Hero Stage for Hero Cards & Mini Chips (No Glass Glare Layer Over Picture)
  if (cardArtUrl && cardArtUrl.startsWith('http')) {
    return `
      <div class="hero-3d-stage">
        <img
          class="hero-3d-bg-splash"
          src="${splashUrl}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.style.display='none'"
        />
        <div class="hero-3d-floor-ring" style="border-color:${c1};"></div>
        <img
          class="hero-3d-cutout-layer"
          src="${cardArtUrl}"
          alt="${hero.name}"
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="if(this.src!=='${hero.portrait || ''}'){this.src='${hero.portrait || ''}';}"
        />
      </div>
    `;
  }

  const uid = `${hero.id}-${isBanner ? 'b' : 'c'}`;
  const width = isBanner ? 1200 : 400;
  const height = isBanner ? 620 : 320;
  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="grad1-${uid}" cx="68%" cy="42%" r="75%">
          <stop offset="0%" stop-color="${c1}" stop-opacity="0.55"/>
          <stop offset="48%" stop-color="${c2}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#050b14" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1-${uid})"/>
      <text x="50%" y="52%" text-anchor="middle" fill="#ffffff" opacity="0.25" font-family="Outfit, sans-serif" font-weight="800" font-size="52" letter-spacing="2">${hero.name.toUpperCase()}</text>
    </svg>
  `;
}

function generateSkillIconSVG(skill, themeColor = '#00e5ff', index = 0) {
  if (skill.icon && skill.icon.startsWith('http')) {
    return `<img src="${skill.icon}" alt="${skill.name}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;" onerror="this.style.display='none'" />`;
  }
  const c = themeColor || '#00e5ff';
  const initial = skill.slot === 'Passive' ? 'P' : skill.slot === 'Ultimate' ? 'ULT' : `S${index}`;
  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#071224" stroke="${c}" stroke-width="2"/>
      <text x="32" y="38" text-anchor="middle" fill="#fff" font-family="Outfit, sans-serif" font-weight="700" font-size="16" letter-spacing="0.5">${initial}</text>
    </svg>
  `;
}

function generateItemSVG(item) {
  if (!item) return '';
  const c = item.color || '#00e5ff';
  if (item.icon) {
    const remote = item.remoteIcon || (item.icon.startsWith('http') ? item.icon : `https://mlbb.site/MLBB-BuildShare/http/img/items/${item.id}.png`);
    return `
      <div class="item-preview-box" style="--item-color:${c};--item-glow:${c}55;">
        <img
          class="item-preview-img"
          src="${item.icon}"
          data-remote="${remote}"
          alt="${item.name || 'MLBB Item'}"
          width="256"
          height="256"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src=this.dataset.remote;}else{this.style.display='none';}"
        />
      </div>
    `;
  }

  const uid = `itm-${item.id}`;
  return `
    <svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="aspect-ratio:1/1;">
      <defs>
        <radialGradient id="ig-${uid}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="${c}" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#071224" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="160" height="160" fill="url(#ig-${uid})"/>
      <circle cx="80" cy="80" r="52" fill="${c}" opacity="0.4" stroke="#fff" stroke-width="3"/>
    </svg>
  `;
}

/* ============================================================================
   DATA INITIALIZATION FROM /data/*.json (With Offline Fallback)
   ============================================================================ */
async function loadDatabase() {
  try {
    let heroesData, itemsData, loreData, emblemData, accountData, voicesData;

    try {
      const [heroesRes, itemsRes, loreRes, emblemsRes, accountRes, voicesRes] = await Promise.all([
        fetch('data/heroes.json'),
        fetch('data/items.json'),
        fetch('data/lore.json'),
        fetch('data/emblems.json'),
        fetch('data/account.json'),
        fetch('data/voices.json').catch(() => null)
      ]);
      if (!heroesRes.ok) throw new Error('HTTP status ' + heroesRes.status);
      heroesData = await heroesRes.json();
      itemsData = await itemsRes.json();
      loreData = await loreRes.json();
      emblemData = await emblemsRes.json();
      accountData = accountRes.ok ? await accountRes.json() : (window.MLBB_STATIC_DATA && window.MLBB_STATIC_DATA.account);
      voicesData = (voicesRes && voicesRes.ok) ? await voicesRes.json() : null;
    } catch (fetchErr) {
      if (window.MLBB_STATIC_DATA) {
        heroesData = window.MLBB_STATIC_DATA.heroes;
        itemsData = window.MLBB_STATIC_DATA.items;
        loreData = window.MLBB_STATIC_DATA.lore;
        emblemData = window.MLBB_STATIC_DATA.emblems;
        accountData = window.MLBB_STATIC_DATA.account;
        voicesData = window.MLBB_STATIC_DATA.heroVoices;
      } else {
        throw fetchErr;
      }
    }

    if (voicesData) {
      window.MLBB_STATIC_DATA = window.MLBB_STATIC_DATA || {};
      window.MLBB_STATIC_DATA.heroVoices = voicesData;
    }

    const savedLocalAccount = localStorage.getItem('mlbb_account_data');
    if (savedLocalAccount) {
      try {
        state.account = JSON.parse(savedLocalAccount);
      } catch (e) {
        state.account = accountData;
      }
    } else {
      state.account = accountData;
    }

    state.heroes = heroesData || [];
    state.items = itemsData || [];
    state.lore = loreData || [];
    state.emblems = (emblemData && emblemData.emblems) || [];
    state.battleSpells = (emblemData && emblemData.battleSpells) || [];

    state.heroes.forEach(h => state.heroMap.set(h.id, h));
    state.items.forEach(i => state.itemMap.set(i.id, i));
    state.lore.forEach(l => state.loreMap.set(l.id, l));
    state.emblems.forEach(e => state.emblemMap.set(e.id, e));

    setTheme(state.theme);
    applyStaticDomTranslations();
    handleRouting();
  } catch (err) {
    console.error('Failed to load JSON data:', err);
  }
}

/* ============================================================================
   ROUTING & NAVIGATION CONTROLLER
   ============================================================================ */
function handleRouting() {
  const rawHash = window.location.hash.replace(/^#/, '') || 'home';
  const [routePart, queryString] = rawHash.split('?');
  const params = new URLSearchParams(queryString || '');

  if (routePart.startsWith('hero/')) {
    const heroId = routePart.split('/')[1];
    if (document.querySelector('.hero-banner-skeleton')) renderHomeView();
    openHeroModal(heroId);
    return;
  }
  if (routePart.startsWith('item/')) {
    const itemId = routePart.split('/')[1];
    if (document.querySelector('.hero-banner-skeleton')) renderHomeView();
    openItemModal(itemId);
    return;
  }
  if (routePart.startsWith('lore/')) {
    const loreId = routePart.split('/')[1];
    if (document.querySelector('.hero-banner-skeleton')) renderHomeView();
    openLoreModal(loreId);
    return;
  }

  closeModal(false);
  state.currentRoute = routePart;
  updateActiveNavLinks(routePart);

  if (routePart === 'heroes') {
    if (params.get('role')) state.heroFilter.role = params.get('role');
    if (params.get('lane')) state.heroFilter.lane = params.get('lane');
    renderHeroesPage();
  } else if (routePart === 'items') {
    if (params.get('cat')) state.itemFilter.category = params.get('cat');
    renderItemsPage();
  } else if (routePart === 'lore') {
    renderLorePage();
  } else if (routePart === 'emblems') {
    renderEmblemsPage();
  } else if (routePart === 'account') {
    renderAccountPage();
  } else if (routePart === 'draft') {
    renderDraftPage();
  } else if (routePart === 'sandbox') {
    if (params.get('hero')) state.sandbox.heroId = params.get('hero');
    renderSandboxPage();
  } else if (routePart === 'map') {
    renderWorldMapPage();
  } else if (routePart === 'mylist') {
    renderMyListPage();
  } else if (routePart === 'search') {
    if (params.get('q')) state.searchQuery = params.get('q');
    renderSearchPage();
  } else {
    renderHomeView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNavLinks(route) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === route);
  });
}

/* ============================================================================
   CARD RENDERERS (Jay Reference Layout: Top-Right + Fav Button, Complexity ◆◇, Connection Count)
   ============================================================================ */
function renderComplexityDiamonds(difficulty = 5) {
  const level = Math.max(1, Math.min(3, Math.ceil(difficulty / 3.4)));
  return `<span class="complexity-diamonds" title="${t('difficulty')} ${difficulty}/10">${'◆'.repeat(level)}${'◇'.repeat(3 - level)}</span>`;
}

function createHeroCardHTML(hero) {
  const saved = isFavorite('hero', hero.id);
  const connCount = (hero.build?.items?.length || 0) + (hero.relations?.synergies?.length || 0) + (hero.relations?.counters?.length || 0);
  return `
    <article class="catalog-card" data-open-hero="${hero.id}" tabindex="0" role="button" aria-label="${hero.name} — ${hero.title}">
      <div class="card-visual portrait-ratio">
        ${generateHeroPortraitSVG(hero, false)}
        <div class="card-gradient-overlay"></div>
        <div class="card-top-badges">
          <div style="display:flex;gap:4px;align-items:center;">
            <span class="role-chip">${hero.roles.map(tRole).join(' / ')}</span>
            <span class="lane-chip">${tLane(hero.lanes[0])}</span>
          </div>
          <button type="button" class="card-fav-btn ${saved ? 'saved' : ''}" data-fav-toggle="hero:${hero.id}" data-fav-key="hero:${hero.id}" title="${saved ? t('in_my_list') : t('add_my_list')}">
            ${saved ? '✓' : '+'}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <h3 class="card-title">${hero.name}</h3>
          ${renderComplexityDiamonds(hero.difficulty)}
        </div>
        <p class="card-subtitle">${hero.title}</p>
        <div class="card-footer-meta">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;">${hero.specialties.slice(0, 2).join(' • ')}</span>
          <span class="conn-badge" title="Connected Builds & Matchups">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            ${connCount}
          </span>
        </div>
      </div>
    </article>
  `;
}

function createItemCardHTML(item) {
  const saved = isFavorite('item', item.id);
  const connCount = (item.buildsFrom?.length || 0) + (item.buildsInto?.length || 0) + (item.recommendedHeroes?.length || 0);
  return `
    <article class="catalog-card item-catalog-card" data-open-item="${item.id}" tabindex="0" role="button" aria-label="${item.name}">
      <div class="card-visual item-card-visual">
        ${generateItemSVG(item)}
        <div class="card-top-badges">
          <span class="price-chip">🪙 ${item.price}g</span>
          <button type="button" class="card-fav-btn ${saved ? 'saved' : ''}" data-fav-toggle="item:${item.id}" data-fav-key="item:${item.id}" title="${saved ? t('in_my_list') : t('add_my_list')}">
            ${saved ? '✓' : '+'}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <h3 class="card-title">${item.name}</h3>
          <span style="font-size:0.65rem;color:var(--text-secondary);">T${item.tier}</span>
        </div>
        <p class="card-subtitle">${tCat(item.category)} • ${item.stats[0] || ''}</p>
        <div class="card-footer-meta">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;">${item.buildsInto.length ? `${t('upgrades_count')} (${item.buildsInto.length})` : t('final_tier')}</span>
          <span class="conn-badge" title="Recipe & Hero Links">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            ${connCount}
          </span>
        </div>
      </div>
    </article>
  `;
}

function createLoreCardHTML(lore) {
  const saved = isFavorite('lore', lore.id);
  const leadHero = state.heroMap.get(lore.relatedHeroes[0]) || state.heroes[0];
  const connCount = (lore.relatedHeroes?.length || 0) + (lore.relatedItems?.length || 0);
  return `
    <article class="catalog-card" style="flex: 0 0 290px;" data-open-lore="${lore.id}" tabindex="0" role="button" aria-label="${lore.title}">
      <div class="card-visual">
        ${generateHeroPortraitSVG(leadHero, false)}
        <div class="card-gradient-overlay"></div>
        <div class="card-top-badges">
          <span class="lane-chip">✦ ${lore.region}</span>
          <button type="button" class="card-fav-btn ${saved ? 'saved' : ''}" data-fav-toggle="lore:${lore.id}" data-fav-key="lore:${lore.id}" title="${saved ? t('in_my_list') : t('add_my_list')}">
            ${saved ? '✓' : '+'}
          </button>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${lore.title}</h3>
        <p class="card-subtitle">${lore.summary}</p>
        <div class="card-footer-meta">
          <span>${lore.era} • ${lore.readTime}</span>
          <span class="conn-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            ${connCount}
          </span>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================================
   HOME VIEW (Liquid Glass Showcase Banner + Horizontal Carousels)
   ============================================================================ */
function renderHomeView() {
  const featuredHeroes = state.heroes.filter(h => h.featuredBanner);
  const currentBannerHero = featuredHeroes[state.bannerIndex % featuredHeroes.length] || state.heroes[0];
  const heroVoice = window.MLBB_STATIC_DATA?.heroVoices?.[currentBannerHero.id];
  const signatureQuote = heroVoice?.quote || MLBB_HERO_VOICE_LINES[currentBannerHero.id] || (currentBannerHero.story.quotes && currentBannerHero.story.quotes[0]) || currentBannerHero.title;

  // Curated spotlight heroes (8 iconic meta heroes across diverse roles)
  const spotlightHeroIds = ['gusion', 'chou', 'fanny', 'ling', 'beatrix', 'tigreal', 'miya', 'alucard'];
  const trendingHeroes = spotlightHeroIds.map(id => state.heroMap.get(id)).filter(Boolean);

  // Curated core tier-3 equipment (8 iconic in-game items)
  const coreItemIds = ['blade-of-despair', 'berserkers-fury', 'endless-battle', 'immortality', 'holy-crystal', 'demon-hunter-sword', 'blood-wings', 'athenas-shield'];
  const curatedItems = coreItemIds.map(id => state.itemMap.get(id)).filter(Boolean);

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <!-- CLEAN SPOTLIGHT HERO SHOWCASE BANNER -->
    <section class="hero-banner" id="showcase-banner">
      <div class="hero-banner-bg" id="banner-bg-art">
        ${generateHeroPortraitSVG(currentBannerHero, true)}
      </div>
      <div class="hero-banner-vignette"></div>
      <div class="hero-banner-content">
        <div class="banner-kicker">
          <span class="banner-kicker-badge">MLBB SPOTLIGHT</span>
          <span>${currentBannerHero.faction.toUpperCase()} • ${currentBannerHero.roles.map(tRole).join(' / ')}</span>
        </div>
        <h1 class="banner-title" style="margin-bottom:0.35rem;">${currentBannerHero.name}</h1>
        <p style="font-size:1.05rem;font-style:italic;color:var(--accent-primary);margin-bottom:0.75rem;font-weight:600;">"${signatureQuote}"</p>
        <div class="banner-meta" style="margin-bottom:0.85rem;">
          <span class="meta-pill">${currentBannerHero.lanes.map(tLane).join(' • ')} ${t('lane_suffix')}</span>
          <span class="meta-pill">${t('difficulty')} ${currentBannerHero.difficulty}/10</span>
          <span class="meta-pill">${currentBannerHero.attackType}</span>
        </div>
        <p class="banner-desc" style="max-height:3.6em;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:1.2rem;">${currentBannerHero.summary}</p>
        <div class="banner-actions">
          <button class="btn-primary" data-open-hero="${currentBannerHero.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>${t('explore_hero')}</span>
          </button>
          <button class="liquid-pill-btn hero-voice-btn" data-play-hero-voice="${currentBannerHero.id}" style="padding:0.6rem 1.2rem;font-size:0.86rem;background:rgba(0,229,255,0.14);border-color:var(--accent-primary);color:#fff;">
            <span>🔊 Play Voice</span>
            <div class="voice-anim-bars" style="display:none;"><span></span><span></span><span></span><span></span></div>
          </button>
          <button class="btn-secondary hide-xs" data-open-lore="${currentBannerHero.story.loreId}">
            <span>${t('read_lore')}</span>
          </button>
        </div>
      </div>

      <div class="banner-switcher" aria-label="Featured Hero Switcher">
        ${featuredHeroes.map((h, idx) => `
          <button class="banner-dot ${idx === (state.bannerIndex % featuredHeroes.length) ? 'active' : ''}" data-banner-idx="${idx}" aria-label="Spotlight ${h.name}"></button>
        `).join('')}
      </div>
    </section>

    <!-- CLEAN QUICK-ACCESS COMMAND HUB -->
    <div class="home-command-hub">
      <div class="command-hub-title">
        <span>⚡ Command Hub &amp; Quick Portals</span>
      </div>
      <div class="command-hub-grid">
        <a href="#heroes" class="hub-launch-card">
          <div class="hub-icon-wrap">🛡️</div>
          <div class="hub-card-title"><span>Heroes Codex</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Browse all 133 heroes with lane, role, and base attributes.</p>
        </a>

        <a href="#items" class="hub-launch-card">
          <div class="hub-icon-wrap">⚔️</div>
          <div class="hub-card-title"><span>Equipment Forge</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Explore 95 in-game items, tier-3 passives &amp; recipe trees.</p>
        </a>

        <a href="#map" class="hub-launch-card">
          <div class="hub-icon-wrap">🗺️</div>
          <div class="hub-card-title"><span>Land of Dawn Map</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Interactive world map with 7 territory realms and lore.</p>
        </a>

        <a href="#sandbox" class="hub-launch-card">
          <div class="hub-icon-wrap">🧪</div>
          <div class="hub-card-title"><span>Pro Build Lab</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Real-time DPS simulator with 6-item custom equipment slots.</p>
        </a>

        <a href="#draft" class="hub-launch-card">
          <div class="hub-icon-wrap">🎯</div>
          <div class="hub-card-title"><span>Smart Draft Matrix</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Real-time team composition and counter-pick planner.</p>
        </a>

        <a href="#account" class="hub-launch-card">
          <div class="hub-icon-wrap">🏆</div>
          <div class="hub-card-title"><span>Commander Profile</span><span class="hub-card-arrow">&rarr;</span></div>
          <p class="hub-card-desc">Match history, win rates, and live Moonton API gateway.</p>
        </a>
      </div>
    </div>

    <!-- CURATED SPOTLIGHT ROWS (ONLY 2 CLEAN ROWS INSTEAD OF 7) -->
    <div class="catalog-section" style="margin-top:0;">
      ${renderCarouselRowHTML(`⭐ Trending Meta Heroes (${trendingHeroes.length})`, '#heroes', trendingHeroes.map(createHeroCardHTML).join(''))}
      ${renderCarouselRowHTML(`⚡ Core Tier-3 Equipment (${curatedItems.length})`, '#items', curatedItems.map(createItemCardHTML).join(''))}
    </div>
  `;

  setupCarouselArrows();
}

function renderCarouselRowHTML(title, exploreHref, cardsHTML) {
  return `
    <section class="carousel-row">
      <div class="row-header">
        <h2 class="row-title">${title}</h2>
        <a href="${exploreHref}" class="row-explore-link">${t('explore_all')} &rarr;</a>
      </div>
      <div class="carousel-wrapper">
        <button class="carousel-arrow left" aria-label="Scroll Left">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="carousel-track">
          ${cardsHTML}
        </div>
        <button class="carousel-arrow right" aria-label="Scroll Right">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </section>
  `;
}

function setupCarouselArrows() {
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const leftBtn = wrapper.querySelector('.carousel-arrow.left');
    const rightBtn = wrapper.querySelector('.carousel-arrow.right');
    if (!track) return;

    leftBtn?.addEventListener('click', () => {
      track.scrollBy({ left: -Math.max(360, track.clientWidth * 0.75), behavior: 'smooth' });
    });
    rightBtn?.addEventListener('click', () => {
      track.scrollBy({ left: Math.max(360, track.clientWidth * 0.75), behavior: 'smooth' });
    });
  });
}

/* ============================================================================
   HEROES CATALOG PAGE
   ============================================================================ */
function renderHeroesPage() {
  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const lanes = ['All', 'Gold', 'EXP', 'Mid', 'Jungle', 'Roam'];

  const filtered = state.heroes.filter(h => {
    const matchRole = state.heroFilter.role === 'All' || h.roles.includes(state.heroFilter.role);
    const matchLane = state.heroFilter.lane === 'All' || h.lanes.includes(state.heroFilter.lane);
    return matchRole && matchLane;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('heroes_title')}</h1>
          <p class="page-subtitle">${t('heroes_subtitle')}</p>
        </div>
        <div class="meta-pill">${filtered.length} ${t('heroes_shown')}</div>
      </div>

      <div class="filter-toolbar">
        <div class="pill-group" role="group" aria-label="Filter by Role">
          ${roles.map(r => `
            <button class="filter-pill ${state.heroFilter.role === r ? 'active' : ''}" data-hero-role="${r}">${r === 'All' ? t('all_roles') : tRole(r)}</button>
          `).join('')}
        </div>
        <div class="pill-group" role="group" aria-label="Filter by Lane">
          ${lanes.map(l => `
            <button class="filter-pill ${state.heroFilter.lane === l ? 'active' : ''}" data-hero-lane="${l}">${l === 'All' ? t('all_lanes') : `${tLane(l)}`}</button>
          `).join('')}
        </div>
      </div>

      <div class="catalog-grid">
        ${filtered.map(createHeroCardHTML).join('')}
      </div>
    </section>
  `;
}

/* ============================================================================
   ITEMS & RECIPE TREES PAGE
   ============================================================================ */
function renderItemsPage() {
  const categories = ['All', 'Attack', 'Magic', 'Defense', 'Movement', 'Jungling', 'Roaming'];
  const tiers = ['All', '3', '2', '1'];

  const filtered = state.items.filter(item => {
    const matchCat = state.itemFilter.category === 'All' || item.category === state.itemFilter.category;
    const matchTier = state.itemFilter.tier === 'All' || String(item.tier) === state.itemFilter.tier;
    return matchCat && matchTier;
  });

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('items_title')}</h1>
          <p class="page-subtitle">${t('items_subtitle')}</p>
        </div>
        <div class="meta-pill">${filtered.length} ${t('items_shown')}</div>
      </div>

      <div class="filter-toolbar">
        <div class="pill-group" role="group" aria-label="Item Category">
          ${categories.map(c => `
            <button class="filter-pill ${state.itemFilter.category === c ? 'active' : ''}" data-item-cat="${c}">${c === 'All' ? t('all_categories') : tCat(c)}</button>
          `).join('')}
        </div>
        <div class="pill-group" role="group" aria-label="Item Tier">
          ${tiers.map(tierVal => `
            <button class="filter-pill ${state.itemFilter.tier === tierVal ? 'active' : ''}" data-item-tier="${tierVal}">${tierVal === 'All' ? t('all_tiers') : `${t('tier_label')} ${tierVal}`}</button>
          `).join('')}
        </div>
      </div>

      <div class="catalog-grid">
        ${filtered.map(createItemCardHTML).join('')}
      </div>
    </section>
  `;
}

/* ============================================================================
   LORE & FACTIONS PAGE
   ============================================================================ */
function renderLorePage() {
  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('lore_title')}</h1>
          <p class="page-subtitle">${t('lore_subtitle')}</p>
        </div>
      </div>

      <div class="catalog-grid" style="grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));">
        ${state.lore.map(createLoreCardHTML).join('')}
      </div>
    </section>
  `;
}

/* ============================================================================
   EMBLEMS & BATTLE SPELLS PAGE
   ============================================================================ */
function renderEmblemsPage() {
  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('emblems_title')}</h1>
          <p class="page-subtitle">${t('emblems_subtitle')}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; margin-bottom: 3rem;">
        ${state.emblems.map(emb => `
          <div class="info-panel emblem-card" style="border-top: 3px solid ${emb.color};">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:0.85rem;">
              ${emb.icon ? `
                <div class="emblem-3d-icon-wrap" style="border-color:${emb.color};">
                  <img src="${emb.icon}" alt="${emb.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'" />
                </div>
              ` : ''}
              <div style="flex:1;">
                <div class="panel-heading" style="color: ${emb.color};margin-bottom:4px;">
                  <span>${emb.role}</span>
                  <span>Lv. 60 Max</span>
                </div>
                <h2 style="font-size: 1.35rem; margin-bottom: 0;">${emb.name}</h2>
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.86rem; margin-bottom: 0.85rem;">${emb.description}</p>
            <div class="specialty-row" style="margin-bottom: 1rem;">
              ${emb.attributes.map(a => `<span class="meta-pill">${a}</span>`).join('')}
            </div>
            <div style="margin-bottom: 0.75rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">${t('core_talents')}</div>
              ${emb.coreTalents.map(tal => `
                <div style="background: rgba(255,255,255,0.04); padding: 8px 10px; border-radius: 8px; margin-bottom: 6px; font-size: 0.82rem;">
                  <strong style="color: #fff;">${tal.name}:</strong> <span style="color: var(--text-secondary);">${tal.effect}</span>
                </div>
              `).join('')}
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">${t('signature_heroes')}</div>
              <div class="specialty-row">
                ${emb.recommendedHeroes.map(hid => {
                  const h = state.heroMap.get(hid);
                  return h ? `<button class="filter-pill" style="padding: 4px 10px; font-size: 0.75rem;" data-open-hero="${h.id}">${h.name}</button>` : '';
                }).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <h2 class="row-title" style="margin-bottom: 1rem;">${t('battle_spells')}</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${state.battleSpells.map(sp => `
          <div class="info-panel">
            <div class="panel-heading" style="color: ${sp.color};">
              <span>${t('battle_spell')}</span>
              <span>CD: ${sp.cooldown}</span>
            </div>
            <h3 style="margin-bottom: 0.4rem;">${sp.name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.8rem;">${sp.description}</p>
            <div class="specialty-row">
              ${sp.bestFor.map(hid => {
                const h = state.heroMap.get(hid);
                return h ? `<button class="filter-pill" style="padding: 3px 9px; font-size: 0.72rem;" data-open-hero="${h.id}">${h.name}</button>` : '';
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/* ============================================================================
   MY SAVED LIST PAGE & KNOWLEDGE QUIZ MODAL (From Jay's Reference)
   ============================================================================ */
function renderMyListPage() {
  const favHeroes = [];
  const favItems = [];
  const favLore = [];

  state.favorites.forEach(entry => {
    const [type, id] = entry.split(':');
    if (type === 'hero' && state.heroMap.has(id)) favHeroes.push(state.heroMap.get(id));
    else if (type === 'item' && state.itemMap.has(id)) favItems.push(state.itemMap.get(id));
    else if (type === 'lore' && state.loreMap.has(id)) favLore.push(state.loreMap.get(id));
  });

  const totalSaved = favHeroes.length + favItems.length + favLore.length;
  const main = document.getElementById('app-main');

  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('mylist_title')}</h1>
          <p class="page-subtitle">${t('mylist_subtitle')}</p>
        </div>
        <div class="meta-pill">${totalSaved} Saved</div>
      </div>

      ${totalSaved === 0 ? `
        <div class="info-panel" style="text-align:center;padding:3rem 1.5rem;">
          <p style="font-size:1rem;color:var(--text-secondary);margin-bottom:1.2rem;">${t('mylist_empty')}</p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <a href="#heroes" class="btn-primary">${t('nav_heroes')}</a>
            <a href="#items" class="btn-secondary">${t('nav_items')}</a>
          </div>
        </div>
      ` : ''}

      ${favHeroes.length ? `
        <h2 class="row-title" style="margin:1.2rem 0 0.85rem;">${t('nav_heroes')} (${favHeroes.length})</h2>
        <div class="catalog-grid" style="margin-bottom:2rem;">
          ${favHeroes.map(createHeroCardHTML).join('')}
        </div>
      ` : ''}

      ${favItems.length ? `
        <h2 class="row-title" style="margin:1.2rem 0 0.85rem;">${t('nav_items')} (${favItems.length})</h2>
        <div class="catalog-grid" style="margin-bottom:2rem;">
          ${favItems.map(createItemCardHTML).join('')}
        </div>
      ` : ''}

      ${favLore.length ? `
        <h2 class="row-title" style="margin:1.2rem 0 0.85rem;">${t('nav_lore')} (${favLore.length})</h2>
        <div class="catalog-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
          ${favLore.map(createLoreCardHTML).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

/* ============================================================================
   SMART DRAFT & COUNTER-PICK MATRIX (#draft)
   ============================================================================ */
function renderDraftPage() {
  const lanes = ['EXP', 'Jungle', 'Mid', 'Gold', 'Roam'];
  const enemyHeroes = state.draft.enemy.map(hid => hid ? state.heroMap.get(hid) : null);
  const pickedCount = enemyHeroes.filter(Boolean).length;

  // Analysis computations
  let physCount = 0, magicCount = 0, trueCount = 0;
  let ccScore = 0, sustainScore = 0, mobilityScore = 0;

  enemyHeroes.forEach(h => {
    if (!h) return;
    if (h.attackType === 'Magic' || h.roles.includes('Mage')) magicCount += 1;
    else if (h.specialties.includes('True Damage')) trueCount += 1;
    else physCount += 1;

    if (h.roles.includes('Tank') || h.specialties.includes('Crowd Control')) ccScore += 2;
    if (h.specialties.includes('Regen') || ['yu-zhong', 'estes', 'ruby', 'fredrinn', 'uranus'].includes(h.id)) sustainScore += 2.5;
    if (h.specialties.includes('Charge') || ['fanny', 'ling', 'hayabusa', 'nolan', 'joy'].includes(h.id)) mobilityScore += 2.5;
  });

  const totalDmgType = Math.max(1, physCount + magicCount + trueCount);
  const physPct = Math.round((physCount / totalDmgType) * 100);
  const magicPct = Math.round((magicCount / totalDmgType) * 100);
  const truePct = 100 - physPct - magicPct;

  // Compute recommended counter draft
  const recommendedCounters = lanes.map((lane, idx) => {
    const enemyHero = enemyHeroes[idx];
    if (enemyHero) {
      const counterId = enemyHero.relations?.weakAgainst?.[0] || enemyHero.relations?.counters?.[0];
      const counterHero = state.heroMap.get(counterId) || state.heroes.find(h => h.lanes.includes(lane) && h.id !== enemyHero.id);
      return {
        lane,
        counterHero,
        reason: counterHero ? `Strong lane advantage against ${enemyHero.name}. Punishes their power spikes.` : `Pick meta ${lane} pick to disrupt enemy formation.`
      };
    } else {
      const defaultHero = state.heroes.find(h => h.lanes.includes(lane) && !enemyHeroes.some(eh => eh?.id === h.id));
      return {
        lane,
        counterHero: defaultHero,
        reason: `High tier meta anchor for ${lane} Lane.`
      };
    }
  });

  // Recommended Anti-Equipment
  const counterItems = [];
  if (sustainScore >= 2 || enemyHeroes.some(h => ['estes', 'floryn', 'yu-zhong', 'ruby', 'alucard', 'uranus'].includes(h?.id))) {
    counterItems.push(state.itemMap.get('dominance-ice'), state.itemMap.get('sea-halberd'), state.itemMap.get('glowing-wand'));
  }
  if (magicPct >= 40) {
    counterItems.push(state.itemMap.get('radiant-armor'), state.itemMap.get('athenas-shield'));
  }
  if (physPct >= 50) {
    counterItems.push(state.itemMap.get('antique-cuirass'), state.itemMap.get('blade-armor'), state.itemMap.get('wind-of-nature'));
  }
  if (counterItems.length < 4) {
    counterItems.push(state.itemMap.get('winter-crown'), state.itemMap.get('immortality'));
  }
  const cleanCounterItems = [...new Set(counterItems.filter(Boolean))].slice(0, 6);

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section" style="padding-top:1.5rem;">
      <div class="page-header" style="margin-bottom:1.4rem;">
        <div>
          <div class="banner-kicker">
            <span class="banner-kicker-badge">STRATEGY MATRIX</span>
            <span>REAL-TIME DRAFT COUNTER ENGINE</span>
          </div>
          <h1 class="page-title">${t('draft_title')}</h1>
          <p class="page-subtitle">${t('draft_subtitle')}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="liquid-pill-btn" id="draft-preset-dive">Preset: Dive</button>
          <button type="button" class="liquid-pill-btn" id="draft-preset-sustain">Preset: Sustain</button>
          <button type="button" class="liquid-pill-btn" id="draft-preset-burst">Preset: Burst CC</button>
          <button type="button" class="liquid-pill-btn" id="draft-clear-all" style="border-color:rgba(244,63,94,0.4);color:#fb7185;">Clear</button>
        </div>
      </div>

      <div class="draft-container">
        <!-- MATCHUP ARENA: ENEMY LINEUP VS COUNTER LINEUP -->
        <div class="draft-matchup-arena">
          <!-- ENEMY TEAM SELECTION -->
          <div class="draft-team-col">
            <div class="draft-team-header" style="border-left:3px solid #f43f5e;">
              <span style="font-weight:700;color:#fb7185;letter-spacing:0.8px;">ENEMY LINEUP (${pickedCount}/5)</span>
              <span style="font-size:0.75rem;color:var(--text-secondary);">Click slot to assign</span>
            </div>

            ${lanes.map((lane, idx) => {
              const h = enemyHeroes[idx];
              if (h) {
                return `
                  <div class="draft-slot" data-open-draft-slot="${idx}">
                    <div class="draft-slot-thumb">
                      ${generateHeroPortraitSVG(h, false)}
                    </div>
                    <div>
                      <div style="font-weight:700;color:#fff;font-size:0.95rem;">${h.name}</div>
                      <div style="display:flex;gap:6px;margin-top:2px;">
                        <span class="lane-chip" style="font-size:0.68rem;padding:1px 6px;">${lane}</span>
                        <span style="font-size:0.72rem;color:var(--text-secondary);">${h.roles.join('/')}</span>
                      </div>
                    </div>
                    <button type="button" class="icon-btn" data-remove-draft-slot="${idx}" title="Remove Hero" style="width:28px;height:28px;">
                      ✕
                    </button>
                  </div>
                `;
              } else {
                return `
                  <div class="draft-slot empty-slot" data-open-draft-slot="${idx}">
                    <div class="draft-slot-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1.4rem;">
                      +
                    </div>
                    <div>
                      <div style="color:var(--text-secondary);font-size:0.88rem;">Select Enemy ${lane}</div>
                      <span class="lane-chip" style="font-size:0.65rem;padding:1px 6px;">${lane} Lane</span>
                    </div>
                    <span style="font-size:0.75rem;color:var(--accent-primary);">Pick &rarr;</span>
                  </div>
                `;
              }
            }).join('')}
          </div>

          <!-- VERSUS DIVIDER -->
          <div class="draft-vs-divider">
            <div class="draft-vs-badge">VS</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);font-family:var(--font-mono);text-align:center;">
              COUNTER<br>MATRIX
            </div>
          </div>

          <!-- SMART RECOMMENDED COUNTER TEAM -->
          <div class="draft-team-col">
            <div class="draft-team-header" style="border-left:3px solid var(--accent-primary);">
              <span style="font-weight:700;color:var(--accent-primary);letter-spacing:0.8px;">RECOMMENDED COUNTER TEAM</span>
              <span style="font-size:0.75rem;color:#38bdf8;">Adaptive Synergy</span>
            </div>

            ${recommendedCounters.map((rc, idx) => {
              const h = rc.counterHero;
              return `
                <div class="draft-slot" data-open-hero="${h?.id || ''}" style="border-color:rgba(0,229,255,0.38);">
                  <div class="draft-slot-thumb">
                    ${h ? generateHeroPortraitSVG(h, false) : ''}
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                      <div style="font-weight:700;color:#fff;font-size:0.95rem;">${h?.name || 'Counter Pick'}</div>
                      <span style="font-size:0.7rem;color:var(--accent-primary);font-weight:700;">★ Optimal</span>
                    </div>
                    <div style="font-size:0.72rem;color:#cbd5e1;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px;">
                      ${rc.reason}
                    </div>
                  </div>
                  <span style="font-size:0.75rem;color:var(--accent-primary);">&rarr;</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- TELEMETRY ANALYSIS METRICS -->
        <div class="draft-metric-row">
          <div class="draft-metric-card info-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Damage Profile</span>
              <span style="font-size:0.75rem;font-family:var(--font-mono);color:#fff;">${physPct}% Phys / ${magicPct}% Mag</span>
            </div>
            <div class="draft-bar-track" style="display:flex;">
              <div class="draft-bar-fill" style="width:${physPct}%;background:#f43f5e;" title="Physical ${physPct}%"></div>
              <div class="draft-bar-fill" style="width:${magicPct}%;background:#38bdf8;" title="Magic ${magicPct}%"></div>
              <div class="draft-bar-fill" style="width:${truePct}%;background:#fde68a;" title="True ${truePct}%"></div>
            </div>
            <span style="font-size:0.7rem;color:var(--text-secondary);">Red = Physical • Cyan = Magic • Gold = True</span>
          </div>

          <div class="draft-metric-card info-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Crowd Control Threat</span>
              <span style="font-size:0.75rem;font-family:var(--font-mono);color:#fde68a;">${Math.min(10, ccScore * 2)}/10</span>
            </div>
            <div class="draft-bar-track">
              <div class="draft-bar-fill" style="width:${Math.min(100, ccScore * 20)}%;background:#fde68a;"></div>
            </div>
            <span style="font-size:0.7rem;color:var(--text-secondary);">${ccScore >= 4 ? 'High CC Threat: Prioritize Purify / Tough Boots' : 'Manageable CC'}</span>
          </div>

          <div class="draft-metric-card info-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Healing &amp; Sustain</span>
              <span style="font-size:0.75rem;font-family:var(--font-mono);color:#34d399;">${Math.min(10, Math.round(sustainScore * 2))}/10</span>
            </div>
            <div class="draft-bar-track">
              <div class="draft-bar-fill" style="width:${Math.min(100, sustainScore * 20)}%;background:#34d399;"></div>
            </div>
            <span style="font-size:0.7rem;color:var(--text-secondary);">${sustainScore >= 2.5 ? 'Heavy Sustain: Build Anti-Heal Immediately' : 'Normal Regeneration'}</span>
          </div>
        </div>

        <!-- RECOMMENDED ANTI-ITEM BUILDS -->
        <div>
          <h2 class="row-title" style="margin-bottom:0.85rem;">Key Tactical Anti-Equipment</h2>
          <div class="draft-item-grid">
            ${cleanCounterItems.map(itm => `
              <div class="draft-counter-item-card info-panel" data-open-item="${itm.id}">
                <div class="draft-item-thumb">
                  ${generateItemSVG(itm)}
                </div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:0.88rem;">${itm.name}</div>
                  <div style="font-size:0.72rem;color:var(--accent-primary);">${tCat(itm.category)} • 🪙 ${itm.price}g</div>
                  <div style="font-size:0.7rem;color:var(--text-secondary);margin-top:2px;">${itm.passive || (itm.stats && itm.stats[0]) || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function openDraftHeroPickerModal(slotIndex) {
  state.activeModal = { type: 'draft-picker', id: String(slotIndex) };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-body" style="padding-top:2.2rem;">
      <div class="banner-kicker"><span class="banner-kicker-badge">ENEMY SLOT ${slotIndex + 1}</span><span>SELECT HERO</span></div>
      <h2 class="modal-title" style="font-size:1.8rem;margin-bottom:0.8rem;">Select Enemy Hero</h2>
      <input type="search" id="draft-picker-search" class="account-input" placeholder="Search hero name..." style="margin-bottom:1rem;" />

      <div id="draft-picker-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:10px;max-height:50vh;overflow-y:auto;padding-right:4px;">
        ${state.heroes.map(h => `
          <div class="catalog-card" data-pick-draft-hero="${h.id}" style="padding:8px;text-align:center;cursor:pointer;">
            <div style="width:100%;aspect-ratio:1;border-radius:10px;overflow:hidden;margin-bottom:6px;">
              ${generateHeroPortraitSVG(h, false)}
            </div>
            <div style="font-size:0.84rem;font-weight:700;color:#fff;">${h.name}</div>
            <div style="font-size:0.68rem;color:var(--accent-primary);">${h.roles[0]}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const searchInput = container.querySelector('#draft-picker-search');
  searchInput?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    container.querySelectorAll('[data-pick-draft-hero]').forEach(card => {
      const hid = card.dataset.pickDraftHero;
      const h = state.heroMap.get(hid);
      const match = !q || h?.name.toLowerCase().includes(q) || h?.roles.some(r => r.toLowerCase().includes(q));
      card.style.display = match ? 'block' : 'none';
    });
  });

  container.querySelectorAll('[data-pick-draft-hero]').forEach(card => {
    card.addEventListener('click', () => {
      state.draft.enemy[slotIndex] = card.dataset.pickDraftHero;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderDraftPage();
    });
  });
}

/* ============================================================================
   PRO BUILD LAB & REAL-TIME DPS CALCULATOR (#sandbox)
   ============================================================================ */
function renderSandboxPage() {
  const hero = state.heroMap.get(state.sandbox.heroId) || state.heroes[0];
  const level = state.sandbox.heroLevel;
  const dummyType = state.sandbox.dummyType;

  // Compute Base Stats with Level Scaling
  const bs = hero.baseStats || {
    hp: 2500,
    physicalAttack: 125,
    physicalDefense: 18,
    magicDefense: 15,
    attackSpeed: '0.85'
  };
  const rawAtkSpd = parseFloat(bs.attackSpeed) || 0.85;
  const baseHp = (bs.hp || 2500) + (level - 1) * 168;
  const basePhysAtk = (bs.physicalAttack || 125) + (level - 1) * 9.2;
  const basePhysDef = (bs.physicalDefense || 18) + (level - 1) * 3.4;
  const baseMagDef = (bs.magicDefense || 15) + (level - 1) * 1.8;
  const baseAtkSpd = rawAtkSpd;

  // Compute Equipped Item Stats
  let itemPhysAtk = 0, itemMagPwr = 0, itemHp = 0, itemPhysDef = 0, itemMagDef = 0;
  let itemAtkSpdPct = 0, itemCritChance = 0, itemCdr = 0, itemMoveSpd = 0;
  let itemPhysPen = 0, itemMagPen = 0;

  state.sandbox.items.forEach(itemId => {
    if (!itemId) return;
    const itm = state.itemMap.get(itemId);
    if (!itm || !itm.stats) return;
    itm.stats.forEach(st => {
      const s = st.toLowerCase();
      const numMatch = st.match(/\d+/);
      const val = numMatch ? parseInt(numMatch[0], 10) : 0;
      if (s.includes('physical attack')) itemPhysAtk += val;
      else if (s.includes('magic power')) itemMagPwr += val;
      else if (s.includes('hp') && !s.includes('hp regen')) itemHp += val;
      else if (s.includes('physical defense')) itemPhysDef += val;
      else if (s.includes('magic defense')) itemMagDef += val;
      else if (s.includes('attack speed')) itemAtkSpdPct += val;
      else if (s.includes('crit chance')) itemCritChance += val;
      else if (s.includes('cooldown reduction')) itemCdr += val;
      else if (s.includes('physical pen')) itemPhysPen += val;
      else if (s.includes('magic pen')) itemMagPen += val;
    });
  });

  const totalPhysAtk = Math.round(basePhysAtk + itemPhysAtk);
  const totalMagPwr = Math.round(itemMagPwr);
  const totalHp = Math.round(baseHp + itemHp);
  const totalPhysDef = Math.round(basePhysDef + itemPhysDef);
  const totalMagDef = Math.round(baseMagDef + itemMagDef);
  const totalCdr = Math.min(45, itemCdr);
  const totalAtkSpd = (baseAtkSpd * (1 + itemAtkSpdPct / 100)).toFixed(2);

  // Target Dummy Parameters
  let dummyHp = 2600, dummyPhysDef = 30, dummyMagDef = 25;
  if (dummyType === 'fighter') {
    dummyHp = 5800; dummyPhysDef = 95; dummyMagDef = 70;
  } else if (dummyType === 'tank') {
    dummyHp = 11800; dummyPhysDef = 260; dummyMagDef = 185;
  }

  // Damage Reduction formulas: netDef / (120 + netDef)
  const netPhysDef = Math.max(0, dummyPhysDef - itemPhysPen);
  const physRedPct = netPhysDef / (120 + netPhysDef);
  const netMagDef = Math.max(0, dummyMagDef - itemMagPen);
  const magRedPct = netMagDef / (120 + netMagDef);

  // Live DPS Calculation
  const isMagicCarry = (hero.attackType === 'Magic' || hero.roles.includes('Mage'));
  let basicDps = 0;
  if (!isMagicCarry) {
    const rawHit = totalPhysAtk * (1 + (itemCritChance / 100) * 1.0);
    basicDps = Math.round(rawHit * (1 - physRedPct) * parseFloat(totalAtkSpd));
  } else {
    basicDps = Math.round((totalPhysAtk * 0.8 * (1 - physRedPct) + totalMagPwr * 0.25 * (1 - magRedPct)) * parseFloat(totalAtkSpd));
  }

  // Burst Combo Damage Simulation
  let burstDamage = 0;
  if (isMagicCarry) {
    burstDamage = Math.round((totalMagPwr * 3.4 + 1600) * (1 - magRedPct));
  } else {
    burstDamage = Math.round((totalPhysAtk * 4.2 + 1400) * (1 - physRedPct));
  }

  // Effective HP: HP * (1 + Def / 120)
  const physEhp = Math.round(totalHp * (1 + totalPhysDef / 120));
  const magEhp = Math.round(totalHp * (1 + totalMagDef / 120));

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section" style="padding-top:1.5rem;">
      <div class="page-header" style="margin-bottom:1.4rem;">
        <div>
          <div class="banner-kicker">
            <span class="banner-kicker-badge">DPS LAB</span>
            <span>BUILD TESTING &amp; DAMAGE TELEMETRY</span>
          </div>
          <h1 class="page-title">${t('sandbox_title')}</h1>
          <p class="page-subtitle">${t('sandbox_subtitle')}</p>
        </div>
      </div>

      <!-- HERO SELECTOR & LEVEL SLIDER -->
      <div class="sandbox-hero-header info-panel">
        <div class="account-avatar-frame" id="sandbox-change-hero-btn" style="cursor:pointer;" title="Click to Change Hero">
          ${generateHeroPortraitSVG(hero, false)}
          <span class="account-lvl-badge">Lv.${level}</span>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <h2 style="font-family:var(--font-display);font-size:2.2rem;color:#fff;line-height:1;">${hero.name}</h2>
            <span class="role-chip">${hero.roles.join(' / ')}</span>
            <span class="lane-chip">${tLane(hero.lanes[0])}</span>
            <button type="button" class="liquid-pill-btn" id="sandbox-pick-hero-btn" style="padding:2px 8px;font-size:0.7rem;">Change Hero</button>
          </div>
          <div style="display:flex;align-items:center;gap:14px;margin-top:8px;">
            <span style="font-size:0.8rem;color:var(--text-secondary);font-family:var(--font-mono);">Hero Level: <strong style="color:#fff;" id="sandbox-level-val">${level}</strong></span>
            <input type="range" id="sandbox-level-slider" min="1" max="15" value="${level}" style="width:180px;accent-color:var(--accent-primary);" />
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <span style="font-size:0.75rem;color:var(--text-secondary);">Target Dummy</span>
          <div class="filter-pills" style="margin:0;">
            <button type="button" class="filter-pill ${dummyType === 'squishy' ? 'active' : ''}" data-set-dummy="squishy" style="font-size:0.72rem;padding:3px 8px;">Squishy</button>
            <button type="button" class="filter-pill ${dummyType === 'fighter' ? 'active' : ''}" data-set-dummy="fighter" style="font-size:0.72rem;padding:3px 8px;">Fighter</button>
            <button type="button" class="filter-pill ${dummyType === 'tank' ? 'active' : ''}" data-set-dummy="tank" style="font-size:0.72rem;padding:3px 8px;">Tank</button>
          </div>
        </div>
      </div>

      <!-- 6-ITEM EQUIPMENT SLOTS -->
      <h2 class="row-title" style="margin-bottom:0.85rem;">Equipped Build Slots (Click to Swap)</h2>
      <div class="sandbox-slots-grid">
        ${[0, 1, 2, 3, 4, 5].map(idx => {
          const itemId = state.sandbox.items[idx];
          const itm = itemId ? state.itemMap.get(itemId) : null;
          if (itm) {
            return `
              <div class="sandbox-item-slot info-panel" data-open-sandbox-slot="${idx}" title="${itm.name}">
                <div class="sandbox-slot-img-wrap" style="width:52px;height:52px;aspect-ratio:1/1;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;">
                  ${generateItemSVG(itm)}
                </div>
                <div style="font-size:0.75rem;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;">${itm.name}</div>
                <div style="font-size:0.68rem;color:var(--accent-primary);">Slot ${idx + 1}</div>
              </div>
            `;
          } else {
            return `
              <div class="sandbox-item-slot empty-item info-panel" data-open-sandbox-slot="${idx}">
                <div style="font-size:1.8rem;color:var(--text-muted);margin-bottom:4px;">+</div>
                <div style="font-size:0.74rem;color:var(--text-secondary);">Slot ${idx + 1}</div>
                <span style="font-size:0.68rem;color:var(--accent-primary);">Equip</span>
              </div>
            `;
          }
        }).join('')}
      </div>

      <!-- LIVE DAMAGE & BURST HERO TELEMETRY -->
      <div class="sandbox-dps-card">
        <div>
          <span style="font-size:0.75rem;color:var(--accent-primary);text-transform:uppercase;letter-spacing:1px;font-weight:700;">Live Basic Attack DPS</span>
          <div style="font-family:var(--font-display);font-size:3.5rem;color:#fff;line-height:1;margin:4px 0;">${basicDps.toLocaleString()}</div>
          <span style="font-size:0.76rem;color:var(--text-secondary);">Against ${dummyType.toUpperCase()} Dummy (Armor Reduction Applied)</span>
        </div>
        <div>
          <span style="font-size:0.75rem;color:#fde68a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Estimated Skill Burst Combo</span>
          <div style="font-family:var(--font-display);font-size:3.5rem;color:#fde68a;line-height:1;margin:4px 0;">${burstDamage.toLocaleString()}</div>
          <span style="font-size:0.76rem;color:var(--text-secondary);">Full S1 + S2 + Ultimate Rotation</span>
        </div>
        <div>
          <span style="font-size:0.75rem;color:#38bdf8;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Survivability (Physical / Magic EHP)</span>
          <div style="font-family:var(--font-display);font-size:2.4rem;color:#38bdf8;line-height:1.1;margin:4px 0;">
            ${physEhp.toLocaleString()} <span style="font-size:1.4rem;color:#94a3b8;">/</span> ${magEhp.toLocaleString()}
          </div>
          <span style="font-size:0.76rem;color:var(--text-secondary);">Raw HP: ${totalHp.toLocaleString()} (Phys Def: ${totalPhysDef} • Mag Def: ${totalMagDef})</span>
        </div>
      </div>

      <!-- AGGREGATE ATTRIBUTE METRIC BOXES -->
      <div class="sandbox-metrics-grid">
        <div class="sandbox-metric-box info-panel">
          <span style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;">Physical Attack</span>
          <span class="sandbox-metric-val" style="color:#fb7185;">${totalPhysAtk}</span>
          <span style="font-size:0.7rem;color:var(--text-secondary);">+${itemPhysAtk} from Items</span>
        </div>
        <div class="sandbox-metric-box info-panel">
          <span style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;">Magic Power</span>
          <span class="sandbox-metric-val" style="color:#38bdf8;">${totalMagPwr}</span>
          <span style="font-size:0.7rem;color:var(--text-secondary);">+${itemMagPwr} from Items</span>
        </div>
        <div class="sandbox-metric-box info-panel">
          <span style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;">Attack Speed</span>
          <span class="sandbox-metric-val" style="color:#fde68a;">${totalAtkSpd}</span>
          <span style="font-size:0.7rem;color:var(--text-secondary);">+${itemAtkSpdPct}% Boost</span>
        </div>
        <div class="sandbox-metric-box info-panel">
          <span style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;">Critical Chance</span>
          <span class="sandbox-metric-val" style="color:#34d399;">${itemCritChance}%</span>
          <span style="font-size:0.7rem;color:var(--text-secondary);">x2.0 Crit Multiplier</span>
        </div>
        <div class="sandbox-metric-box info-panel">
          <span style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;">Cooldown Reduction</span>
          <span class="sandbox-metric-val" style="color:var(--accent-primary);">${totalCdr}%</span>
          <span style="font-size:0.7rem;color:var(--text-secondary);">Max Cap 45%</span>
        </div>
      </div>
    </section>
  `;

  // Attach interactive slider
  const slider = main.querySelector('#sandbox-level-slider');
  slider?.addEventListener('input', e => {
    state.sandbox.heroLevel = parseInt(e.target.value, 10);
    renderSandboxPage();
  });
}

function openSandboxItemPickerModal(slotIndex) {
  state.activeModal = { type: 'sandbox-item-picker', id: String(slotIndex) };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-body" style="padding-top:2.2rem;">
      <div class="banner-kicker"><span class="banner-kicker-badge">EQUIPMENT LAB</span><span>SLOT ${slotIndex + 1}</span></div>
      <h2 class="modal-title" style="font-size:1.8rem;margin-bottom:0.8rem;">Select Equipment Item</h2>
      <div style="display:flex;gap:10px;margin-bottom:1rem;">
        <input type="search" id="sandbox-item-search" class="account-input" placeholder="Search item name..." />
        <button type="button" class="liquid-pill-btn" id="sandbox-remove-item-btn" style="color:#fb7185;border-color:rgba(244,63,94,0.4);white-space:nowrap;">
          Clear Slot
        </button>
      </div>

      <div id="sandbox-item-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:10px;max-height:50vh;overflow-y:auto;padding-right:4px;">
        ${state.items.filter(i => i.tier === 3 || i.tier === 2).map(itm => `
          <div class="catalog-card" data-pick-sandbox-item="${itm.id}" style="padding:8px;text-align:center;cursor:pointer;">
            <div class="sandbox-slot-img-wrap" style="width:48px;height:48px;aspect-ratio:1/1;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;">
              ${generateItemSVG(itm)}
            </div>
            <div style="font-size:0.8rem;font-weight:700;color:#fff;">${itm.name}</div>
            <div style="font-size:0.68rem;color:var(--accent-primary);">${tCat(itm.category)} • 🪙 ${itm.price}g</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const searchInput = container.querySelector('#sandbox-item-search');
  searchInput?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    container.querySelectorAll('[data-pick-sandbox-item]').forEach(card => {
      const itmId = card.dataset.pickSandboxItem;
      const itm = state.itemMap.get(itmId);
      const match = !q || itm?.name.toLowerCase().includes(q) || itm?.category.toLowerCase().includes(q);
      card.style.display = match ? 'block' : 'none';
    });
  });

  container.querySelector('#sandbox-remove-item-btn')?.addEventListener('click', () => {
    state.sandbox.items[slotIndex] = null;
    MLBB_Audio.playGlassClick();
    closeModal(false);
    renderSandboxPage();
  });

  container.querySelectorAll('[data-pick-sandbox-item]').forEach(card => {
    card.addEventListener('click', () => {
      state.sandbox.items[slotIndex] = card.dataset.pickSandboxItem;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderSandboxPage();
    });
  });
}

function openSandboxHeroPickerModal() {
  state.activeModal = { type: 'sandbox-hero-picker', id: 'hero' };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-body" style="padding-top:2.2rem;">
      <div class="banner-kicker"><span class="banner-kicker-badge">CHOOSE HERO</span><span>BUILD LAB</span></div>
      <h2 class="modal-title" style="font-size:1.8rem;margin-bottom:0.8rem;">Select Hero for Lab</h2>
      <input type="search" id="sandbox-hero-search" class="account-input" placeholder="Search hero..." style="margin-bottom:1rem;" />

      <div id="sandbox-hero-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:10px;max-height:50vh;overflow-y:auto;">
        ${state.heroes.map(h => `
          <div class="catalog-card" data-pick-lab-hero="${h.id}" style="padding:8px;text-align:center;cursor:pointer;">
            <div style="width:100%;aspect-ratio:1;border-radius:10px;overflow:hidden;margin-bottom:6px;">
              ${generateHeroPortraitSVG(h, false)}
            </div>
            <div style="font-size:0.84rem;font-weight:700;color:#fff;">${h.name}</div>
            <div style="font-size:0.68rem;color:var(--accent-primary);">${h.roles[0]}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const searchInput = container.querySelector('#sandbox-hero-search');
  searchInput?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    container.querySelectorAll('[data-pick-lab-hero]').forEach(card => {
      const hid = card.dataset.pickLabHero;
      const h = state.heroMap.get(hid);
      const match = !q || h?.name.toLowerCase().includes(q) || h?.roles.some(r => r.toLowerCase().includes(q));
      card.style.display = match ? 'block' : 'none';
    });
  });

  container.querySelectorAll('[data-pick-lab-hero]').forEach(card => {
    card.addEventListener('click', () => {
      state.sandbox.heroId = card.dataset.pickLabHero;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderSandboxPage();
    });
  });
}

/* ============================================================================
   LAND OF DAWN INTERACTIVE 3D WORLD MAP (#map)
   ============================================================================ */
const TERRITORIES = [
  {
    id: 'moniyan',
    name: 'Moniyan Empire',
    capital: 'Lumina City',
    themeColor: '#00e5ff',
    coords: { x: 420, y: 220 },
    summary: 'The proud bastion of the Church of Light, protected by the Imperial Knights of Lumina City and House Wertz.',
    heroes: ['tigreal', 'fanny', 'alucard', 'granger', 'silvanna', 'natalia'],
    artifacts: ['blade-of-despair', 'twilight-armor'],
    faction: 'The Light Coalition'
  },
  {
    id: 'cadia',
    name: 'Cadia Riverlands',
    capital: 'Dragon Altar',
    themeColor: '#10b981',
    coords: { x: 740, y: 210 },
    summary: 'An ancient eastern realm overseen by the Great Dragon, where mystical martial arts and onmyouji disciplines flourish.',
    heroes: ['zilong', 'ling', 'hayabusa', 'kagura', 'wanwan', 'baxia'],
    artifacts: ['great-dragon-spear', 'golden-staff'],
    faction: 'Dragon Altar Discipline'
  },
  {
    id: 'eruditio',
    name: 'Eruditio & Lab 1718',
    capital: 'City of Scholars',
    themeColor: '#38bdf8',
    coords: { x: 380, y: 360 },
    summary: 'The futuristic technological crown jewel of the Land of Dawn, renowned for mecha engineering and high-frequency energy.',
    heroes: ['layla', 'bruno', 'diggie', 'jawhead', 'saber', 'alpha'],
    artifacts: ['malefic-gun', 'clock-of-destiny'],
    faction: 'Scholar Council & Mecha Corps'
  },
  {
    id: 'agelta',
    name: 'Agelta Drylands',
    capital: 'Minoan Maze',
    themeColor: '#fbbf24',
    coords: { x: 210, y: 390 },
    summary: 'Vast golden sands hiding the ruins of ancient Minoan civilization, the Emerald Road, and the sealed Desert Tyrant.',
    heroes: ['khufra', 'esmeralda', 'claude', 'minotaur', 'moskov'],
    artifacts: ['antique-cuirass', 'oracle'],
    faction: 'Desert Nomads & Stargazers'
  },
  {
    id: 'northern',
    name: 'Northern Vale',
    capital: 'Nost Gal',
    themeColor: '#818cf8',
    coords: { x: 520, y: 90 },
    summary: 'A sub-zero realm of harsh blizzards, fierce Viking clans, and ancient mystical Megaliths of frost energy.',
    heroes: ['franco', 'freya', 'bane', 'popol-and-kupa', 'masha'],
    artifacts: ['berserkers-fury', 'war-axe'],
    faction: 'Vale Clans & Valkyrie Order'
  },
  {
    id: 'abyss',
    name: 'The Abyss & Barren Lands',
    capital: 'Crack of the Abyss',
    themeColor: '#f43f5e',
    coords: { x: 620, y: 410 },
    summary: 'A dark cataclysmic rift where demonic Abyss lords plot the eternal destruction of the Moniyan Empire.',
    heroes: ['alice', 'thamuz', 'dyrroth', 'terizla', 'helcurt'],
    artifacts: ['blood-wings', 'bloodlust-axe'],
    faction: 'Abyssal Dominators'
  },
  {
    id: 'vonetis',
    name: 'Vonetis Islands & Necrokeep',
    capital: 'Mist Citadel',
    themeColor: '#a78bfa',
    coords: { x: 830, y: 370 },
    summary: 'A mist-shrouded archipelago in the southern waters, haunted by fallen royalty and oceanic deities.',
    heroes: ['lapu-lapu', 'kadita', 'faramis', 'vexana', 'leomord'],
    artifacts: ['lightning-truncheon', 'genius-wand'],
    faction: 'Southern Ocean & Necrokeep Court'
  }
];

function renderWorldMapPage() {
  const selected = TERRITORIES.find(t => t.id === state.selectedTerritory) || TERRITORIES[0];
  const affiliatedHeroes = selected.heroes.map(hid => state.heroMap.get(hid)).filter(Boolean);
  const affiliatedItems = selected.artifacts.map(iid => state.itemMap.get(iid)).filter(Boolean);

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section" style="padding-top:1.5rem;">
      <div class="page-header" style="margin-bottom:1.4rem;">
        <div>
          <div class="banner-kicker">
            <span class="banner-kicker-badge">CARTOGRAPHY</span>
            <span>LAND OF DAWN INTERACTIVE TERRITORY ATLAS</span>
          </div>
          <h1 class="page-title">${t('map_title')}</h1>
          <p class="page-subtitle">${t('map_subtitle')}</p>
        </div>
        <div class="filter-pills" style="margin:0;">
          ${TERRITORIES.map(tr => `
            <button
              type="button"
              class="filter-pill ${tr.id === selected.id ? 'active' : ''}"
              data-select-territory="${tr.id}"
            >
              ✦ ${tr.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- INTERACTIVE MAP CANVAS & TERRITORY NODES -->
      <div class="map-wrapper">
        <svg class="map-svg-canvas" viewBox="0 0 1000 520" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#071329"/>
              <stop offset="100%" stop-color="#020710"/>
            </radialGradient>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 229, 255, 0.05)" stroke-width="1"/>
            </pattern>
          </defs>

          <!-- Deep Space Oceanic Grid -->
          <rect width="1000" height="520" fill="url(#oceanGrad)"/>
          <rect width="1000" height="520" fill="url(#mapGrid)"/>

          <!-- Ancient Trade & Arcane Leylines -->
          <g stroke="rgba(0, 229, 255, 0.18)" stroke-width="1.2" stroke-dasharray="4 6" fill="none">
            <path d="M 520 90 L 420 220 L 740 210"/>
            <path d="M 420 220 L 380 360 L 210 390"/>
            <path d="M 380 360 L 620 410 L 830 370"/>
            <path d="M 740 210 L 830 370"/>
          </g>

          <!-- Territory Territory Nodes -->
          ${TERRITORIES.map(tr => {
            const isSel = tr.id === selected.id;
            return `
              <g class="map-region-node" data-select-territory="${tr.id}" transform="translate(${tr.coords.x}, ${tr.coords.y})">
                <circle class="map-pulse-ring" cx="0" cy="0" r="18" fill="none" stroke="${tr.themeColor}" stroke-width="1.5"/>
                <circle cx="0" cy="0" r="10" fill="${tr.themeColor}" opacity="0.88"/>
                <circle cx="0" cy="0" r="4" fill="#fff"/>
                <text x="0" y="26" text-anchor="middle" fill="${isSel ? '#fff' : '#94a3b8'}" font-family="Outfit, sans-serif" font-weight="700" font-size="12" letter-spacing="0.5">
                  ${tr.name.toUpperCase()}
                </text>
              </g>
            `;
          }).join('')}
        </svg>
      </div>

      <!-- SELECTED TERRITORY DETAIL SHEET -->
      <div class="map-territory-sheet info-panel" style="border-left: 4px solid ${selected.themeColor};">
        <div>
          <div class="banner-kicker" style="color:${selected.themeColor};">
            <span>✦ CAPITAL: ${selected.capital.toUpperCase()}</span>
            <span>• ${selected.faction.toUpperCase()}</span>
          </div>
          <h2 style="font-family:var(--font-display);font-size:2.4rem;color:#fff;margin-bottom:0.6rem;">${selected.name}</h2>
          <p class="story-prose" style="font-size:0.95rem;line-height:1.65;color:#cbd5e1;margin-bottom:1.2rem;">${selected.summary}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="#heroes" class="btn-primary" style="padding:0.5rem 1.1rem;font-size:0.82rem;">Browse All Heroes</a>
            <a href="#lore" class="btn-secondary" style="padding:0.5rem 1.1rem;font-size:0.82rem;">Open Full Sagas</a>
          </div>
        </div>

        <div>
          <!-- Affiliated Heroes Grid -->
          <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:700;">
            Champions of ${selected.name} (${affiliatedHeroes.length})
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:10px;margin-bottom:1.2rem;">
            ${affiliatedHeroes.map(h => `
              <div class="catalog-card" data-open-hero="${h.id}" style="padding:8px;text-align:center;cursor:pointer;">
                <div style="width:100%;aspect-ratio:1;border-radius:10px;overflow:hidden;margin-bottom:4px;">
                  ${generateHeroPortraitSVG(h, false)}
                </div>
                <div style="font-weight:700;color:#fff;font-size:0.82rem;">${h.name}</div>
                <div style="font-size:0.68rem;color:var(--accent-primary);">${h.roles[0]}</div>
              </div>
            `).join('')}
          </div>

          <!-- Signature Artifacts -->
          <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:700;">
            Regional Relics &amp; Equipment
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${affiliatedItems.map(itm => `
              <div class="mini-entity-card" data-open-item="${itm.id}" style="flex:1 1 180px;">
                <div class="mini-entity-thumb">${generateItemSVG(itm)}</div>
                <div class="mini-entity-text">
                  <div class="mini-entity-name">${itm.name}</div>
                  <div class="mini-entity-sub">${tCat(itm.category)} • 🪙 ${itm.price}g</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ============================================================================
   COMMANDER ACCOUNT PROFILE, BATTLE STATS & MATCH HISTORY PAGE (#account)
   ============================================================================ */
function renderAccountPage() {
  const acc = state.account || {
    profile: {
      name: '0xjaylen',
      roleId: '849201538',
      zoneId: '8234',
      level: 92,
      rank: 'Mythical Immortal ★ 128',
      highestRank: 'Mythical Immortal ★ 164',
      guild: 'NEXUS • DAWN',
      title: 'Supreme No.1 Gusion • Land of Dawn',
      avatarHeroId: 'gusion',
      showcaseHeroId: 'hayabusa',
      lastSynced: 'Ready'
    },
    seasons: [
      {
        sid: 40,
        label: 'Season 40 (Current)',
        tc: 342,
        wc: 224,
        winrate: 65.5,
        mvpc: 96,
        legendary: 54,
        savage: 6,
        maniac: 28,
        wsc: 16,
        avgScore: 10.8,
        kdaRatio: 6.42,
        avgKills: 9.4,
        avgDeaths: 2.3,
        avgAssists: 5.4,
        highlights: []
      }
    ],
    frequentHeroes: [],
    matches: []
  };

  const currentSeason = acc.seasons.find(s => s.sid === state.accountSeasonSid) || acc.seasons[0] || {};
  const showcaseHero = state.heroMap.get(acc.profile.showcaseHeroId) || state.heroes[0];
  const avatarHero = state.heroMap.get(acc.profile.avatarHeroId) || state.heroMap.get('gusion') || state.heroes[0];

  let matches = acc.matches || [];
  if (state.accountLaneFilter !== 'All') {
    matches = matches.filter(m => m.lane === state.accountLaneFilter);
  }

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section" style="padding-top:1.5rem;">
      <!-- COMMANDER PROFILE HERO BANNER -->
      <div class="account-hero-banner">
        <div class="account-banner-bg">
          ${showcaseHero ? generateHeroPortraitSVG(showcaseHero, true) : ''}
        </div>
        <div class="account-banner-left">
          <div class="account-avatar-frame" data-open-hero="${avatarHero?.id || 'gusion'}" title="View ${avatarHero?.name || 'Commander'} Details">
            ${avatarHero ? generateHeroPortraitSVG(avatarHero, false) : ''}
            <span class="account-lvl-badge">Lv.${acc.profile.level || 92}</span>
          </div>
          <div class="account-identity-info">
            <div class="banner-kicker" style="margin-bottom:0;">
              <span class="banner-kicker-badge">COMMANDER PROFILE</span>
              <span>${t('acc_kicker')}</span>
            </div>
            <div class="account-ign-row">
              <h1 class="account-ign">${acc.profile.name || '0xjaylen'}</h1>
              <span class="account-id-pill">ID: ${acc.profile.roleId} (${acc.profile.zoneId})</span>
              ${acc.profile.guild ? `<span class="meta-pill" style="border-color:var(--border-strong);">${acc.profile.guild}</span>` : ''}
            </div>
            <div class="account-rank-row">
              <span class="account-rank-chip">
                <span>✦</span>
                <span>${acc.profile.rank || 'Mythical Immortal ★ 128'}</span>
              </span>
              <span class="account-supreme-chip" title="Peak Season Highest Rank">
                <span>🏆 Peak:</span>
                <strong>${acc.profile.highestRank || 'Mythical Immortal ★ 164'}</strong>
              </span>
              <span class="account-supreme-chip" title="Supreme Hero Title">
                <span>⚔️</span>
                <span>${acc.profile.title || 'Supreme No.1 Gusion'}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="account-banner-actions">
          <button type="button" class="btn-primary" id="btn-open-sync-account" style="padding:0.6rem 1.2rem;font-size:0.86rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            <span>${t('acc_sync_btn')}</span>
          </button>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="liquid-pill-btn" id="btn-open-log-match" title="Quickly add a match to your history">
              <span>${t('acc_log_match_btn')}</span>
            </button>
            <button type="button" class="liquid-pill-btn" id="btn-export-account" title="Download updated account.json to /data">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>${t('acc_export_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- SEASON SELECTOR & LIVE SYNC STATUS -->
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:1.4rem;">
        <div class="filter-pills" style="margin-bottom:0;">
          ${(acc.seasons || []).map(s => `
            <button
              type="button"
              class="filter-pill ${s.sid === state.accountSeasonSid ? 'active' : ''}"
              data-season-sid="${s.sid}"
            >
              ${s.label}
            </button>
          `).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.76rem;color:var(--text-secondary);font-family:var(--font-mono);">
            ● ${acc.profile.lastSynced || 'Snapshot Mode'}
          </span>
          <button type="button" class="row-explore-link" id="btn-quick-refresh-stats" style="font-size:0.8rem;">
            ↻ Refresh Live
          </button>
        </div>
      </div>

      <!-- 6-CARD BATTLEFIELD KPI GRID -->
      <div class="account-kpi-grid">
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_total_matches')}</span>
          <span class="account-kpi-value">${currentSeason.tc || 0}</span>
          <span class="account-kpi-sub">${currentSeason.wc || 0} Wins • ${(currentSeason.tc || 0) - (currentSeason.wc || 0)} Losses</span>
        </div>
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_winrate')}</span>
          <span class="account-kpi-value" style="color:var(--accent-primary);">${currentSeason.winrate || ((currentSeason.wc / Math.max(1, currentSeason.tc)) * 100).toFixed(1)}%</span>
          <span class="account-kpi-sub">${currentSeason.hoursPlayed ? `${currentSeason.hoursPlayed}h In-Game` : 'High Meta Winrate'}</span>
        </div>
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_mvp_count')}</span>
          <span class="account-kpi-value" style="color:#fde68a;">${currentSeason.mvpc || 0}</span>
          <span class="account-kpi-sub">${currentSeason.savage ? `${currentSeason.savage} Savage • ` : ''}${currentSeason.maniac ? `${currentSeason.maniac} Maniac` : 'Dominant Carry'}</span>
        </div>
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_win_streak')}</span>
          <span class="account-kpi-value" style="color:#38bdf8;">🔥 ${currentSeason.wsc || 0}</span>
          <span class="account-kpi-sub">Consecutive Victories</span>
        </div>
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_avg_rating')}</span>
          <span class="account-kpi-value">${currentSeason.avgScore || '10.8'}</span>
          <span class="account-kpi-sub">${currentSeason.teamfightParticipation ? `${currentSeason.teamfightParticipation}% Teamfight` : 'Scale / 15.0'}</span>
        </div>
        <div class="account-kpi-card">
          <span class="account-kpi-label">${t('acc_kda_ratio')}</span>
          <span class="account-kpi-value">${currentSeason.kdaRatio || '6.42'}</span>
          <span class="account-kpi-sub">${currentSeason.avgKills || '9.4'} / ${currentSeason.avgDeaths || '2.3'} / ${currentSeason.avgAssists || '5.4'}</span>
        </div>
      </div>

      <!-- SEASON RECORD HIGHLIGHTS (Click any card to open 3D Hero Modal) -->
      ${currentSeason.highlights && currentSeason.highlights.length ? `
        <h2 class="row-title" style="margin-bottom:0.85rem;">${t('acc_record_highlights')}</h2>
        <div class="account-highlights-grid">
          ${currentSeason.highlights.map(hl => {
            const h = state.heroMap.get(hl.heroId);
            return `
              <div class="account-highlight-card" data-open-hero="${hl.heroId}" title="Inspect ${h?.name || hl.heroId}">
                <div class="account-highlight-thumb">
                  ${h ? generateHeroPortraitSVG(h, false) : ''}
                </div>
                <div style="overflow:hidden;">
                  <div style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;">${hl.label}</div>
                  <div style="font-family:var(--font-display);font-size:1.35rem;color:var(--accent-primary);line-height:1.1;">${hl.value}</div>
                  <div style="font-size:0.72rem;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    <strong>${h?.name || hl.heroId}</strong> • ${hl.matchNote}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- SIGNATURE HEROES & MMR -->
      ${acc.frequentHeroes && acc.frequentHeroes.length ? `
        <h2 class="row-title" style="margin-top:1.8rem;margin-bottom:0.85rem;">${t('acc_sig_heroes')}</h2>
        <div class="account-sig-grid">
          ${acc.frequentHeroes.map(fh => {
            const h = state.heroMap.get(fh.heroId);
            return `
              <div class="account-sig-card" data-open-hero="${fh.heroId}" title="View ${h?.name || fh.heroId} Pro Build">
                <div class="account-sig-thumb">
                  ${h ? generateHeroPortraitSVG(h, false) : ''}
                </div>
                <div style="flex:1;overflow:hidden;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                    <strong style="font-size:0.92rem;color:#fff;">${h?.name || fh.heroId}</strong>
                    <span style="font-family:var(--font-mono);font-size:0.76rem;color:#fde68a;">${fh.mmr ? `✦ ${fh.mmr}` : ''}</span>
                  </div>
                  <div style="font-size:0.72rem;color:var(--accent-primary);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${fh.title || ''}</div>
                  <div style="font-size:0.72rem;color:var(--text-secondary);display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>${fh.matches} Matches</span>
                    <strong style="color:#fff;">${fh.winrate}% WR</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.08);height:4px;border-radius:2px;overflow:hidden;">
                    <div style="background:var(--accent-primary);width:${Math.min(100, fh.winrate)}%;height:100%;"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- MATCH HISTORY & BUILD LOG FEED -->
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:2rem;margin-bottom:1rem;">
        <h2 class="row-title" style="margin:0;">${t('acc_match_history')} (${matches.length})</h2>
        <div class="filter-pills" style="margin:0;">
          ${['All', 'Jungle', 'Mid', 'Gold', 'EXP', 'Roam'].map(lane => `
            <button
              type="button"
              class="filter-pill ${state.accountLaneFilter === lane ? 'active' : ''}"
              data-account-lane="${lane}"
              style="padding:4px 10px;font-size:0.74rem;"
            >
              ${lane === 'All' ? t('all_lanes') : tLane(lane)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="account-match-list">
        ${matches.length === 0 ? `
          <div class="info-panel" style="text-align:center;padding:2.5rem 1rem;">
            <p style="color:var(--text-secondary);">No matches found for the selected filter.</p>
          </div>
        ` : matches.map(m => {
          const hero = state.heroMap.get(m.heroId);
          const isWin = (m.result === 'WIN' || m.res === 1);
          return `
            <article class="account-match-row ${isWin ? '' : 'match-loss'}">
              <div>
                <span class="match-result-badge ${isWin ? 'win' : 'loss'}">
                  ${isWin ? t('acc_victory') : t('acc_defeat')}
                </span>
                <div style="font-size:0.72rem;color:var(--text-secondary);margin-top:4px;">${m.timestamp}</div>
                <div style="font-size:0.7rem;font-family:var(--font-mono);color:#94a3b8;">${m.duration}</div>
              </div>

              <div class="match-hero-cell" data-open-hero="${m.heroId}" title="Inspect ${hero?.name || m.heroId}">
                <div class="match-hero-avatar">
                  ${hero ? generateHeroPortraitSVG(hero, false) : ''}
                </div>
                <div>
                  <div style="font-weight:700;color:#fff;font-size:0.95rem;">${hero?.name || m.heroId}</div>
                  <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
                    <span class="lane-chip" style="font-size:0.68rem;padding:1px 6px;">${tLane(m.lane)}</span>
                    <span style="font-size:0.7rem;color:var(--text-secondary);">${m.spell || 'Spell'}</span>
                  </div>
                </div>
              </div>

              <div class="match-kda-cell">
                <div class="match-kda-numbers">${m.kills} / <span style="color:#f43f5e;">${m.deaths}</span> / ${m.assists}</div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="font-size:0.78rem;font-weight:700;color:var(--accent-primary);">${m.score} Rating</span>
                  ${m.badge ? `<span class="match-mvp-tag">${m.badge}</span>` : (m.mvp ? '<span class="match-mvp-tag">👑 MVP</span>' : '')}
                </div>
              </div>

              <div class="match-items-row">
                ${(m.items || []).map(itemId => {
                  const itm = state.itemMap.get(itemId);
                  if (!itm) {
                    return `<div class="match-item-slot" title="${itemId}"></div>`;
                  }
                  return `
                    <div class="match-item-slot" data-open-item="${itm.id}" title="${itm.name} (Click for Recipe Tree)">
                      ${generateItemSVG(itm)}
                    </div>
                  `;
                }).join('')}
              </div>

              <div style="text-align:right;font-size:0.72rem;color:var(--text-secondary);line-height:1.4;">
                <div style="color:#fde68a;font-family:var(--font-mono);font-weight:600;">🪙 ${m.gold ? `${m.gold}g` : ''}</div>
                <div>Dmg: <strong style="color:#fff;">${m.heroDmg || '—'}</strong></div>
                ${m.turretDmg ? `<div>Push: ${m.turretDmg}</div>` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

/* ============================================================================
   ACCOUNT SYNC & LOG MATCH MODALS
   ============================================================================ */
function openAccountSyncModal() {
  state.activeModal = { type: 'account-sync', id: 'sync' };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');
  const acc = state.account?.profile || {};

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-body" style="padding-top:2.2rem;">
      <div class="banner-kicker">
        <span class="banner-kicker-badge">MLBB ARENA GATEWAY</span>
        <span>LIVE ACCOUNT SYNC & PROFILE EDITOR</span>
      </div>
      <h2 class="modal-title" style="font-size:2rem;margin-bottom:0.4rem;">Sync Your MLBB Stats</h2>
      <p style="color:var(--text-secondary);margin-bottom:1.4rem;font-size:0.88rem;">
        Connect your Game ID (Role ID) and Server (Zone ID) to load live match histories, or customize your profile snapshot directly.
      </p>

      <div style="display:flex;gap:10px;margin-bottom:1.4rem;border-bottom:1px solid var(--border-subtle);padding-bottom:0.6rem;">
        <button type="button" class="liquid-pill-btn active" id="tab-acc-moonton-btn">Official Moonton API Sync</button>
        <button type="button" class="liquid-pill-btn" id="tab-acc-editor-btn">Manual Profile Editor</button>
      </div>

      <!-- TAB 1: OFFICIAL MOONTON API SYNC -->
      <div id="panel-acc-moonton">
        <div class="info-panel" style="margin-bottom:1.2rem;">
          <h3 style="color:var(--accent-primary);margin-bottom:0.4rem;font-size:0.95rem;">⚡ 1-Click Battle Report Gateway</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem;">
            Enter your In-Game ID and Server ID. Click "Send Verification Code" to receive a 4-digit code in your in-game mailbox, or paste an existing token. Once connected, your match history and season stats sync directly to your website!
          </p>
          <div class="account-form-grid">
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">In-Game ID (Role ID)</label>
              <input type="text" id="sync-role-id" class="account-input" placeholder="e.g. 849201538" value="${acc.roleId || ''}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Server ID (Zone ID)</label>
              <input type="text" id="sync-zone-id" class="account-input" placeholder="e.g. 8234" value="${acc.zoneId || ''}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Action</label>
              <button type="button" class="btn-secondary" id="btn-send-moonton-vc" style="width:100%;height:38px;padding:0;">
                Send Mail Code
              </button>
            </div>
          </div>

          <div class="account-form-grid" style="margin-top:0.6rem;">
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Verification Code (From In-Game Mail)</label>
              <input type="text" id="sync-vc-code" class="account-input" placeholder="4-digit code (e.g. 5821)" maxlength="6" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Action</label>
              <button type="button" class="btn-primary" id="btn-login-moonton-vc" style="width:100%;height:38px;padding:0;">
                Verify &amp; Link Account
              </button>
            </div>
          </div>

          <div style="margin-top:1rem;border-top:1px solid rgba(255,255,255,0.08);padding-top:0.8rem;">
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Or Paste Existing JWT Token / Session Token</label>
            <div style="display:flex;gap:8px;">
              <input type="password" id="sync-jwt-token" class="account-input" placeholder="Bearer JWT Token..." value="${state.accountJwt || ''}" />
              <button type="button" class="btn-secondary" id="btn-apply-jwt-token" style="white-space:nowrap;padding:0 14px;">
                Save Token
              </button>
            </div>
          </div>

          <div id="sync-status-msg" style="margin-top:0.8rem;font-size:0.82rem;font-weight:600;display:none;"></div>
        </div>
      </div>

      <!-- TAB 2: MANUAL PROFILE & STATS EDITOR -->
      <div id="panel-acc-editor" style="display:none;">
        <div class="info-panel" style="margin-bottom:1.2rem;">
          <h3 style="color:var(--accent-primary);margin-bottom:0.7rem;font-size:0.95rem;">✏️ Edit Profile Snapshot</h3>
          <div class="account-form-grid">
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">In-Game Name (IGN)</label>
              <input type="text" id="edit-ign" class="account-input" value="${acc.name || '0xjaylen'}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Current Rank</label>
              <input type="text" id="edit-rank" class="account-input" value="${acc.rank || 'Mythical Immortal ★ 128'}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Highest Rank</label>
              <input type="text" id="edit-peak-rank" class="account-input" value="${acc.highestRank || 'Mythical Immortal ★ 164'}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Level</label>
              <input type="number" id="edit-level" class="account-input" value="${acc.level || 92}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Supreme Title</label>
              <input type="text" id="edit-title" class="account-input" value="${acc.title || 'Supreme No.1 Gusion • Land of Dawn'}" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Guild</label>
              <input type="text" id="edit-guild" class="account-input" value="${acc.guild || 'NEXUS • DAWN'}" />
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:1rem;">
            <button type="button" class="btn-primary" id="btn-save-profile-editor">
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Modal tab switching
  const tabMoontonBtn = container.querySelector('#tab-acc-moonton-btn');
  const tabEditorBtn = container.querySelector('#tab-acc-editor-btn');
  const panelMoonton = container.querySelector('#panel-acc-moonton');
  const panelEditor = container.querySelector('#panel-acc-editor');

  tabMoontonBtn?.addEventListener('click', () => {
    tabMoontonBtn.classList.add('active');
    tabEditorBtn.classList.remove('active');
    panelMoonton.style.display = 'block';
    panelEditor.style.display = 'none';
  });

  tabEditorBtn?.addEventListener('click', () => {
    tabEditorBtn.classList.add('active');
    tabMoontonBtn.classList.remove('active');
    panelEditor.style.display = 'block';
    panelMoonton.style.display = 'none';
  });

  // Action: Send VC
  container.querySelector('#btn-send-moonton-vc')?.addEventListener('click', async () => {
    const roleId = container.querySelector('#sync-role-id').value.trim();
    const zoneId = container.querySelector('#sync-zone-id').value.trim();
    const statusMsg = container.querySelector('#sync-status-msg');

    if (!roleId || !zoneId) {
      alert('Please enter both In-Game ID (Role ID) and Server ID (Zone ID).');
      return;
    }

    statusMsg.style.display = 'block';
    statusMsg.style.color = '#38bdf8';
    statusMsg.textContent = 'Contacting Moonton API Gateway... Sending code to in-game mail...';

    try {
      const gateways = ['https://arena.fastapicloud.dev/api', 'https://arena.rone.dev/api'];
      let res, data;
      for (const gw of gateways) {
        try {
          res = await fetch(`${gw}/user/auth/send-vc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: Number(roleId), zone_id: Number(zoneId) })
          });
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (e) {}
      }

      if (data && (data.code === 0 || data.status === 200 || data.message?.includes('success') || data.data)) {
        statusMsg.style.color = '#34d399';
        statusMsg.textContent = '✓ Verification code sent! Please check your in-game mailbox in MLBB.';
      } else {
        statusMsg.style.color = '#fde68a';
        statusMsg.textContent = (data && data.message) || 'Gateway response received. Enter code from in-game mail to link.';
      }
    } catch (err) {
      statusMsg.style.color = '#f87171';
      statusMsg.textContent = 'Failed to reach API gateway. You can also paste an existing JWT token or use Manual Editor.';
    }
  });

  // Action: Login with VC
  container.querySelector('#btn-login-moonton-vc')?.addEventListener('click', async () => {
    const roleId = container.querySelector('#sync-role-id').value.trim();
    const zoneId = container.querySelector('#sync-zone-id').value.trim();
    const vc = container.querySelector('#sync-vc-code').value.trim();
    const statusMsg = container.querySelector('#sync-status-msg');

    if (!roleId || !zoneId || !vc) {
      alert('Please enter Role ID, Zone ID, and the 4-digit code from your mail.');
      return;
    }

    statusMsg.style.display = 'block';
    statusMsg.style.color = '#38bdf8';
    statusMsg.textContent = 'Verifying with Moonton and fetching live battlefield telemetry...';

    try {
      const gateways = ['https://arena.fastapicloud.dev/api', 'https://arena.rone.dev/api'];
      let token = null;
      for (const gw of gateways) {
        try {
          const res = await fetch(`${gw}/user/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: Number(roleId), zone_id: Number(zoneId), vc })
          });
          if (res.ok) {
            const data = await res.json();
            token = data.data?.jwt || data.jwt || data.data?.token || data.token;
            if (token) break;
          }
        } catch (e) {}
      }

      if (token) {
        state.accountJwt = token;
        localStorage.setItem('mlbb_account_jwt', token);
        await refreshLiveMoontonStats();
        statusMsg.style.color = '#34d399';
        statusMsg.textContent = '✓ Successfully connected! Live stats & match history synced.';
        setTimeout(() => closeModal(false), 1200);
      } else {
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = 'Invalid code or verification expired. Please check in-game mail.';
      }
    } catch (err) {
      statusMsg.style.color = '#f87171';
      statusMsg.textContent = 'Verification error: ' + err.message;
    }
  });

  // Action: Save Token directly
  container.querySelector('#btn-apply-jwt-token')?.addEventListener('click', async () => {
    const jwt = container.querySelector('#sync-jwt-token').value.trim();
    if (!jwt) return;
    state.accountJwt = jwt;
    localStorage.setItem('mlbb_account_jwt', jwt);
    await refreshLiveMoontonStats();
    closeModal(false);
  });

  // Action: Save Manual Editor
  container.querySelector('#btn-save-profile-editor')?.addEventListener('click', () => {
    if (!state.account) state.account = { profile: {}, seasons: [], frequentHeroes: [], matches: [] };
    state.account.profile = {
      ...state.account.profile,
      name: container.querySelector('#edit-ign').value.trim() || '0xjaylen',
      rank: container.querySelector('#edit-rank').value.trim(),
      highestRank: container.querySelector('#edit-peak-rank').value.trim(),
      level: Number(container.querySelector('#edit-level').value) || 92,
      title: container.querySelector('#edit-title').value.trim(),
      guild: container.querySelector('#edit-guild').value.trim(),
      lastSynced: 'Updated Just Now'
    };
    localStorage.setItem('mlbb_account_data', JSON.stringify(state.account));
    closeModal(false);
    renderAccountPage();
  });
}

function openLogMatchModal() {
  state.activeModal = { type: 'log-match', id: 'log' };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  const heroOptions = state.heroes.map(h => `<option value="${h.id}">${h.name} (${h.roles[0]})</option>`).join('');
  const itemOptions = state.items.filter(i => i.tier === 3).map(i => `<option value="${i.id}">${i.name}</option>`).join('');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-body" style="padding-top:2.2rem;">
      <div class="banner-kicker">
        <span class="banner-kicker-badge">MATCH RECORDER</span>
        <span>ADD TO YOUR BATTLE LOG</span>
      </div>
      <h2 class="modal-title" style="font-size:2rem;margin-bottom:0.4rem;">Log Recent Match</h2>
      <p style="color:var(--text-secondary);margin-bottom:1.4rem;font-size:0.88rem;">
        Add your latest MLBB battlefield performance to your personal match feed without opening the game.
      </p>

      <form id="log-match-form">
        <div class="account-form-grid">
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Hero Played</label>
            <select id="log-hero" class="account-input">${heroOptions}</select>
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Lane</label>
            <select id="log-lane" class="account-input">
              <option value="Jungle">Jungle</option>
              <option value="Mid">Mid</option>
              <option value="Gold">Gold</option>
              <option value="EXP">EXP</option>
              <option value="Roam">Roam</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Result</label>
            <select id="log-result" class="account-input">
              <option value="WIN">VICTORY</option>
              <option value="LOSS">DEFEAT</option>
            </select>
          </div>
        </div>

        <div class="account-form-grid">
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Kills / Deaths / Assists</label>
            <div style="display:flex;gap:6px;">
              <input type="number" id="log-k" class="account-input" placeholder="K" value="12" />
              <input type="number" id="log-d" class="account-input" placeholder="D" value="2" />
              <input type="number" id="log-a" class="account-input" placeholder="A" value="8" />
            </div>
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Match Rating &amp; Badge</label>
            <div style="display:flex;gap:6px;">
              <input type="number" step="0.1" id="log-rating" class="account-input" placeholder="Rating" value="13.5" />
              <input type="text" id="log-badge" class="account-input" placeholder="e.g. MVP • Savage" value="MVP" />
            </div>
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Spell &amp; Duration</label>
            <div style="display:flex;gap:6px;">
              <input type="text" id="log-spell" class="account-input" placeholder="Spell" value="Retribution" />
              <input type="text" id="log-duration" class="account-input" placeholder="Duration" value="14:50" />
            </div>
          </div>
        </div>

        <div style="margin-top:0.6rem;">
          <label style="font-size:0.75rem;color:var(--text-secondary);display:block;margin-bottom:4px;">6-Item Build</label>
          <div class="account-form-grid" style="grid-template-columns:repeat(3, 1fr);">
            <select id="log-item-1" class="account-input"><option value="tough-boots">Tough Boots</option><option value="warrior-boots">Warrior Boots</option><option value="arcane-boots">Arcane Boots</option></select>
            <select id="log-item-2" class="account-input">${itemOptions}</select>
            <select id="log-item-3" class="account-input">${itemOptions}</select>
            <select id="log-item-4" class="account-input">${itemOptions}</select>
            <select id="log-item-5" class="account-input">${itemOptions}</select>
            <select id="log-item-6" class="account-input">${itemOptions}</select>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:1.4rem;">
          <button type="button" class="btn-secondary" id="btn-cancel-log-match">Cancel</button>
          <button type="submit" class="btn-primary">Add Match to History</button>
        </div>
      </form>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  container.querySelector('#btn-cancel-log-match')?.addEventListener('click', () => closeModal(false));
  container.querySelector('#log-match-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const heroId = container.querySelector('#log-hero').value;
    const lane = container.querySelector('#log-lane').value;
    const result = container.querySelector('#log-result').value;
    const k = Number(container.querySelector('#log-k').value) || 0;
    const d = Number(container.querySelector('#log-d').value) || 0;
    const a = Number(container.querySelector('#log-a').value) || 0;
    const rating = Number(container.querySelector('#log-rating').value) || 10.0;
    const badge = container.querySelector('#log-badge').value.trim() || (result === 'WIN' ? 'Gold Medal' : '');
    const spell = container.querySelector('#log-spell').value.trim() || 'Flicker';
    const duration = container.querySelector('#log-duration').value.trim() || '15:00';

    const items = [
      container.querySelector('#log-item-1').value,
      container.querySelector('#log-item-2').value,
      container.querySelector('#log-item-3').value,
      container.querySelector('#log-item-4').value,
      container.querySelector('#log-item-5').value,
      container.querySelector('#log-item-6').value
    ].filter(Boolean);

    const newMatch = {
      battleId: String(Date.now()),
      sid: state.accountSeasonSid || 40,
      mode: 'Ranked • Live Recorded',
      heroId,
      lane,
      result,
      mvp: badge.includes('MVP'),
      badge,
      kills: k,
      deaths: d,
      assists: a,
      score: rating,
      gold: 14500,
      heroDmg: '89,400',
      turretDmg: '8,200',
      duration,
      timestamp: 'Just now',
      spell,
      items
    };

    if (!state.account) state.account = { profile: {}, seasons: [], frequentHeroes: [], matches: [] };
    state.account.matches.unshift(newMatch);

    // Update season match counts & winrate
    const sObj = state.account.seasons.find(s => s.sid === state.accountSeasonSid) || state.account.seasons[0];
    if (sObj) {
      sObj.tc = (sObj.tc || 0) + 1;
      if (result === 'WIN') {
        sObj.wc = (sObj.wc || 0) + 1;
        sObj.wsc = (sObj.wsc || 0) + 1;
      } else {
        sObj.wsc = 0;
      }
      if (newMatch.mvp) sObj.mvpc = (sObj.mvpc || 0) + 1;
      sObj.winrate = Number(((sObj.wc / sObj.tc) * 100).toFixed(1));
    }

    localStorage.setItem('mlbb_account_data', JSON.stringify(state.account));
    closeModal(false);
    renderAccountPage();
  });
}

async function refreshLiveMoontonStats() {
  if (!state.accountJwt) {
    openAccountSyncModal();
    return;
  }

  const gateways = ['https://arena.fastapicloud.dev/api', 'https://arena.rone.dev/api'];
  let userInfo = null, userStats = null, frequentHeroes = null, matches = null;

  for (const gw of gateways) {
    try {
      const headers = { Authorization: `Bearer ${state.accountJwt}` };
      const [infoRes, statsRes, freqRes, matchRes] = await Promise.all([
        fetch(`${gw}/user/info?lang=en`, { headers }),
        fetch(`${gw}/user/stats?sid=${state.accountSeasonSid}&lang=en`, { headers }),
        fetch(`${gw}/user/frequent-heroes?sid=${state.accountSeasonSid}&limit=8&lang=en`, { headers }),
        fetch(`${gw}/user/matches?sid=${state.accountSeasonSid}&limit=12&lang=en`, { headers })
      ]);

      if (infoRes.ok) userInfo = (await infoRes.json()).data;
      if (statsRes.ok) userStats = (await statsRes.json()).data;
      if (freqRes.ok) frequentHeroes = (await freqRes.json()).data;
      if (matchRes.ok) matches = (await matchRes.json()).data;

      if (userInfo || userStats) break;
    } catch (e) {
      console.warn('Gateway error:', e);
    }
  }

  if (userInfo && state.account) {
    state.account.profile.name = userInfo.name || state.account.profile.name;
    state.account.profile.roleId = userInfo.roleId || state.account.profile.roleId;
    state.account.profile.zoneId = userInfo.zoneId || state.account.profile.zoneId;
    state.account.profile.level = userInfo.level || state.account.profile.level;
    state.account.profile.rank = userInfo.rank_level || state.account.profile.rank;
    state.account.profile.lastSynced = 'Live Synced via Official API';
  }

  if (userStats && state.account) {
    const sObj = state.account.seasons.find(s => s.sid === state.accountSeasonSid) || state.account.seasons[0];
    if (sObj) {
      sObj.tc = userStats.tc || sObj.tc;
      sObj.wc = userStats.wc || sObj.wc;
      sObj.winrate = Number(((sObj.wc / Math.max(1, sObj.tc)) * 100).toFixed(1));
      sObj.mvpc = userStats.mvpc || sObj.mvpc;
      sObj.wsc = userStats.wsc || sObj.wsc;
      sObj.avgScore = userStats.as ? (userStats.as / 100).toFixed(1) : sObj.avgScore;
      sObj.hoursPlayed = userStats.gt || sObj.hoursPlayed;
    }
  }

  if (state.account) {
    localStorage.setItem('mlbb_account_data', JSON.stringify(state.account));
    renderAccountPage();
  }
}

function exportAccountJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.account || {}, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'account.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function openQuizModal() {
  state.activeModal = { type: 'quiz', id: 'trial' };
  const qObj = QUIZ_QUESTIONS[state.quiz.index % QUIZ_QUESTIONS.length];
  const isCorrect = state.quiz.selected === qObj.answer;

  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Quiz">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-body" style="padding-top:2.2rem;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-right:3rem;margin-bottom:1.25rem;">
        <div class="banner-kicker" style="margin-bottom:0;">
          <span class="banner-kicker-badge">${qObj.type}</span>
          <span>${t('quiz_title')}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:0.8rem;">
          <span class="meta-pill">${t('quiz_score')}: <strong>${state.quiz.score}</strong></span>
          <span class="meta-pill" style="border-color:var(--border-strong);color:var(--accent-primary);">🔥 ${t('quiz_streak')}: <strong>${state.quiz.streak}</strong></span>
        </div>
      </div>

      <div class="info-panel" style="margin-bottom:1.2rem;">
        <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:6px;">
          Question ${(state.quiz.index % QUIZ_QUESTIONS.length) + 1} of ${QUIZ_QUESTIONS.length}
        </div>
        <p style="font-size:1.08rem;font-weight:700;line-height:1.55;margin-bottom:0.9rem;">
          "${qObj.clue}"
        </p>
        ${state.quiz.showHint ? `
          <div class="skill-notes" style="margin-bottom:0;">💡 Hint: ${qObj.hint}</div>
        ` : `
          <button type="button" id="quiz-hint-trigger" style="font-size:0.8rem;font-weight:700;color:var(--accent-gold);text-decoration:underline;">
            ${t('quiz_hint_btn')}
          </button>
        `}
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:1.25rem;">
        ${qObj.options.map(opt => {
          let borderStyle = 'border:1px solid var(--border-subtle);background:var(--bg-card);';
          if (state.quiz.selected) {
            if (opt === qObj.answer) {
              borderStyle = 'border:2px solid #10b981;background:rgba(16,185,129,0.22);font-weight:800;';
            } else if (opt === state.quiz.selected) {
              borderStyle = 'border:2px solid #ef4444;background:rgba(239,68,68,0.22);';
            } else {
              borderStyle = 'opacity:0.55;border:1px solid var(--border-subtle);';
            }
          }
          return `
            <button
              type="button"
              class="quiz-option-btn"
              data-quiz-opt="${opt}"
              ${state.quiz.selected ? 'disabled' : ''}
              style="padding:14px 16px;border-radius:var(--radius-sm);text-align:left;font-size:0.94rem;transition:all 0.18s ease;${borderStyle}"
            >
              ${opt}
            </button>
          `;
        }).join('')}
      </div>

      ${state.quiz.selected ? `
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-top:1rem;border-top:1px solid var(--border-subtle);">
          <div style="font-size:0.9rem;font-weight:700;color:${isCorrect ? '#34d399' : '#f87171'};">
            ${isCorrect ? '✓ Correct! The Land of Dawn honors your wisdom.' : `✕ Incorrect — Answer: ${qObj.answer}`}
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="btn-secondary" id="quiz-inspect-btn" style="padding:0.55rem 1.1rem;font-size:0.82rem;">
              ${t('quiz_inspect')}
            </button>
            <button type="button" class="btn-primary" id="quiz-next-btn" style="padding:0.55rem 1.2rem;font-size:0.82rem;">
              ${t('quiz_next')} &rarr;
            </button>
          </div>
        </div>
      ` : ''}

      <div style="display:flex;justify-content:flex-end;margin-top:0.85rem;">
        <button type="button" id="quiz-reset-btn" style="font-size:0.75rem;color:var(--text-secondary);">
          ↻ ${t('quiz_reset')}
        </button>
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/* ============================================================================
   GLOBAL SEARCH PAGE
   ============================================================================ */
function renderSearchPage() {
  const q = state.searchQuery.trim().toLowerCase();

  const matchedHeroes = state.heroes.filter(h =>
    !q ||
    h.name.toLowerCase().includes(q) ||
    h.title.toLowerCase().includes(q) ||
    h.roles.some(r => r.toLowerCase().includes(q)) ||
    h.lanes.some(l => l.toLowerCase().includes(q)) ||
    h.specialties.some(s => s.toLowerCase().includes(q)) ||
    h.faction.toLowerCase().includes(q) ||
    h.skills.some(sk => sk.name.toLowerCase().includes(q) || sk.description.toLowerCase().includes(q))
  );

  const matchedItems = state.items.filter(i =>
    !q ||
    i.name.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q) ||
    i.stats.some(s => s.toLowerCase().includes(q)) ||
    (i.passive && i.passive.toLowerCase().includes(q)) ||
    (i.active && i.active.toLowerCase().includes(q))
  );

  const matchedLore = state.lore.filter(l =>
    !q ||
    l.title.toLowerCase().includes(q) ||
    l.region.toLowerCase().includes(q) ||
    l.summary.toLowerCase().includes(q)
  );

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <section class="page-section">
      <div class="page-header">
        <div style="width: 100%;">
          <h1 class="page-title">${t('search_title')}</h1>
          <input
            type="search"
            id="page-search-input"
            value="${state.searchQuery.replace(/"/g, '&quot;')}"
            placeholder="${t('search_page_placeholder')}"
            style="width: 100%; margin-top: 0.85rem; padding: 0.9rem 1.2rem; border-radius: var(--radius-md); background: var(--bg-card); backdrop-filter: blur(18px); border: 1px solid var(--border-strong); color: #fff; font-size: 1rem; outline: none;"
          />
        </div>
      </div>

      <h2 class="row-title" style="margin: 1.2rem 0 0.85rem;">${t('matching_heroes')} (${matchedHeroes.length})</h2>
      <div class="catalog-grid" style="margin-bottom: 2.2rem;">
        ${matchedHeroes.map(createHeroCardHTML).join('')}
      </div>

      <h2 class="row-title" style="margin: 1.2rem 0 0.85rem;">${t('matching_items')} (${matchedItems.length})</h2>
      <div class="catalog-grid" style="margin-bottom: 2.2rem;">
        ${matchedItems.map(createItemCardHTML).join('')}
      </div>

      <h2 class="row-title" style="margin: 1.2rem 0 0.85rem;">${t('matching_lore')} (${matchedLore.length})</h2>
      <div class="catalog-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
        ${matchedLore.map(createLoreCardHTML).join('')}
      </div>
    </section>
  `;

  const input = document.getElementById('page-search-input');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      renderSearchPage();
    });
  }
}

/* ============================================================================
   HERO DETAIL MODAL (5 Tabs + Related Heroes Row)
   ============================================================================ */
function openHeroModal(heroId) {
  const hero = state.heroMap.get(heroId);
  if (!hero) return;
  state.activeModal = { type: 'hero', id: heroId };

  const heroVoice = window.MLBB_STATIC_DATA?.heroVoices?.[hero.id];
  const voiceQuote = heroVoice?.quote || MLBB_HERO_VOICE_LINES[hero.id] || (hero.story.quotes && hero.story.quotes[0]) || hero.title;
  const emblem = state.emblemMap.get(hero.build.emblemId);
  const relatedHeroes = state.heroes.filter(h =>
    h.id !== hero.id &&
    (h.roles.some(r => hero.roles.includes(r)) ||
     hero.relations.synergies.includes(h.id) ||
     hero.relations.counters.includes(h.id))
  ).slice(0, 6);

  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-hero-header">
      <div class="modal-hero-art">
        ${generateHeroPortraitSVG(hero, true)}
      </div>
      <div class="modal-hero-shade"></div>
      <div class="modal-hero-info" style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;width:100%;max-width:100%;gap:1rem;">
        <div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;">
          <div style="width:94px;height:94px;border-radius:16px;overflow:hidden;border:2px solid var(--accent-primary);box-shadow:0 8px 28px var(--accent-glow);flex-shrink:0;background:#050b14;">
            ${generateHeroPortraitSVG(hero, false)}
          </div>
          <div>
            <div class="banner-kicker">
              <span class="banner-kicker-badge">${hero.roles.map(tRole).join(' / ')}</span>
              <span>${hero.lanes.map(tLane).join(' • ')} ${t('lane_suffix')} • ${hero.faction}</span>
            </div>
            <h2 class="modal-title" id="modal-title">${hero.name}</h2>
            <p class="modal-epithet" style="max-width:540px;">${hero.title}</p>
            <div class="banner-meta" style="margin-bottom:0.4rem;">
              <span class="match-score">${t('difficulty')} ${hero.difficulty}/10 ${renderComplexityDiamonds(hero.difficulty)}</span>
              ${hero.specialties.map(s => `<span class="meta-pill">${s}</span>`).join('')}
              <span class="meta-pill">${hero.attackType}</span>
              <span class="meta-pill">${t('released')} ${hero.releaseYear}</span>
            </div>
            <div>
              <button type="button" class="liquid-pill-btn hero-voice-btn" data-play-hero-voice="${hero.id}" title="Play Hero Voice Line" style="border-color:var(--accent-primary);color:var(--accent-primary);padding:0.35rem 0.8rem;font-size:0.78rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                <span>🔊 Voice Line: "${voiceQuote}"</span>
                <div class="voice-anim-bars" style="display:none;"><span></span><span></span><span></span><span></span></div>
              </button>
            </div>
          </div>
        </div>
        <button type="button" class="${isFavorite('hero', hero.id) ? 'btn-primary' : 'btn-secondary'}" data-fav-toggle="hero:${hero.id}" style="padding:0.6rem 1.2rem;font-size:0.84rem;">
          <span>${isFavorite('hero', hero.id) ? '✓ ' + t('in_my_list') : '+ ' + t('add_my_list')}</span>
        </button>
      </div>
    </div>

    <!-- 5 HERO DETAIL TABS -->
    <div class="modal-tabs" role="tablist">
      <button class="modal-tab-btn active" data-tab="tab-overview" role="tab">${t('tab_overview')}</button>
      <button class="modal-tab-btn" data-tab="tab-skills" role="tab">${t('tab_skills')} (${hero.skills.length})</button>
      <button class="modal-tab-btn" data-tab="tab-story" role="tab">${t('tab_story')}</button>
      <button class="modal-tab-btn" data-tab="tab-build" role="tab">${t('tab_build')}</button>
      <button class="modal-tab-btn" data-tab="tab-relations" role="tab">${t('tab_relations')}</button>
    </div>

    <div class="modal-body">
      <!-- TAB 1: OVERVIEW -->
      <div id="tab-overview" class="tab-pane active">
        <!-- HERO ENTRANCE SIGNATURE VOICE SHOWCASE -->
        <div class="info-panel" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(6, 14, 28, 0.75) 100%); border-color: rgba(0, 229, 255, 0.35);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div style="flex:1 1 240px;">
              <div style="font-size:0.7rem;letter-spacing:1.3px;text-transform:uppercase;color:var(--accent-primary);font-weight:700;display:flex;align-items:center;gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <span>Signature Battle Voice Line</span>
              </div>
              <div style="font-size:1.02rem;font-style:italic;color:#fff;margin-top:3px;font-weight:600;">"${voiceQuote}"</div>
            </div>
            <button type="button" class="liquid-pill-btn hero-voice-btn" data-play-hero-voice="${hero.id}" style="padding:0.45rem 1rem;font-size:0.8rem;background:rgba(0,229,255,0.18);border-color:var(--accent-primary);color:#fff;">
              ▶ Play Voice
            </button>
          </div>
        </div>

        <p style="font-size: 0.98rem; line-height: 1.65; color: #e2e8f0; margin-bottom: 1.4rem;">${hero.summary}</p>
        <div class="overview-grid">
          <div class="info-panel">
            <div class="panel-heading"><span>${t('combat_ratings')}</span><span>${t('scale_100')}</span></div>
            <div class="stat-bars-list">
              ${renderStatBar(t('durability'), hero.baseStats.durability, '#10b981')}
              ${renderStatBar(t('offense'), hero.baseStats.offense, '#00e5ff')}
              ${renderStatBar(t('control_effects'), hero.baseStats.controlEffect, '#3b82f6')}
              ${renderStatBar(t('difficulty'), hero.baseStats.difficulty, '#f59e0b')}
            </div>
          </div>

          <div class="info-panel">
            <div class="panel-heading"><span>${t('base_attributes')}</span><span>${t('stats_label')}</span></div>
            <table class="attributes-table">
              <tr><td>${t('max_hp_regen')}</td><td>${hero.baseStats.hp} (${hero.baseStats.hpRegen})</td></tr>
              <tr><td>${t('resource_regen')}</td><td>${hero.baseStats.mana} (${hero.baseStats.manaRegen})</td></tr>
              <tr><td>${t('physical_attack')}</td><td>${hero.baseStats.physicalAttack}</td></tr>
              <tr><td>${t('phys_mag_def')}</td><td>${hero.baseStats.physicalDefense} / ${hero.baseStats.magicDefense}</td></tr>
              <tr><td>${t('move_atk_spd')}</td><td>${hero.baseStats.movementSpeed} / ${hero.baseStats.attackSpeed}</td></tr>
              <tr><td>${t('shop_price')}</td><td>${hero.bpCost}</td></tr>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: SKILLS & LEVEL UPGRADE TABLES -->
      <div id="tab-skills" class="tab-pane">
        <div class="skills-list">
          ${hero.skills.map((sk, idx) => `
            <div class="skill-card">
              <div class="skill-header">
                <div class="skill-icon-box">
                  ${generateSkillIconSVG(sk, hero.themeColor, idx)}
                </div>
                <div class="skill-title-group">
                  <div class="skill-slot-badge">${tSlot(sk.slot)} • ${sk.type}</div>
                  <h3 class="skill-name">${sk.name}</h3>
                  <div class="skill-tags-meta">
                    <span class="skill-meta-pill">CD: ${sk.cooldown}</span>
                    <span class="skill-meta-pill">${sk.cost}</span>
                    <span class="skill-meta-pill">${sk.scaling}</span>
                  </div>
                </div>
              </div>
              <p class="skill-desc">${sk.description}</p>
              <div class="skill-notes"><strong>${t('pro_tip')}:</strong> ${sk.notes}</div>
              ${sk.levels && sk.levels.length ? renderSkillUpgradeTable(sk.levels) : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 3: STORY, LORE & NOTABLE QUOTES -->
      <div id="tab-story" class="tab-pane">
        <div class="overview-grid" style="margin-bottom: 1.25rem;">
          <div class="info-panel">
            <div class="panel-heading"><span>${t('biography')}</span><span>${hero.hometown}</span></div>
            <div class="story-prose">${hero.story.biography}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="info-panel">
              <div class="panel-heading"><span>${t('personality_origin')}</span></div>
              <p style="font-size: 0.9rem; line-height: 1.55; color: #cbd5e1; margin-bottom: 0.75rem;">${hero.story.personality}</p>
              <table class="attributes-table">
                <tr><td>${t('faction')}</td><td>${hero.faction}</td></tr>
                <tr><td>${t('hometown')}</td><td>${hero.hometown}</td></tr>
              </table>
              ${hero.story.loreId ? `
                <button class="btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;" data-open-lore="${hero.story.loreId}">
                  ${t('open_region_lore')} &rarr;
                </button>
              ` : ''}
            </div>
            <div class="info-panel">
              <div class="panel-heading"><span>${t('lore_relationships')}</span></div>
              ${hero.relations.loreLinks.length ? hero.relations.loreLinks.map(link => {
                const targetHero = state.heroMap.get(link.heroId);
                return targetHero ? `
                  <div class="mini-entity-card" data-open-hero="${targetHero.id}" style="margin-bottom: 8px;">
                    <div class="mini-entity-thumb">${generateHeroPortraitSVG(targetHero, false)}</div>
                    <div class="mini-entity-text">
                      <div class="mini-entity-name">${targetHero.name}</div>
                      <div class="mini-entity-sub">${link.relation}</div>
                    </div>
                  </div>
                ` : '';
              }).join('') : `<p style="font-size: 0.84rem; color: var(--text-secondary);">${hero.faction}</p>`}
            </div>
          </div>
        </div>

        <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">${t('notable_quotes')}</h3>
        <div class="quotes-list">
          ${hero.story.quotes.map(q => `
            <div style="display:flex;align-items:center;gap:10px;justify-content:space-between;background:rgba(6,14,28,0.55);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:8px 12px;margin-bottom:6px;">
              <blockquote class="quote-box" style="margin:0;border:none;padding:0;">"${q}"</blockquote>
              <button type="button" class="liquid-pill-btn hero-voice-btn" data-play-quote="${encodeURIComponent(q)}" data-hero-id="${hero.id}" data-hero-name="${hero.name}" data-hero-role="${hero.roles[0]}" style="padding:4px 10px;font-size:0.75rem;flex-shrink:0;">
                ▶ Voice
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 4: RECOMMENDED BUILD, EMBLEM & PLAYSTYLE -->
      <div id="tab-build" class="tab-pane">
        <div class="info-panel" style="margin-bottom: 1.25rem;">
          <div class="panel-heading">
            <span>${t('recommended_loadout')}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:0.72rem;color:var(--text-secondary);">${t('click_item_recipe')}</span>
              <a href="#sandbox?hero=${hero.id}" class="liquid-pill-btn" style="padding:2px 8px;font-size:0.7rem;color:var(--accent-primary);">⚡ Test in Build Lab &rarr;</a>
            </div>
          </div>
          <div class="mini-entity-grid">
            ${hero.build.items.map(itemId => {
              const item = state.itemMap.get(itemId);
              if (!item) return '';
              return `
                <div class="mini-entity-card" data-open-item="${item.id}">
                  <div class="mini-entity-thumb">${generateItemSVG(item)}</div>
                  <div class="mini-entity-text">
                    <div class="mini-entity-name">${item.name}</div>
                    <div class="mini-entity-sub">${item.price}g • ${tCat(item.category)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="overview-grid">
          <div class="info-panel">
            <div class="panel-heading"><span>${t('emblem_setup')}</span></div>
            <h4 style="font-size: 1.08rem; margin-bottom: 0.5rem; color: ${emblem ? emblem.color : '#fff'};">${emblem ? emblem.name : hero.build.emblemId}</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem;">
              ${hero.build.talents.map((tal, i) => `
                <li style="background: rgba(255,255,255,0.05); padding: 7px 10px; border-radius: 8px; font-size: 0.84rem;">
                  <strong style="color: var(--accent-primary);">Tier ${i + 1}:</strong> ${tal}
                </li>
              `).join('')}
            </ul>
            <div style="font-size: 0.85rem;"><strong>${t('battle_spell')}:</strong> <span class="meta-pill">${hero.build.battleSpell}</span></div>
          </div>

          <div class="info-panel">
            <div class="panel-heading"><span>${t('playstyle_tips')}</span></div>
            <p style="font-size: 0.92rem; line-height: 1.65; color: #e2e8f0;">${hero.build.tips}</p>
          </div>
        </div>
      </div>

      <!-- TAB 5: RELATIONS (SYNERGIES, BEST WITH, COUNTERS, WEAK AGAINST) -->
      <div id="tab-relations" class="tab-pane">
        <div class="overview-grid">
          <div class="info-panel">
            <div class="panel-heading" style="color: #10b981;"><span>${t('best_with_synergies')}</span><span>${t('combo_partners')}</span></div>
            <div class="mini-entity-grid">
              ${[...new Set([...hero.relations.bestWith, ...hero.relations.synergies])].map(hid => renderMiniHeroChip(hid, t('combo_partners'))).join('')}
            </div>
          </div>

          <div class="info-panel">
            <div class="panel-heading" style="color: #00e5ff;"><span>${t('strong_against')}</span><span>${t('favorable_matchups')}</span></div>
            <div class="mini-entity-grid">
              ${hero.relations.counters.map(hid => renderMiniHeroChip(hid, `${hero.name}`)).join('')}
            </div>
          </div>

          <div class="info-panel" style="grid-column: 1 / -1;">
            <div class="panel-heading" style="color: #f59e0b;"><span>${t('weak_against')}</span><span>${t('hero_item_threats')}</span></div>
            <div class="mini-entity-grid">
              ${hero.relations.weakAgainst.map(id => {
                if (state.heroMap.has(id)) return renderMiniHeroChip(id, 'Counter');
                if (state.itemMap.has(id)) {
                  const itm = state.itemMap.get(id);
                  return `
                    <div class="mini-entity-card" data-open-item="${itm.id}">
                      <div class="mini-entity-thumb">${generateItemSVG(itm)}</div>
                      <div class="mini-entity-text">
                        <div class="mini-entity-name">${itm.name}</div>
                        <div class="mini-entity-sub">Item Counter</div>
                      </div>
                    </div>
                  `;
                }
                return `<div class="mini-entity-card"><div class="mini-entity-text"><div class="mini-entity-name">${id}</div><div class="mini-entity-sub">Counter</div></div></div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- MORE LIKE THIS / RELATED HEROES ROW -->
      <div style="margin-top: 2.2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
        <h3 class="row-title" style="margin-bottom: 1rem;">${t('more_like_this_heroes')}</h3>
        <div class="mini-entity-grid">
          ${relatedHeroes.map(h => renderMiniHeroChip(h.id, `${h.roles.map(tRole).join('/')} • ${tLane(h.lanes[0])}`)).join('')}
        </div>
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  bindModalTabs(container);
}

function renderStatBar(label, value, color) {
  return `
    <div class="stat-bar-item">
      <div class="stat-bar-label"><span>${label}</span><span>${value}/100</span></div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" style="width: ${value}%; background: ${color}; color: ${color};"></div>
      </div>
    </div>
  `;
}

function renderSkillUpgradeTable(levels) {
  const keys = Object.keys(levels[0]);
  return `
    <div class="upgrade-table-wrap">
      <table class="upgrade-table">
        <thead>
          <tr>
            ${keys.map(k => `<th>${k.toUpperCase()}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${levels.map(row => `
            <tr>
              ${keys.map(k => `<td>${row[k]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderMiniHeroChip(heroId, subtitle) {
  const h = state.heroMap.get(heroId);
  if (!h) {
    return `
      <div class="mini-entity-card">
        <div class="mini-entity-text">
          <div class="mini-entity-name" style="text-transform: capitalize;">${heroId.replace(/-/g, ' ')}</div>
          <div class="mini-entity-sub">${subtitle}</div>
        </div>
      </div>
    `;
  }
  return `
    <div class="mini-entity-card" data-open-hero="${h.id}">
      <div class="mini-entity-thumb">${generateHeroPortraitSVG(h, false)}</div>
      <div class="mini-entity-text">
        <div class="mini-entity-name">${h.name}</div>
        <div class="mini-entity-sub">${subtitle}</div>
      </div>
    </div>
  `;
}

/* ============================================================================
   ITEM DETAIL MODAL + INTERACTIVE VISUAL RECIPE TREE DIAGRAM
   ============================================================================ */
function openItemModal(itemId) {
  const item = state.itemMap.get(itemId);
  if (!item) return;
  state.activeModal = { type: 'item', id: itemId };

  const relatedItems = state.items.filter(i => i.id !== item.id && i.category === item.category && i.tier === item.tier).slice(0, 6);
  const favKey = `item:${item.id}`;
  const isFav = state.favorites.includes(favKey);

  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-hero-header item-modal-header" style="min-height: 220px; background: radial-gradient(ellipse at 25% 50%, ${item.color}25 0%, rgba(6, 14, 28, 0.95) 75%); position: relative; overflow: hidden;">
      <div class="item-modal-art-backdrop" style="position: absolute; right: 40px; top: 50%; transform: translateY(-50%); width: 220px; height: 220px; aspect-ratio: 1 / 1; opacity: 0.12; filter: blur(2px) drop-shadow(0 0 35px ${item.color}); pointer-events: none;">
        <img src="${item.icon}" alt="" width="256" height="256" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1 / 1;" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${item.remoteIcon || item.icon}';}" />
      </div>
      <div class="modal-hero-shade"></div>
      <div class="modal-hero-info" style="display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; position: relative; z-index: 2;">
        <div class="modal-item-showcase-box" style="width: 96px; height: 96px; aspect-ratio: 1 / 1; border-radius: 20px; overflow: hidden; border: 2px solid ${item.color}; flex-shrink: 0; box-shadow: 0 12px 32px rgba(0,0,0,0.85), 0 0 24px ${item.color}50; background: radial-gradient(circle at 50% 50%, rgba(14, 28, 56, 0.95) 0%, #030814 100%); display: flex; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box;">
          <img class="item-preview-img" src="${item.icon}" alt="${item.name}" width="256" height="256" style="width: 100%; height: 100%; aspect-ratio: 1 / 1; object-fit: contain; image-rendering: -webkit-optimize-contrast; border-radius: 12px; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.9)) drop-shadow(0 0 12px ${item.color}66);" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${item.remoteIcon || item.icon}';}" />
        </div>
        <div>
          <div class="banner-kicker">
            <span class="banner-kicker-badge">${tCat(item.category)}</span>
            <span>${t('tier_label').toUpperCase()} ${item.tier}</span>
          </div>
          <h2 class="modal-title" id="modal-title">${item.name}</h2>
          <div class="banner-meta">
            <span class="price-chip" style="font-size: 0.9rem;">${item.price} Gold</span>
            ${item.stats.map(s => `<span class="meta-pill">${s}</span>`).join('')}
            ${item.cooldown !== 'None' ? `<span class="meta-pill">CD: ${item.cooldown}</span>` : ''}
            <button class="liquid-pill-btn ${isFav ? 'active-fav' : ''}" data-fav-toggle="${favKey}" style="padding: 0.25rem 0.7rem; font-size: 0.76rem;">
              <span>${isFav ? '✓ ' + t('in_my_list') : '+ ' + t('add_my_list')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <div class="overview-grid" style="margin-bottom: 1.5rem;">
        <div class="info-panel">
          <div class="panel-heading"><span>${t('passive_active_lore')}</span></div>
          <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.9rem;">${item.description}</p>
          ${item.passive ? `<div class="skill-notes" style="margin-bottom: 0.75rem;">${item.passive}</div>` : ''}
          ${item.active ? `<div class="skill-notes" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.14);">${item.active}</div>` : ''}
        </div>

        <div class="info-panel">
          <div class="panel-heading"><span>${t('tactical_usage')}</span></div>
          <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.85rem;"><strong>${t('pro_tip')}:</strong> ${item.tips}</p>
          <p style="font-size: 0.88rem; color: var(--text-secondary);"><strong>${t('when_to_build')}:</strong> ${item.whenToBuild}</p>
        </div>
      </div>

      <!-- VISUAL RECIPE TREE DIAGRAM -->
      <div class="info-panel" style="margin-bottom: 1.5rem;">
        <div class="panel-heading">
          <span>${t('recipe_tree_title')}</span>
          <span>${t('click_node_jump')}</span>
        </div>
        ${renderItemRecipeTreeHTML(item)}
      </div>

      <!-- RECOMMENDED HEROES FOR THIS ITEM -->
      <div class="info-panel" style="margin-bottom: 1.5rem;">
        <div class="panel-heading"><span>${t('core_hero_synergies')}</span><span>${item.name}</span></div>
        <div class="mini-entity-grid">
          ${item.recommendedHeroes.map(hid => renderMiniHeroChip(hid, item.name)).join('')}
        </div>
      </div>

      <!-- MORE LIKE THIS: SIMILAR CATEGORY ITEMS -->
      <div>
        <h3 class="row-title" style="margin-bottom: 0.85rem;">${t('more_like_this_items')} — ${tCat(item.category)}</h3>
        <div class="mini-entity-grid">
          ${relatedItems.map(ri => `
            <div class="mini-entity-card" data-open-item="${ri.id}">
              <div class="mini-entity-thumb">${generateItemSVG(ri)}</div>
              <div class="mini-entity-text">
                <div class="mini-entity-name">${ri.name}</div>
                <div class="mini-entity-sub">${ri.price}g • ${ri.stats[0] || ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function renderItemRecipeTreeHTML(item) {
  const upgrades = item.buildsInto.map(id => state.itemMap.get(id)).filter(Boolean);
  const components = item.buildsFrom.map(id => state.itemMap.get(id)).filter(Boolean);
  const presetIds = ['blade-of-despair', 'demon-hunter-sword', 'holy-crystal', 'dominance-ice', 'winter-crown', 'immortality'];
  const presets = presetIds.map(pid => state.itemMap.get(pid)).filter(Boolean);

  return `
    <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; justify-content: center; margin-bottom: 1rem;">
      ${presets.map(p => `
        <button class="filter-chip ${p.id === item.id ? 'active' : ''}" data-open-item="${p.id}" style="font-size: 0.72rem; padding: 0.25rem 0.65rem;">
          ${p.name}
        </button>
      `).join('')}
    </div>
    <div class="recipe-tree-container">
      <!-- UPGRADES INTO (TOP ROW) -->
      ${upgrades.length ? `
        <div class="tree-level-label">${t('upgrades_into')} (${t('tier_label')} ${item.tier + 1})</div>
        <div class="tree-row">
          ${upgrades.map(u => renderTreeNode(u, false)).join('')}
        </div>
        <div class="tree-connector-vertical"></div>
        ${upgrades.length > 1 ? '<div class="tree-connector-branch"></div><div class="tree-connector-vertical"></div>' : ''}
      ` : `<div class="tree-level-label">${t('final_capstone')}</div>`}

      <!-- CURRENT SELECTED ITEM (CENTER NODE) -->
      <div class="tree-row">
        ${renderTreeNode(item, true)}
      </div>

      <!-- BUILT FROM COMPONENTS (BOTTOM ROW) -->
      ${components.length ? `
        <div class="tree-connector-vertical"></div>
        ${components.length > 1 ? '<div class="tree-connector-branch"></div><div class="tree-connector-vertical"></div>' : ''}
        <div class="tree-level-label">${t('built_from')}</div>
        <div class="tree-row">
          ${components.map(comp => {
            const subComps = comp.buildsFrom.map(sid => state.itemMap.get(sid)).filter(Boolean);
            return `
              <div style="display: flex; flex-direction: column; align-items: center;">
                ${renderTreeNode(comp, false)}
                ${subComps.length ? `
                  <div class="tree-connector-vertical" style="height: 16px;"></div>
                  <div class="tree-row" style="gap: 0.5rem;">
                    ${subComps.map(sc => renderTreeNode(sc, false)).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : `<div class="tree-level-label" style="margin-top: 0.75rem;">${t('base_tier1_comp')}</div>`}
    </div>
  `;
}

function renderTreeNode(item, isCurrent = false) {
  return `
    <div class="tree-node ${isCurrent ? 'current-item' : ''}" data-open-item="${item.id}">
      <div class="tree-node-icon">${generateItemSVG(item)}</div>
      <div class="tree-node-name">${item.name}</div>
      <div class="tree-node-gold">${item.price}g</div>
    </div>
  `;
}

/* ============================================================================
   LORE DETAIL MODAL & NEXUS CONNECTION EXPLORER
   ============================================================================ */
function openLoreModal(loreId) {
  const lore = state.loreMap.get(loreId) || state.lore[0];
  if (!lore) return;
  state.activeModal = { type: 'lore', id: lore.id };

  const leadHero = state.heroMap.get(lore.relatedHeroes[0]) || state.heroes[0];
  const favKey = `lore:${lore.id}`;
  const isFav = state.favorites.includes(favKey);
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="modal-hero-header">
      <div class="modal-hero-art">
        ${generateHeroPortraitSVG(leadHero, true)}
      </div>
      <div class="modal-hero-shade"></div>
      <div class="modal-hero-info">
        <div class="banner-kicker">
          <span class="banner-kicker-badge">${lore.region}</span>
          <span>${lore.era} • ${lore.readTime}</span>
        </div>
        <h2 class="modal-title" id="modal-title">${lore.title}</h2>
        <p class="modal-epithet">${lore.summary}</p>
        <div class="banner-meta" style="margin-top: 0.65rem;">
          <button class="liquid-pill-btn ${isFav ? 'active-fav' : ''}" data-fav-toggle="${favKey}" style="padding: 0.28rem 0.75rem; font-size: 0.78rem;">
            <span>${isFav ? '✓ ' + t('in_my_list') : '+ ' + t('add_my_list')}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <div style="display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 1.8rem;">
        ${lore.chapters.map(ch => `
          <div class="info-panel">
            <h3 style="color: var(--accent-primary); margin-bottom: 0.55rem; font-size: 1.08rem;">${ch.heading}</h3>
            <p class="story-prose">${ch.body}</p>
          </div>
        `).join('')}
      </div>

      <div class="overview-grid">
        <div class="info-panel">
          <div class="panel-heading"><span>${t('heroes_in_saga')}</span></div>
          <div class="mini-entity-grid">
            ${lore.relatedHeroes.map(hid => renderMiniHeroChip(hid, lore.region)).join('')}
          </div>
        </div>

        <div class="info-panel">
          <div class="panel-heading"><span>${t('signature_artifacts')}</span></div>
          <div class="mini-entity-grid">
            ${lore.relatedItems.map(iid => {
              const itm = state.itemMap.get(iid);
              if (!itm) return '';
              return `
                <div class="mini-entity-card" data-open-item="${itm.id}">
                  <div class="mini-entity-thumb">${generateItemSVG(itm)}</div>
                  <div class="mini-entity-text">
                    <div class="mini-entity-name">${itm.name}</div>
                    <div class="mini-entity-sub">${tCat(itm.category)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function openConnectionWebModal() {
  state.activeModal = { type: 'web', id: 'nexus' };
  const backdrop = document.getElementById('detail-modal-backdrop');
  const container = document.getElementById('detail-modal-container');

  container.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close Modal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-body" style="padding-top: 2.5rem;">
      <div class="banner-kicker"><span class="banner-kicker-badge">MLBB NEXUS</span><span>${t('web_matrix_kicker')}</span></div>
      <h2 class="modal-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">${t('web_matrix_title')}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${t('web_matrix_desc')}</p>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${state.lore.map(l => `
          <div class="info-panel" style="border-left: 4px solid ${l.themeColor};">
            <div class="panel-heading" style="color: ${l.themeColor};">
              <span>${l.region}</span>
              <button class="row-explore-link" data-open-lore="${l.id}">${t('read_chronicle')} &rarr;</button>
            </div>
            <div class="mini-entity-grid">
              ${l.relatedHeroes.map(hid => renderMiniHeroChip(hid, l.region)).join('')}
              ${l.relatedItems.map(iid => {
                const itm = state.itemMap.get(iid);
                return itm ? `
                  <div class="mini-entity-card" data-open-item="${itm.id}">
                    <div class="mini-entity-thumb">${generateItemSVG(itm)}</div>
                    <div class="mini-entity-text">
                      <div class="mini-entity-name">${itm.name}</div>
                      <div class="mini-entity-sub">${tCat(itm.category)}</div>
                    </div>
                  </div>
                ` : '';
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function bindModalTabs(container) {
  const buttons = container.querySelectorAll('.modal-tab-btn');
  const panes = container.querySelectorAll('.tab-pane');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = container.querySelector(`#${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });
}

function closeModal(resetHash = true) {
  MLBB_Audio.stopHeroVoice();
  const backdrop = document.getElementById('detail-modal-backdrop');
  if (!backdrop) return;
  backdrop.classList.add('hidden');
  document.body.style.overflow = '';
  state.activeModal = null;
  if (resetHash && (window.location.hash.startsWith('#hero/') || window.location.hash.startsWith('#item/') || window.location.hash.startsWith('#lore/'))) {
    history.pushState('', document.title, `#${state.currentRoute}`);
  }
}

/* ============================================================================
   EVENT LISTENERS & GLOBAL INTERACTIONS
   ============================================================================ */
function setupEventListeners() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('top-navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });

  window.addEventListener('hashchange', handleRouting);

  document.addEventListener('click', e => {
    if (state.audioEnabled && e.target.closest('button, a, .catalog-card, .tree-node, .draft-slot, .sandbox-item-slot, .map-region-node, [role="button"]')) {
      MLBB_Audio.playGlassClick();
    }

    // Gaming Theme Music (BGM) Toggle & Next Track
    if (e.target.closest('#bgm-toggle-btn') || e.target.closest('#drawer-bgm-btn')) {
      e.stopPropagation();
      MLBB_Audio.toggleBGM();
      return;
    }

    if (e.target.closest('#bgm-next-btn')) {
      e.stopPropagation();
      MLBB_Audio.nextBGMTrack();
      return;
    }

    // Audio SFX Toggle
    if (e.target.closest('#audio-toggle-btn') || e.target.closest('#drawer-audio-btn')) {
      MLBB_Audio.toggleSoundscape(!state.audioEnabled);
      return;
    }

    // Hero Signature Voice Line Playback (Authentic Original In-Game Audio)
    const heroVoiceBtn = e.target.closest('[data-play-hero-voice]');
    if (heroVoiceBtn) {
      e.stopPropagation();
      const hId = heroVoiceBtn.dataset.playHeroVoice;
      const hero = state.heroMap.get(hId);
      if (hero) {
        MLBB_Audio.playHeroVoice(hero.id, hero.name, heroVoiceBtn);
      }
      return;
    }

    // Hero Notable Quote Playback (Authentic Original In-Game Audio)
    const playQuoteBtn = e.target.closest('[data-play-quote]');
    if (playQuoteBtn) {
      e.stopPropagation();
      const hId = playQuoteBtn.dataset.heroId || (state.activeModal && state.activeModal.type === 'hero' ? state.activeModal.id : null);
      if (hId) {
        MLBB_Audio.playHeroVoice(hId, playQuoteBtn.dataset.heroName || '', playQuoteBtn);
      }
      return;
    }

    // Draft Slots & Presets
    const removeDraftSlot = e.target.closest('[data-remove-draft-slot]');
    if (removeDraftSlot) {
      e.stopPropagation();
      const sIdx = Number(removeDraftSlot.dataset.removeDraftSlot);
      state.draft.enemy[sIdx] = null;
      renderDraftPage();
      return;
    }

    const openDraftSlot = e.target.closest('[data-open-draft-slot]');
    if (openDraftSlot) {
      openDraftHeroPickerModal(Number(openDraftSlot.dataset.openDraftSlot));
      return;
    }

    if (e.target.closest('#draft-preset-dive')) {
      state.draft.enemy = ['chou', 'hayabusa', 'kagura', 'claude', 'tigreal'];
      renderDraftPage();
      return;
    }

    if (e.target.closest('#draft-preset-sustain')) {
      state.draft.enemy = ['yu-zhong', 'fredrinn', 'cecilion', 'brody', 'estes'];
      renderDraftPage();
      return;
    }

    if (e.target.closest('#draft-preset-burst')) {
      state.draft.enemy = ['khufra', 'saber', 'eudora', 'beatrix', 'atlas'];
      renderDraftPage();
      return;
    }

    if (e.target.closest('#draft-clear-all')) {
      state.draft.enemy = [null, null, null, null, null];
      renderDraftPage();
      return;
    }

    // Sandbox Hero & Item Slots & Dummy
    const openSandboxSlot = e.target.closest('[data-open-sandbox-slot]');
    if (openSandboxSlot) {
      openSandboxItemPickerModal(Number(openSandboxSlot.dataset.openSandboxSlot));
      return;
    }

    if (e.target.closest('#sandbox-change-hero-btn') || e.target.closest('#sandbox-pick-hero-btn')) {
      openSandboxHeroPickerModal();
      return;
    }

    const setDummyBtn = e.target.closest('[data-set-dummy]');
    if (setDummyBtn) {
      state.sandbox.dummyType = setDummyBtn.dataset.setDummy;
      renderSandboxPage();
      return;
    }

    // Delegated Modal Pickers for Draft & Sandbox
    const pickDraftCard = e.target.closest('[data-pick-draft-hero]');
    if (pickDraftCard && state.activeModal?.type === 'draft-picker') {
      const slotIndex = Number(state.activeModal.id);
      state.draft.enemy[slotIndex] = pickDraftCard.dataset.pickDraftHero;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderDraftPage();
      return;
    }

    const pickItemCard = e.target.closest('[data-pick-sandbox-item]');
    if (pickItemCard && state.activeModal?.type === 'sandbox-item-picker') {
      const slotIndex = Number(state.activeModal.id);
      state.sandbox.items[slotIndex] = pickItemCard.dataset.pickSandboxItem;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderSandboxPage();
      return;
    }

    const pickLabHeroCard = e.target.closest('[data-pick-lab-hero]');
    if (pickLabHeroCard && state.activeModal?.type === 'sandbox-hero-picker') {
      state.sandbox.heroId = pickLabHeroCard.dataset.pickLabHero;
      MLBB_Audio.playGlassClick();
      closeModal(false);
      renderSandboxPage();
      return;
    }

    // Refresh if clicked current route nav link
    const navLink = e.target.closest('.nav-link, .drawer-link, .bottom-tab');
    if (navLink && navLink.getAttribute('href')?.startsWith('#')) {
      const route = navLink.getAttribute('href').slice(1).split('?')[0];
      if (route === state.currentRoute) {
        handleRouting();
      }
    }

    // Map Territory Selection
    const selectTerritoryBtn = e.target.closest('[data-select-territory]');
    if (selectTerritoryBtn) {
      state.selectedTerritory = selectTerritoryBtn.dataset.selectTerritory;
      renderWorldMapPage();
      return;
    }

    // Language Switcher Dropdown
    const langToggleBtn = e.target.closest('#lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown-menu');
    if (langToggleBtn) {
      e.stopPropagation();
      langDropdown?.classList.toggle('open');
      return;
    }

    const setLangBtn = e.target.closest('[data-set-lang]');
    if (setLangBtn) {
      setLanguage(setLangBtn.dataset.setLang);
      langDropdown?.classList.remove('open');
      return;
    }

    if (!e.target.closest('#lang-switcher-wrap')) {
      langDropdown?.classList.remove('open');
    }

    // 1-Click Direct Burmese Toggle Pill (from Jay's Navbar)
    if (e.target.closest('#burmese-quick-toggle')) {
      setLanguage(state.lang === 'my' ? 'en' : 'my');
      return;
    }

    // Quiz Open & Quiz Interactions
    if (e.target.closest('#quiz-open-btn') || e.target.closest('#drawer-quiz-btn')) {
      document.getElementById('mobile-drawer')?.classList.remove('open');
      openQuizModal();
      return;
    }

    const quizOptBtn = e.target.closest('[data-quiz-opt]');
    if (quizOptBtn && !state.quiz.selected) {
      const opt = quizOptBtn.dataset.quizOpt;
      const qObj = QUIZ_QUESTIONS[state.quiz.index % QUIZ_QUESTIONS.length];
      state.quiz.selected = opt;
      if (opt === qObj.answer) {
        state.quiz.score += 1;
        state.quiz.streak += 1;
      } else {
        state.quiz.streak = 0;
      }
      openQuizModal();
      return;
    }

    if (e.target.closest('#quiz-hint-trigger')) {
      state.quiz.showHint = true;
      openQuizModal();
      return;
    }

    if (e.target.closest('#quiz-next-btn')) {
      state.quiz.selected = null;
      state.quiz.showHint = false;
      state.quiz.index = (state.quiz.index + 1) % QUIZ_QUESTIONS.length;
      openQuizModal();
      return;
    }

    if (e.target.closest('#quiz-reset-btn')) {
      state.quiz = { index: 0, score: 0, streak: 0, selected: null, showHint: false };
      openQuizModal();
      return;
    }

    if (e.target.closest('#quiz-inspect-btn')) {
      const qObj = QUIZ_QUESTIONS[state.quiz.index % QUIZ_QUESTIONS.length];
      if (qObj.entityType === 'hero') openHeroModal(qObj.entityId);
      else openItemModal(qObj.entityId);
      return;
    }

    // Favorite / My List Toggle (+ / ✓ button on cards & modals)
    const favToggleBtn = e.target.closest('[data-fav-toggle]');
    if (favToggleBtn) {
      e.stopPropagation();
      e.preventDefault();
      const [type, id] = favToggleBtn.dataset.favToggle.split(':');
      toggleFavorite(type, id);
      return;
    }

    // Theme Color Switcher (Cyan / Blue / Green)
    const themeBtn = e.target.closest('[data-set-theme]');
    if (themeBtn) {
      setTheme(themeBtn.dataset.setTheme);
      return;
    }

    const heroTrigger = e.target.closest('[data-open-hero]');
    if (heroTrigger) {
      e.preventDefault();
      openHeroModal(heroTrigger.dataset.openHero);
      return;
    }

    const itemTrigger = e.target.closest('[data-open-item]');
    if (itemTrigger) {
      e.preventDefault();
      openItemModal(itemTrigger.dataset.openItem);
      return;
    }

    const loreTrigger = e.target.closest('[data-open-lore]');
    if (loreTrigger) {
      e.preventDefault();
      openLoreModal(loreTrigger.dataset.openLore);
      return;
    }

    const bannerDot = e.target.closest('[data-banner-idx]');
    if (bannerDot) {
      state.bannerIndex = Number(bannerDot.dataset.bannerIdx);
      renderHomeView();
      return;
    }

    const rolePill = e.target.closest('[data-hero-role]');
    if (rolePill) {
      state.heroFilter.role = rolePill.dataset.heroRole;
      renderHeroesPage();
      return;
    }

    const lanePill = e.target.closest('[data-hero-lane]');
    if (lanePill) {
      state.heroFilter.lane = lanePill.dataset.heroLane;
      renderHeroesPage();
      return;
    }

    const itemCatPill = e.target.closest('[data-item-cat]');
    if (itemCatPill) {
      state.itemFilter.category = itemCatPill.dataset.itemCat;
      renderItemsPage();
      return;
    }

    const itemTierPill = e.target.closest('[data-item-tier]');
    if (itemTierPill) {
      state.itemFilter.tier = itemTierPill.dataset.itemTier;
      renderItemsPage();
      return;
    }

    // Account Page Interactions
    if (e.target.closest('#btn-open-sync-account')) {
      openAccountSyncModal();
      return;
    }

    if (e.target.closest('#btn-open-log-match')) {
      openLogMatchModal();
      return;
    }

    if (e.target.closest('#btn-export-account')) {
      exportAccountJson();
      return;
    }

    if (e.target.closest('#btn-quick-refresh-stats')) {
      refreshLiveMoontonStats();
      return;
    }

    const seasonBtn = e.target.closest('[data-season-sid]');
    if (seasonBtn) {
      state.accountSeasonSid = Number(seasonBtn.dataset.seasonSid);
      renderAccountPage();
      return;
    }

    const accLaneBtn = e.target.closest('[data-account-lane]');
    if (accLaneBtn) {
      state.accountLaneFilter = accLaneBtn.dataset.accountLane;
      renderAccountPage();
      return;
    }

    if (e.target.closest('#modal-close-btn') || e.target.id === 'detail-modal-backdrop') {
      closeModal(true);
      return;
    }

    if (e.target.closest('#connection-graph-btn')) {
      openConnectionWebModal();
      return;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(true);
      document.getElementById('mobile-drawer')?.classList.remove('open');
      document.getElementById('lang-dropdown-menu')?.classList.remove('open');
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      const wrapper = document.getElementById('quick-search-wrapper');
      const input = document.getElementById('quick-search-input');
      wrapper?.classList.add('open');
      input?.focus();
    }
  });

  const searchWrapper = document.getElementById('quick-search-wrapper');
  const searchToggle = document.getElementById('search-toggle-btn');
  const searchInput = document.getElementById('quick-search-input');

  searchToggle?.addEventListener('click', () => {
    searchWrapper.classList.toggle('open');
    if (searchWrapper.classList.contains('open')) {
      searchInput.focus();
    }
  });

  searchInput?.addEventListener('input', e => {
    state.searchQuery = e.target.value;
    if (window.location.hash !== '#search') {
      window.location.hash = '#search';
    } else {
      renderSearchPage();
    }
  });

  const drawer = document.getElementById('mobile-drawer');
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    drawer?.classList.add('open');
  });
  document.getElementById('mobile-drawer-close')?.addEventListener('click', () => {
    drawer?.classList.remove('open');
  });
  drawer?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => drawer.classList.remove('open'));
  });

  // 3D Interactive Perspective Tilt on Cards
  document.addEventListener('pointermove', e => {
    const card = e.target.closest('.catalog-card, .media-card, .item-card, .emblem-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = ((px - 0.5) * 14).toFixed(2);
    const rotateX = ((0.5 - py) * 12).toFixed(2);
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
  }, { passive: true });

  document.addEventListener('pointerout', e => {
    const card = e.target.closest('.catalog-card, .media-card, .item-card, .emblem-card');
    if (!card) return;
    if (!card.contains(e.relatedTarget)) {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    }
  }, { passive: true });
}

/* ============================================================================
   FIRST WEBSITE BACKGROUND MOTION GRAPHIC (dark.netflix.io 3D Constellation & Rotating Portal Rings — NO CIRCLE CURSOR)
   ============================================================================ */
function initDarkNetflixMotionEngine() {
  const canvas = document.getElementById('nexus-motion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width * 0.5;
  let mouseY = height * 0.5;

  window.addEventListener('pointermove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const NODE_COUNT = 72;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: (Math.random() - 0.5) * width * 1.6,
    y: (Math.random() - 0.5) * height * 1.6,
    z: Math.random() * 900 + 100,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: Math.random() * 2.0 + 0.9,
    gold: Math.random() > 0.82
  }));

  let portalAngle = 0;

  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    portalAngle += 0.0035;

    const cx = width * 0.5 + (mouseX - width * 0.5) * 0.04;
    const cy = height * 0.5 + (mouseY - height * 0.5) * 0.04;

    // Draw dark.netflix.io-inspired concentric temporal portal rings in deep space
    ctx.save();
    ctx.translate(cx, cy);
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const radius = Math.min(width, height) * (0.22 + rIdx * 0.13);
      ctx.save();
      ctx.rotate(portalAngle * (rIdx % 2 === 0 ? 1 : -0.8) + rIdx * 1.1);
      ctx.beginPath();
      ctx.setLineDash(rIdx === 1 ? [14, 18, 4, 18] : [6, 14]);
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = rIdx === 2
        ? 'rgba(251, 191, 36, 0.09)'
        : 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // Project 3D constellation nodes
    const projected = [];
    const fov = 520;
    const zSpeed = 1.4;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.z -= zSpeed;
      n.x += n.vx;
      n.y += n.vy;

      if (n.z <= 40) {
        n.z = 980;
        n.x = (Math.random() - 0.5) * width * 1.6;
        n.y = (Math.random() - 0.5) * height * 1.6;
      }

      const scale = fov / n.z;
      const sx = cx + n.x * scale;
      const sy = cy + n.y * scale;
      const alpha = Math.min(0.85, (1 - n.z / 1000) * 0.9);

      if (sx >= -40 && sx <= width + 40 && sy >= -40 && sy <= height + 40) {
        projected.push({ sx, sy, scale, alpha, gold: n.gold, radius: n.radius });
      }
    }

    // Draw constellation threads between nearby projected nodes & cursor
    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];

      // Connect to cursor if close
      const cdx = a.sx - mouseX;
      const cdy = a.sy - mouseY;
      const cDist = Math.hypot(cdx, cdy);
      if (cDist < 165) {
        const lineAlpha = (1 - cDist / 165) * 0.35;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // Connect to neighbor nodes
      for (let j = i + 1; j < projected.length; j++) {
        const b = projected[j];
        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const dist = Math.hypot(dx, dy);
        if (dist < 135) {
          const lineAlpha = (1 - dist / 135) * 0.18 * Math.min(a.alpha, b.alpha);
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Draw glowing node mote
      ctx.beginPath();
      ctx.arc(a.sx, a.sy, a.radius * a.scale, 0, Math.PI * 2);
      ctx.fillStyle = a.gold
        ? `rgba(251, 191, 36, ${a.alpha.toFixed(3)})`
        : `rgba(0, 229, 255, ${a.alpha.toFixed(3)})`;
      ctx.fill();
    }

    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initDarkNetflixMotionEngine();
  MLBB_Audio.init();
  updateAudioButtonsUI();
  loadDatabase();
});
