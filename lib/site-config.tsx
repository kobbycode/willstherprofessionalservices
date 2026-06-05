'use client'

export type HeroSlide = {
	id?: string
	imageUrl: string
	title?: string
	subtitle?: string
	ctaLabel?: string
	ctaHref?: string
	order?: number
	createdAt?: string
	updatedAt?: string
}

export type ServiceItem = {
	id: string
	title: string
	description: string
	imageUrl?: string
	category?: string
	slug?: string
}

export type Testimonial = {
	id: string
	name: string
	role?: string
	avatarUrl?: string
	content: string
	rating?: number
}

export type NavigationItem = {
	name: string
	href: string
	isHash?: boolean
	enabled?: boolean
}

export type SiteConfig = {
	siteName: string
	siteDescription: string
	contactEmail: string
	contactPhone: string
	maintenanceMode: boolean
	systemSettings?: {
		maintenanceMode: boolean
		debugMode: boolean
		autoBackup: boolean
		backupFrequency: 'daily' | 'weekly' | 'monthly'
		maxUploadSize: number
		sessionTimeout: number
		enableNotifications: boolean
		emailNotifications: boolean
		securityLevel: 'low' | 'medium' | 'high'
		requireTwoFactor: boolean
		passwordPolicy: {
			minLength: number
			requireUppercase: boolean
			requireLowercase: boolean
			requireNumbers: boolean
			requireSpecialChars: boolean
		}
		theme: 'light' | 'dark' | 'auto'
		language: string
		timezone: string
	}
	heroSlides: HeroSlide[]
	services: ServiceItem[]
	about: {
		title: string
		content: string
		imageUrl?: string
	}
	navigation: {
		main: NavigationItem[]
		legal: NavigationItem[]
	} | NavigationItem[]
	footer: {
		address?: string
		description?: string
		social?: {
			facebook?: string
			instagram?: string
			twitter?: string
			linkedin?: string
		}
		copyright?: string
		links?: {
			services?: { name: string; href: string }[]
			company?: { name: string; href: string }[]
			support?: { name: string; href: string }[]
		}
		privacyPolicy?: string
		termsOfService?: string
	}
	seo: {
		defaultTitle: string
		defaultDescription: string
		keywords: string[]
	}
	map: {
		embedUrl?: string
		lat?: number
		lng?: number
		zoom?: number
	}
	testimonials: Testimonial[]
	gallery: { id: string; imageUrl: string; caption?: string }[]
	stats: {
		title: string
		subtitle: string
		items: {
			icon: string
			number: string
			label: string
			color: string
		}[]
	}
	clients: {
		id: string
		name: string
		logoUrl: string
	}[]
	updatedAt?: string
}

export type ConfigUpdate = SiteConfig | ((prev: SiteConfig) => SiteConfig)
export type ConfigOnChange = (next: ConfigUpdate) => void

