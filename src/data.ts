import {
  Hammer,
  Truck,
  PaintRoller,
  ShoppingCart,
  Wrench,
  Sparkles,
  Leaf,
  type LucideIcon,
} from 'lucide-react'

export interface Category {
  icon: LucideIcon
  title: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    icon: Hammer,
    title: 'Construction',
    description: 'Masonry, carpentry, concrete work, and general site labour.',
    image: '/categories/construction.jpg',
  },
  {
    icon: PaintRoller,
    title: 'Painting & Finishing',
    description: 'Interior and exterior painting, tiling, and surface prep.',
    image: '/categories/painting.jpg',
  },
  {
    icon: Wrench,
    title: 'Electrical & Plumbing',
    description: 'Basic installations, repairs, and maintenance support.',
    image: '/categories/electrical.jpg',
  },
  {
    icon: Truck,
    title: 'Logistics & Moving',
    description: 'Loading, offloading, deliveries, and warehouse support.',
    image: '/categories/logistics.jpg',
  },
  {
    icon: ShoppingCart,
    title: 'Retail & Hospitality',
    description: 'Event setup, restocking, customer service, and cleaning.',
    image: '/categories/hospitality.jpg',
  },
  {
    icon: Leaf,
    title: 'Landscaping & Cleaning',
    description: 'Groundskeeping, deep cleaning, and facility maintenance.',
    image: '/categories/landscaping.jpg',
  },
  {
    icon: Sparkles,
    title: 'General Labour',
    description: 'Flexible hands for short-term and seasonal task needs.',
    image: '/categories/general-labour.jpg',
  },
]

export interface Step {
  number: string
  title: string
  description: string
}

export const steps: Step[] = [
  {
    number: '01',
    title: 'Post a task or pick a worker',
    description:
      'Describe the job you need done — or browse verified worker profiles and dispatch someone directly.',
  },
  {
    number: '02',
    title: 'We match and confirm',
    description:
      'Our coordinators confirm the skill match, agree on timing, and handle the logistics.',
  },
  {
    number: '03',
    title: 'Work begins — GPS-verified',
    description:
      'Attendance is logged through GPS check-in at your site. Real-time confirmation your worker arrived.',
  },
  {
    number: '04',
    title: 'Pay securely via mobile money',
    description:
      'When the task is complete and approved, payment is settled through secure mobile money. 15% fee, 85% to the worker.',
  },
]

export interface Pillar {
  title: string
  description: string
}

export const pillars: Pillar[] = [
  {
    title: 'Dignity',
    description:
      'A record should mark where someone has been, not where they are stuck. Every job is a chance to build proof of skill and reliability.',
  },
  {
    title: 'Transparency',
    description:
      'GPS-verified attendance, digital work records, and clear pricing on both sides. No hidden fees, no ambiguity.',
  },
  {
    title: 'Trust',
    description:
      'Every worker is vetted and skill-certified by our team. Every employer agrees to engage with fairness and human dignity.',
  },
]

export interface Stat {
  value: string
  label: string
}

export const stats: Stat[] = [
  { value: '15%', label: 'Service fee per completed job' },
  { value: '85%', label: 'Paid directly to the worker' },
  { value: '7', label: 'Certified skill categories' },
  { value: '100%', label: 'GPS-verified attendance' },
]

export interface Story {
  tag: string
  title: string
  excerpt: string
  image: string
}

export const stories: Story[] = [
  {
    tag: 'News',
    title: 'BeyondX partners with Accra Metropolitan Assembly for city maintenance pilot',
    excerpt: 'Twelve workers deployed across three municipal sites in a six-week pilot programme.',
    image: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    tag: 'Events',
    title: 'BeyondX joins the Ghana Employers Association as impact partner',
    excerpt: 'A new partnership to promote second-chance hiring across member organisations.',
    image: 'https://images.pexels.com/photos/7149172/pexels-photo-7149172.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    tag: 'Stories',
    title: 'Kwame\'s story: from release to head of site team in eight months',
    excerpt: 'How a construction certification and a GPS-verified work record opened new doors.',
    image: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

export interface InstagramPost {
  image: string
  caption: string
}

export const instagramPosts: InstagramPost[] = [
  {
    image: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Day 3 on site in East Legon. Masonry team delivering.',
  },
  {
    image: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Skills certification session with our newest cohort.',
  },
  {
    image: 'https://images.pexels.com/photos/8961082/pexels-photo-8961082.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'GPS check-in confirmed. Another job underway in Tema.',
  },
  {
    image: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Logistics team loading up for a big move in Osu.',
  },
  {
    image: 'https://images.pexels.com/photos/3238930/pexels-photo-3238930.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Finishing touches on a painting job in Labone.',
  },
  {
    image: 'https://images.pexels.com/photos/1453974/pexels-photo-1453974.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Groundskeeping crew transforming a community space.',
  },
]
