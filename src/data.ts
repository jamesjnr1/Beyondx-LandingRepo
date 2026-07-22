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
  tasks: string[]
}

export const categories: Category[] = [
  {
    icon: Sparkles,
    title: 'Facility & Cleaning',
    description: 'Office, school, and hospital cleaning plus drain clearing.',
    image: '/categories/general-labour.jpg',
    tasks: ['Office cleaning', 'School compound sweeping', 'Hospital ward cleaning', 'Gutter & drain clearing'],
  },
  {
    icon: Truck,
    title: 'Logistics & Delivery',
    description: 'Warehouse, port, and market goods handling.',
    image: '/categories/logistics.jpg',
    tasks: ['Warehouse stock sorting', 'Goods offloading — Tema Port', 'Supermarket shelf stocking', 'Market porter'],
  },
  {
    icon: PaintRoller,
    title: 'Maintenance & Repairs',
    description: 'Painting, tiling, plumbing support, and site labour.',
    image: '/categories/painting.jpg',
    tasks: ['Painting & touch-up work', 'Tiling assistance', 'Plumbing support', 'Building site labourer'],
  },
  {
    icon: ShoppingCart,
    title: 'Event & Hospitality',
    description: 'Setup, catering support, and venue preparation.',
    image: '/categories/hospitality.jpg',
    tasks: ['Chair & table setup', 'Catering assistant', 'Food serving at events', 'Venue decoration setup'],
  },
  {
    icon: Leaf,
    title: 'Agriculture & Environment',
    description: 'Farming, landscaping, and green space upkeep.',
    image: '/categories/landscaping.jpg',
    tasks: ['Farm weeding & harvesting', 'Grass cutting & landscaping', 'Tree planting', 'Community garden maintenance'],
  },
  {
    icon: Wrench,
    title: 'Retail & Trade Support',
    description: 'Shop, packing, and cold store assistance.',
    image: '/categories/electrical.jpg',
    tasks: ['Shop attendant', 'Packing and bagging', 'Loading & offloading trucks', 'Cold store assistant'],
  },
  {
    icon: Hammer,
    title: 'Community Services',
    description: 'Waste collection and public space maintenance.',
    image: '/categories/construction.jpg',
    tasks: ['Neighbourhood waste collection', 'School painting', 'Street drain maintenance', 'Public park upkeep'],
  },
]

export interface Step {
  number: string
  title: string
  description: string
  tag: string
}

export const steps: Step[] = [
  {
    number: '1',
    title: 'Screen & Certify',
    description:
      'Workers are assessed for skills and readiness. Eligible candidates complete BeyondX certification.',
    tag: 'BeyondX Vetting',
  },
  {
    number: '2',
    title: 'Match to Task',
    description:
      'Employers browse categories and profiles. Coordinators confirm availability within 24 hours.',
    tag: 'Employer Platform',
  },
  {
    number: '3',
    title: 'Dispatch & Track',
    description:
      'Workers are dispatched with GPS check-in. Attendance is logged and shared in real time.',
    tag: 'GPS-Verified',
  },
  {
    number: '4',
    title: 'Rate & Record',
    description:
      'Employers rate each task. Ratings build a verified digital work record for every worker.',
    tag: 'Digital Work Record',
  },
]

export interface Pillar {
  title: string
  description: string
}

export const pillars: Pillar[] = [
  {
    title: 'Safety & Trust',
    description:
      "Every worker is cleared through BeyondX's own vetting process. GPS-tracked attendance ensures employers always know who is on site and when.",
  },
  {
    title: 'Economic Dignity',
    description:
      'Workers earn a fair market wage, paid promptly via mobile money. Earnings support both individual reintegration and family stability.',
  },
  {
    title: 'Lasting Reintegration',
    description:
      'BeyondX is not a one-time placement — it is a pathway. Workers build verified records that open doors to permanent employment after release.',
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