export const defaultSiteConfig: SiteConfig = {
	siteName: 'Willsther Professional Services',
	siteDescription: 'Professional cleaning and maintenance services',
	contactEmail: 'willstherprofessionalservices@gmail.com',
	contactPhone: '0594850005 / 0208267704',
	maintenanceMode: false,
	systemSettings: {
		maintenanceMode: false,
		debugMode: false,
		autoBackup: true,
		backupFrequency: 'weekly',
		maxUploadSize: 10,
		sessionTimeout: 30,
		enableNotifications: true,
		emailNotifications: true,
		securityLevel: 'medium',
		requireTwoFactor: false,
		passwordPolicy: {
			minLength: 8,
			requireUppercase: true,
			requireLowercase: true,
			requireNumbers: true,
			requireSpecialChars: false
		},
		theme: 'light',
		language: 'en',
		timezone: 'UTC'
	},
	heroSlides: [
		{
			imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop',
			title: 'Professional Cleaning',
			subtitle: 'Trusted, reliable and affordable services',
			ctaLabel: 'Get Quote',
			ctaHref: '#contact'
		}
	],
	services: [],
	about: {
		title: 'Who We Are',
		content:
			'We provide a full range of professional cleaning services for residential, commercial, and industrial clients across Ghana.',
		imageUrl: ''
	},
	navigation: {
		main: [
			{ name: 'Home', href: '/', isHash: false, enabled: true },
			{ name: 'About', href: '/#about', isHash: true, enabled: true },
			{ name: 'Services', href: '/#services', isHash: true, enabled: true },
			{ name: 'Gallery', href: '/gallery', isHash: false, enabled: true },
			{ name: 'Stats', href: '/#stats', isHash: true, enabled: true },
			{ name: 'Shop', href: '/shop', isHash: false, enabled: true },
			{ name: 'Blog', href: '/blog', isHash: false, enabled: true },
			{ name: 'Contact', href: '/#contact', isHash: true, enabled: true }
		],
		legal: [
			{ name: 'Privacy Policy', href: '/privacy-policy', isHash: false, enabled: true },
			{ name: 'Terms of Service', href: '/terms-of-service', isHash: false, enabled: true }
		]
	},
	footer: {
		address: 'Mahogany Street, #7 New Achimota, Accra, Ghana',
		description: 'Professional maintenance, refurbishment, and cleaning services for industrial, commercial, and domestic properties.',
		social: {
			facebook: '',
			instagram: 'https://www.instagram.com/willstherprofessionalservices?utm_source=qr&igsh=bG04azZsODFmOGN5',
			twitter: 'https://x.com/willsther',
			linkedin: ''
		},
		copyright: `© ${new Date().getFullYear()} Willsther Professional Services. All rights reserved.`,
		links: {
			services: [
				{ name: 'Our services', href: '/#services' },
				{ name: 'Fumigation', href: '#services' },
				{ name: 'Laundry', href: '#services' },
				{ name: 'Residential Cleaning', href: '#services' },
				{ name: 'Commercial Cleaning', href: '#services' },
				{ name: 'Industrial Cleaning', href: '#services' },
				{ name: 'Maintenance Services', href: '#services' }
			],
			company: [
				{ name: 'About Us', href: '#about' },
				{ name: 'Our Team', href: '#about' },
				{ name: 'Blog', href: '/blog' },
				{ name: 'Contact', href: '#contact' }
			],
			support: [
				{ name: 'Help Center', href: '#' },
				{ name: 'Service Areas', href: '#' },
				{ name: 'FAQs', href: '#' },
				{ name: 'Support', href: '#' }
			]
		},
		privacyPolicy: '#',
		termsOfService: '#'
	},
	seo: {
		defaultTitle: 'Willsther Professional Services',
		defaultDescription: 'Cleaning and maintenance services for homes and businesses in Ghana.',
		keywords: ['cleaning', 'maintenance', 'ghana', 'willsther']
	},
	map: {
		embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.2!3d5.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMDAuMCJOIDDCsDEyJzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890",
		lat: undefined,
		lng: undefined,
		zoom: 14
	},
	testimonials: [
		{
			id: 'testimonial-default-1',
			name: 'Edwin, Tse Addo',
			role: 'Excellent Service',
			content: 'Good work done. i am impressed, will definately recommend and refer.',
			rating: 5,
		},
		{
			id: 'testimonial-default-2',
			name: 'Kafui, Adjeiman',
			role: 'Super Support',
			content: 'Charlie, thanks so much for today Boss, really appreciate the support and excellent delivery, you guys are super.',
			rating: 5,
		},
		{
			id: 'testimonial-default-3',
			name: 'Nii My Wekuevents, Ashaley Bowta School Junction',
			role: 'Love the flexibility',
			content: 'Thanks for these Willsther. Good job.',
			rating: 5,
		},
		{
			id: 'testimonial-default-4',
			name: 'Joshua, North Kaneshie',
			role: 'Grateful for commitment',
			content: 'Thank you so much once again. I am very grateful for the commitment. Good job.',
			rating: 5,
		},
		{
			id: 'testimonial-default-5',
			name: 'Frankly, NNF Esquire ltd, Tema Community 22',
			role: 'Fantastic quality',
			content: 'Thanks Willsther Professional Services for restoring that shine back to our office building, especially the glass good work done.',
			rating: 4,
		},
		{
			id: 'testimonial-default-6',
			name: 'Priscilla, Domi Pillar',
			role: 'Spotless and Smelled great',
			content: 'Good Professional Services, The place was Spotless and Smelled great. Thank you for helping me with the heavy lifting. Would recommend Willsther Professional Services any day because you guys really came through for me.',
			rating: 5,
		},
	],
	gallery: [],
	stats: {
		title: 'Our Services in Numbers',
		subtitle: 'Delivering exceptional results through dedicated expertise and proven track record',
		items: [
			{
				icon: 'Building',
				number: '30',
				label: 'Institution / Household per month',
				color: 'bg-primary-500'
			},
			{
				icon: 'Users',
				number: '23',
				label: 'Working Experts',
				color: 'bg-accent-500'
			},
			{
				icon: 'Star',
				number: '100%',
				label: 'Satisfied Customers',
				color: 'bg-green-500'
			},
			{
				icon: 'TrendingUp',
				number: '∞',
				label: 'Growth Potential',
				color: 'bg-purple-500'
			}
		]
	},
	clients: [
		{ id: 'client-1', name: 'Century Premier Suites', logoUrl: '' },
		{ id: 'client-2', name: 'Century Niit Consult', logoUrl: '' },
		{ id: 'client-3', name: 'Cocolicious and grill pub', logoUrl: '' },
		{ id: 'client-4', name: 'Concord Hotel and Apartment', logoUrl: '' },
		{ id: 'client-5', name: 'Elim Springs Academy', logoUrl: '' },
		{ id: 'client-6', name: 'NNF Esquire', logoUrl: '' },
		{ id: 'client-7', name: 'Smart SG Ltd', logoUrl: '' },
		{ id: 'client-8', name: 'Sporty bet', logoUrl: '' },
		{ id: 'client-9', name: 'Sporty fm', logoUrl: '' },
	]
}

