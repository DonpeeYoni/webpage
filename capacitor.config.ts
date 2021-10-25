import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yonipacks.business',
  appName: 'YoniPacks Business',
  webDir: 'dist/yoni-packs',
  bundledWebRuntime: false,
  ios: {
    "contentInset": "always"
  }
};

export default config;
