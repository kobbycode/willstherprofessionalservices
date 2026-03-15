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
}

export const defaultSiteConfig: SiteConfig = {
	siteName: 'Willsther Professional Services',
	siteDescription: 'Professional cleaning and maintenance services',
	contactEmail: 'willstherprofessionalservices@gmail.com',
	contactPhone: '0208267704',
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
			instagram: '',
			twitter: '',
			linkedin: ''
		},
		copyright: `© ${new Date().getFullYear()} Willsther Professional Services. All rights reserved.`,
		links: {
			services: [
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
	testimonials: [],
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
	}
}

const STORAGE_KEY = 'siteConfig'

export function loadSiteConfigFromLocal(): SiteConfig {
	if (typeof window === 'undefined') return defaultSiteConfig
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return defaultSiteConfig
		const parsed = JSON.parse(raw) as SiteConfig
		return { ...defaultSiteConfig, ...parsed }
	} catch {
		return defaultSiteConfig
	}
}

export function saveSiteConfigToLocal(config: SiteConfig) {
	if (typeof window === 'undefined') return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

import { useEffect, useState, useCallback, useMemo, createContext, useContext } from 'react'
import { getDb } from './firebase'
import { doc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore'

// Context for global site configuration
interface SiteContextType {
	config: SiteConfig
	setConfig: (next: SiteConfig) => void
	saveConfig: (next: SiteConfig) => Promise<{ success: boolean; error?: string }>
	isLoaded: boolean
	refresh: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
	const [config, setConfigState] = useState<SiteConfig>(defaultSiteConfig)
	const [isLoaded, setIsLoaded] = useState(false)

	// Local update only - updates state and localStorage immediately
	const setConfig = useCallback((next: SiteConfig) => {
		setConfigState(next)
		saveSiteConfigToLocal(next)
	}, [])

	const loadFromServer = useCallback(async () => {
		try {
			if (typeof window === 'undefined') return

			console.log('--- SiteProvider Sync Start ---')
			console.log('Fetching fresh configuration...')
			
			const [configRes, slidesRes] = await Promise.all([
				fetch('/api/config/get', { cache: 'no-store' }),
				fetch('/api/slides', { cache: 'no-store' })
			])

			let remoteConfig: Partial<SiteConfig> = {}
			if (configRes.ok) {
				const data = await configRes.json()
				remoteConfig = data.config || {}
				console.log('Remote config received. Keys:', Object.keys(remoteConfig))
				if (remoteConfig.gallery) console.log('Remote Gallery count:', remoteConfig.gallery.length)
			}

			let slides: HeroSlide[] = []
			if (slidesRes.ok) {
				const data = await slidesRes.json()
				slides = data.slides || []
				console.log('Remote slides received. Count:', slides.length)
			}

			if (Object.keys(remoteConfig).length > 0 || slides.length > 0) {
				setConfigState((prev) => {
					console.log('Current local state Gallery count:', prev.gallery?.length || 0)
					
					// Merge default, current local (for settings not on server), and remote
					const merged = {
						...defaultSiteConfig,
						...prev,
						...remoteConfig,
						heroSlides: slides.length > 0 ? slides : (remoteConfig.heroSlides || prev.heroSlides)
					}

					// Arrays MUST be completely overwritten by server if they exist there
					// to ensure deletions persist after a refresh
					const arrayKeys: (keyof SiteConfig)[] = ['gallery', 'stats', 'testimonials', 'services']
					for (const key of arrayKeys) {
						if (Object.prototype.hasOwnProperty.call(remoteConfig, key)) {
							console.log(`Overwriting key "${key}" with server data to ensure consistency/deletions`)
							;(merged as any)[key] = remoteConfig[key]
						}
					}

					// Navigation is a special case (object structure)
					if (remoteConfig.navigation) {
						merged.navigation = remoteConfig.navigation
					}

					console.log('Final merged Gallery count:', merged.gallery?.length || 0)
					saveSiteConfigToLocal(merged)
					return merged
				})
			}
			console.log('--- SiteProvider Sync End ---')
		} catch (error) {
			console.error('SiteProvider: Sync failed:', error)
			console.log('--- SiteProvider Sync Error ---')
			const cached = loadSiteConfigFromLocal()
			if (cached && cached !== defaultSiteConfig) {
				setConfigState(cached)
			}
		} finally {
			setIsLoaded(true)
		}
	}, [])

	useEffect(() => {
		// 1. Load from local storage for immediate UI
		const cached = loadSiteConfigFromLocal()
		if (cached) {
			console.log('SiteProvider: Loaded from LocalStorage. Gallery count:', cached.gallery?.length || 0)
			setConfigState(cached)
		}
		
		// 2. Load from server to sync
		loadFromServer()

		// 3. Refresh every 10 minutes
		const interval = setInterval(loadFromServer, 600000)
		return () => clearInterval(interval)
	}, [loadFromServer])

	const saveConfig = useCallback(async (dataToSave?: SiteConfig): Promise<{ success: boolean; error?: string }> => {
		const target = dataToSave || config
		console.log('SiteProvider: PERSISTING TO SERVER...', { 
			galleryCount: target.gallery?.length,
			keys: Object.keys(target)
		})

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

			const result = await response.json()
			console.log('SiteProvider: Server save SUCCESSFUL', result)
			
			// After successful save, update local state to be exactly what was saved
			setConfigState(target)
			saveSiteConfigToLocal(target)
			
			return { success: true }
		} catch (error) {
			console.error('SiteProvider: Server save FAILED:', error)
			return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
		}
	}, [config])

	const value = useMemo(() => ({
		config,
		setConfig,      // Local only
		saveConfig,     // Server persistence
		isLoaded,
		refresh: loadFromServer
	}), [config, setConfig, saveConfig, isLoaded, loadFromServer])

	return (
		<SiteContext.Provider value={value}>
			{children}
		</SiteContext.Provider>
	)
}

export function useSiteConfig() {
	const context = useContext(SiteContext)
	if (context === undefined) {
		// Fallback for components used outside Provider (though rare in this app)
		return {
			config: defaultSiteConfig,
			setConfig: () => { },
			saveConfig: async () => ({ success: false, error: 'SiteConfig not initialized' }),
			isLoaded: false,
			refresh: () => { }
		}
	}
	return context
}


