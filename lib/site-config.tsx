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
const DIRTY_KEY = 'siteConfig_isDirty'

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

export function saveSiteConfigToLocal(config: SiteConfig, isDirty?: boolean) {
	if (typeof window === 'undefined') return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
	if (isDirty !== undefined) {
		localStorage.setItem(DIRTY_KEY, isDirty ? 'true' : 'false')
	}
}

export function loadIsDirtyFromLocal(): boolean {
	if (typeof window === 'undefined') return false
	return localStorage.getItem(DIRTY_KEY) === 'true'
}

import { useEffect, useState, useCallback, useMemo, createContext, useContext, useRef } from 'react'
import { getDb } from './firebase'
import { doc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore'

// Context for global site configuration
interface SiteContextType {
	config: SiteConfig
	setConfig: (next: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => void
	saveConfig: (next: SiteConfig) => Promise<{ success: boolean; error?: string }>
	isLoaded: boolean
	isDirty: boolean
	refresh: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
	const [config, setConfigState] = useState<SiteConfig>(defaultSiteConfig)
	const [isLoaded, setIsLoaded] = useState(false)
	const [isDirty, setIsDirty] = useState(false)

	// Local update only - updates state and localStorage immediately
	const setConfig = useCallback((next: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
		console.log('SiteProvider: Local update requested.')
		// Log config updates for debugging
		console.log('SiteProvider: setConfig triggered', typeof next === 'function' ? 'functional update' : 'direct update')
		
		setConfigState((prev) => {
			const resolvedNext = typeof next === 'function' ? next(prev) : next
			console.log('SiteProvider: State resolved. Previous keys:', Object.keys(prev || {}), 'New keys:', Object.keys(resolvedNext || {}))
			if (resolvedNext.gallery) {
				console.log('SiteProvider: Gallery count:', resolvedNext.gallery.length)
			}
			console.log('SiteProvider: Marking state as DIRTY.')
			saveSiteConfigToLocal(resolvedNext, true)
			return resolvedNext
		})
		setIsDirty(true)
	}, [])

	const loadFromServer = useCallback(async () => {
		try {
			if (typeof window === 'undefined') return

			// Check if we have unsaved changes before even starting the fetch
			const currentlyDirty = loadIsDirtyFromLocal()
			
			console.log('--- SiteProvider Sync Start ---')
			if (currentlyDirty) {
				console.log('UNSAVED CHANGES DETECTED. Background sync will only fetch, not merge to prevent overwrites.')
			}
			
			console.log('Fetching fresh configuration...')
			const [configRes, slidesRes] = await Promise.all([
				fetch('/api/config/get', { cache: 'no-store' }),
				fetch('/api/slides', { cache: 'no-store' })
			])

			let remoteConfig: Partial<SiteConfig> = {}
			if (configRes.ok) {
				const data = await configRes.json()
				remoteConfig = data.config || {}
				console.log('Remote config received.')
			}

			let slides: HeroSlide[] = []
			if (slidesRes.ok) {
				const data = await slidesRes.json()
				slides = data.slides || []
			}

			// ONLY merge if we are not dirty, OR if it's the very first load
			if (!currentlyDirty && (Object.keys(remoteConfig).length > 0 || slides.length > 0)) {
				setConfigState((prev) => {
					// Double check dirty state inside the functional update
					if (loadIsDirtyFromLocal()) {
						console.log('Skipping merge: state became dirty during fetch.')
						return prev
					}

					// Merge default, current local (for settings not on server), and remote
					const merged = {
						...defaultSiteConfig,
						...prev,
						...remoteConfig,
						heroSlides: slides.length > 0 ? slides : (remoteConfig.heroSlides || prev.heroSlides)
					}

					// Arrays MUST be completely overwritten by server if they exist there
					const arrayKeys: (keyof SiteConfig)[] = ['gallery', 'stats', 'testimonials', 'services']
					for (const key of arrayKeys) {
						if (Object.prototype.hasOwnProperty.call(remoteConfig, key)) {
							;(merged as any)[key] = remoteConfig[key]
						}
					}

					if (remoteConfig.navigation) {
						merged.navigation = remoteConfig.navigation
					}

					console.log('Successfully merged server config into local state.')
					saveSiteConfigToLocal(merged, false)
					return merged
				})
			} else if (currentlyDirty) {
				console.log('Merge SKIPPED because of unsaved local changes.')
			}

			console.log('--- SiteProvider Sync End ---')
		} catch (error) {
			console.error('SiteProvider: Sync failed:', error)
			console.log('--- SiteProvider Sync Error ---')
		} finally {
			setIsLoaded(true)
		}
	}, [])

	useEffect(() => {
		const cached = loadSiteConfigFromLocal()
		const cachedDirty = loadIsDirtyFromLocal()
		
		if (cached) setConfigState(cached)
		if (cachedDirty) setIsDirty(true)
		
		loadFromServer()

		const interval = setInterval(loadFromServer, 600000)
		return () => clearInterval(interval)
	}, [loadFromServer])

	const saveConfig = useCallback(async (dataToSave?: SiteConfig): Promise<{ success: boolean; error?: string }> => {
		// Use the provided data or fallback to the current state.
		// NOTE: If calling this without args, the 'config' value might be stale due to closure.
		const target = dataToSave || config
		console.log('SiteProvider: saveConfig triggered. Target gallery items:', target.gallery?.length || 0)
		
		try {
			const response = await fetch('/api/config/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(target),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				console.error('SiteProvider: Save FAILED on server:', errorData)
				throw new Error(errorData.error || 'Failed to save configuration')
			}

			console.log('SiteProvider: Save SUCCESS. Updating local state and clearing dirty flag.')
			
			// Update state and persistence
			setConfigState(target)
			setIsDirty(false)
			saveSiteConfigToLocal(target, false)
			
			return { success: true }
		} catch (error: any) {
			console.error('SiteProvider: Save network/server error:', error.message)
			return { success: false, error: error.message || 'Network error' }
		}
	}, [config]) // Added config to dependencies to avoid stale target

	const value = useMemo(() => ({
		config,
		setConfig,
		saveConfig,
		isLoaded,
		isDirty,
		refresh: loadFromServer
	}), [config, setConfig, saveConfig, isLoaded, isDirty, loadFromServer])

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
			isDirty: false,
			refresh: () => { }
		}
	}
	return context
}