function deepMerge(defaults: any, override: any): any {
	const result = { ...defaults }
	for (const key of Object.keys(override)) {
		if (
			override[key] !== null &&
			typeof override[key] === 'object' &&
			!Array.isArray(override[key]) &&
			defaults[key] !== null &&
			typeof defaults[key] === 'object' &&
			!Array.isArray(defaults[key])
		) {
			result[key] = deepMerge(defaults[key], override[key])
		} else {
			result[key] = override[key]
		}
	}
	return result
}

import { useEffect, useState, useCallback, useMemo, createContext, useContext, useRef } from 'react'
import { getDb } from './firebase'
import { doc, onSnapshot } from 'firebase/firestore'

interface SiteContextType {
	config: SiteConfig
	setConfig: (next: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => void
	saveConfig: (next: SiteConfig) => Promise<{ success: boolean; error?: string }>
	isLoaded: boolean
	isDirty: boolean
	clearDirty: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
	const [config, setConfigState] = useState<SiteConfig>(defaultSiteConfig)
	const [isLoaded, setIsLoaded] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const dirtyRef = useRef(false)

	useEffect(() => {
		const db = getDb()
		const unsub = onSnapshot(doc(db, 'config', 'site'), (snap) => {
			if (snap.exists()) {
				setConfigState((prev) => {
					if (dirtyRef.current) return prev
					const remoteData = snap.data() as Partial<SiteConfig>
					const merged = deepMerge(deepMerge(defaultSiteConfig, prev), remoteData)
					const arrayKeys: (keyof SiteConfig)[] = ['heroSlides', 'gallery', 'testimonials', 'services']
					for (const key of arrayKeys) {
						if (Array.isArray(remoteData[key])) {
							;(merged as any)[key] = remoteData[key]
						}
					}
					if (remoteData.navigation) {
						merged.navigation = remoteData.navigation as any
					}
					return merged
				})
			}
			setIsLoaded(true)
		})
		return () => unsub()
	}, [])

	const setConfig = useCallback((next: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
		setConfigState((prev) => {
			const resolvedNext = typeof next === 'function' ? next(prev) : next
			return resolvedNext
		})
		dirtyRef.current = true
		setIsDirty(true)
	}, [])

	const clearDirty = useCallback(() => {
		dirtyRef.current = false
		setIsDirty(false)
	}, [])

	const saveConfig = useCallback(async (dataToSave?: SiteConfig): Promise<{ success: boolean; error?: string }> => {
		const target = dataToSave || config
		try {
			const response = await fetch('/api/config/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(target),
			})
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.error || 'Failed to save configuration')
			}
			clearDirty()
			return { success: true }
		} catch (error: any) {
			return { success: false, error: error.message || 'Network error' }
		}
	}, [config, clearDirty])

	const value = useMemo(() => ({
		config,
		setConfig,
		saveConfig,
		isLoaded,
		isDirty,
		clearDirty,
	}), [config, setConfig, saveConfig, isLoaded, isDirty, clearDirty])

	return (
		<SiteContext.Provider value={value}>
			{children}
		</SiteContext.Provider>
	)
}

export function useSiteConfig() {
	const context = useContext(SiteContext)
	if (context === undefined) {
		return {
			config: defaultSiteConfig,
			setConfig: () => { },
			saveConfig: async () => ({ success: false, error: 'SiteConfig not initialized' }),
			isLoaded: false,
			isDirty: false,
			clearDirty: () => { }
		}
	}
	return context
}
