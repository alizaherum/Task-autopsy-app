import {
  BatteryLow,
  Coffee,
  HelpCircle,
  MoreHorizontal,
  ShieldAlert,
  Sparkles,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { Trigger } from '../types'

export const TRIGGER_ICONS: Record<Trigger, LucideIcon> = {
  fear: ShieldAlert,
  boredom: Coffee,
  'unclear-steps': HelpCircle,
  overwhelm: Waves,
  perfectionism: Sparkles,
  'low-energy': BatteryLow,
  other: MoreHorizontal,
}
