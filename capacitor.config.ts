import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.taskautopsy.app',
  appName: 'Task Autopsy',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
}

export default config
