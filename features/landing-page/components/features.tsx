import { Brain, History, MessageSquare, Mic, PersonStanding, Shield, Sparkles, Users } from 'lucide-react'

import { cn } from '@/lib/utils'

const features = [
  {
    title: 'Interactive Voice Chat',
    description: 'Have real conversations with historical figures through advanced AI voice technology.',
    icon: <Mic size={24} />,
  },
  {
    title: 'Historical Accuracy',
    description: 'Engage with historically accurate personas based on extensive research and documentation.',
    icon: <History size={24} />,
  },
  {
    title: 'Dynamic Conversations',
    description: "Each interaction is unique, with contextual responses that match the historical figure's personality.",
    icon: <MessageSquare size={24} />,
  },
  {
    title: 'Educational Experience',
    description: 'Learn history directly from the source through immersive conversations.',
    icon: <Brain size={24} />,
  },
  {
    title: 'Multiple Personalities',
    description: 'Choose from a diverse range of historical figures across different eras and fields.',
    icon: <Users size={24} />,
  },
  {
    title: 'Real-time Subtitles',
    description: 'Follow conversations easily with synchronized subtitles for better comprehension.',
    icon: <Sparkles size={24} />,
  },
  {
    title: 'Secure Platform',
    description: 'Your conversations are protected with enterprise-grade security and authentication.',
    icon: <Shield size={24} />,
  },
  {
    title: 'Personalized Experience',
    description: 'Track your interactions and build relationships with historical figures over time.',
    icon: <PersonStanding size={24} />,
  },
]

export default function Features() {
  return (
    <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800',
        (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
        index < 4 && 'lg:border-b dark:border-neutral-800'
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">{title}</span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  )
}
