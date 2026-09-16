import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.energymatchedscheduler.app',
  appName: 'Energy-Matched Scheduler',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
}

export default config
