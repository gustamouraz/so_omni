export const Projection = Object.freeze({ NONE: "none", ANDROID_AUTO: "android_auto", CARPLAY: "carplay" });
export const Tab = Object.freeze({ MAP: "map", MEDIA: "media", PHONE: "phone", APPS: "apps", SETTINGS: "settings" });
export const PhoneView = Object.freeze({ CONTACTS: "contacts", KEYPAD: "keypad" });

export const tracks = Object.freeze([
  Object.freeze({ artist: "Neon Highway", duration: 224, source: "USB", title: "Night Drive" }),
  Object.freeze({ artist: "Omni Sessions", duration: 198, source: "USB", title: "Green Pulse" }),
  Object.freeze({ artist: "Cidade Elétrica", duration: 247, source: "USB", title: "Rota 163" })
]);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createInitialState() {
  return {
    activeTab: Tab.MAP,
    bluetoothEnabled: true,
    brightness: 72,
    clock: "09:41",
    date: "Qua, 22/07",
    media: { elapsed: 0, muted: false, playing: false, repeat: false, shuffle: false, trackIndex: 0, volume: 64 },
    phone: { activeCall: null, callSeconds: 0, connected: false, dialInput: "", view: PhoneView.CONTACTS },
    projection: Projection.NONE,
    projectionConnected: false,
    // This is the safe default for the 1 GB device.  It can be enabled again
    // in Ajustes when the production GPU driver proves it is comfortable.
    reducedMotion: true,
    wifiEnabled: true
  };
}

export function reduce(state, event) {
  switch (event.type) {
    case "SELECT_TAB":
      return Object.values(Tab).includes(event.tab) ? { ...state, activeTab: event.tab } : state;
    case "TOGGLE_WIFI":
      return { ...state, wifiEnabled: !state.wifiEnabled };
    case "TOGGLE_BLUETOOTH": {
      const bluetoothEnabled = !state.bluetoothEnabled;
      return bluetoothEnabled ? { ...state, bluetoothEnabled } : {
        ...state,
        bluetoothEnabled,
        phone: { ...state.phone, activeCall: null, callSeconds: 0, connected: false },
        projection: Projection.NONE,
        projectionConnected: false
      };
    }
    case "CONNECT_PROJECTION":
      if (!Object.values(Projection).includes(event.projection) || event.projection === Projection.NONE || !state.bluetoothEnabled) return state;
      return {
        ...state,
        phone: { ...state.phone, connected: true },
        projection: event.projection,
        projectionConnected: true
      };
    case "DISCONNECT_PROJECTION":
      return { ...state, projection: Projection.NONE, projectionConnected: false };
    case "CONNECT_PHONE":
      return state.bluetoothEnabled ? { ...state, phone: { ...state.phone, connected: true } } : state;
    case "DISCONNECT_PHONE":
      return {
        ...state,
        phone: { ...state.phone, activeCall: null, callSeconds: 0, connected: false, dialInput: "" },
        projection: Projection.NONE,
        projectionConnected: false
      };
    case "SET_PHONE_VIEW":
      return Object.values(PhoneView).includes(event.view) ? { ...state, phone: { ...state.phone, view: event.view } } : state;
    case "DIAL_DIGIT":
      return /^[0-9*#]$/.test(event.digit) && state.phone.dialInput.length < 16
        ? { ...state, phone: { ...state.phone, dialInput: state.phone.dialInput + event.digit } }
        : state;
    case "DIAL_BACKSPACE":
      return { ...state, phone: { ...state.phone, dialInput: state.phone.dialInput.slice(0, -1) } };
    case "START_CALL": {
      const target = String(event.target ?? state.phone.dialInput).trim();
      if (!state.phone.connected || !state.bluetoothEnabled || !target) return state;
      return { ...state, phone: { ...state.phone, activeCall: target, callSeconds: 0, dialInput: "" } };
    }
    case "END_CALL":
      return { ...state, phone: { ...state.phone, activeCall: null, callSeconds: 0 } };
    case "CALL_TICK":
      return state.phone.activeCall
        ? { ...state, phone: { ...state.phone, callSeconds: state.phone.callSeconds + 1 } }
        : state;
    case "TOGGLE_PLAY":
      return { ...state, media: { ...state.media, playing: !state.media.playing } };
    case "SELECT_TRACK": {
      const trackIndex = Number(event.trackIndex);
      if (!Number.isInteger(trackIndex) || trackIndex < 0 || trackIndex >= tracks.length) return state;
      return { ...state, media: { ...state.media, elapsed: 0, playing: true, trackIndex } };
    }
    case "NEXT_TRACK": {
      const trackIndex = state.media.shuffle
        ? (state.media.trackIndex + 2) % tracks.length
        : (state.media.trackIndex + 1) % tracks.length;
      return { ...state, media: { ...state.media, elapsed: 0, playing: true, trackIndex } };
    }
    case "PREVIOUS_TRACK": {
      if (state.media.elapsed > 5) return { ...state, media: { ...state.media, elapsed: 0 } };
      const trackIndex = (state.media.trackIndex - 1 + tracks.length) % tracks.length;
      return { ...state, media: { ...state.media, elapsed: 0, playing: true, trackIndex } };
    }
    case "SEEK_MEDIA": {
      const duration = tracks[state.media.trackIndex].duration;
      return { ...state, media: { ...state.media, elapsed: clamp(Number(event.elapsed) || 0, 0, duration) } };
    }
    case "SET_VOLUME":
      return { ...state, media: { ...state.media, muted: false, volume: clamp(Number(event.volume) || 0, 0, 100) } };
    case "TOGGLE_MUTE":
      return { ...state, media: { ...state.media, muted: !state.media.muted } };
    case "TOGGLE_SHUFFLE":
      return { ...state, media: { ...state.media, shuffle: !state.media.shuffle } };
    case "TOGGLE_REPEAT":
      return { ...state, media: { ...state.media, repeat: !state.media.repeat } };
    case "MEDIA_TICK": {
      if (!state.media.playing) return state;
      const duration = tracks[state.media.trackIndex].duration;
      if (state.media.elapsed + 1 < duration) return { ...state, media: { ...state.media, elapsed: state.media.elapsed + 1 } };
      if (state.media.repeat) return { ...state, media: { ...state.media, elapsed: 0 } };
      const trackIndex = (state.media.trackIndex + 1) % tracks.length;
      return { ...state, media: { ...state.media, elapsed: 0, trackIndex } };
    }
    case "SET_BRIGHTNESS":
      return { ...state, brightness: clamp(Number(event.brightness) || 0, 20, 100) };
    case "TOGGLE_REDUCED_MOTION":
      return { ...state, reducedMotion: !state.reducedMotion };
    case "RESET_SETTINGS": {
      const initial = createInitialState();
      return { ...initial, clock: state.clock, date: state.date, activeTab: Tab.SETTINGS };
    }
    case "TICK":
      return { ...state, clock: event.clock, date: event.date ?? state.date };
    default:
      return state;
  }
}
