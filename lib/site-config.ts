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
	navigation: NavigationItem[]
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
	navigation: [
		{ name: 'Home', href: '#home', isHash: true, enabled: true },
		{ name: 'About', href: '#about', isHash: true, enabled: true },
		{ name: 'Services', href: '#services', isHash: true, enabled: true },
		{ name: 'Gallery', href: '#gallery', isHash: true, enabled: true },
		{ name: 'Stats', href: '#stats', isHash: true, enabled: true },
		{ name: 'Shop', href: '/shop', isHash: false, enabled: true },
		{ name: 'Blog', href: '/blog', isHash: false, enabled: true },
		{ name: 'Contact', href: '#contact', isHash: true, enabled: true }
	],
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

import { useEffect, useState, useCallback, useMemo } from 'react'
import { getDb } from './firebase'
import { doc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore'

export function useSiteConfig() {
	const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig)
	const [isLoaded, setIsLoaded] = useState(false)
	const [lastFetch, setLastFetch] = useState(0)

	const loadFromServer = useCallback(async () => {
		try {
			if (typeof window === 'undefined') return

			// Load site config
			console.log('Attempting to load site config from server...')

			// Fetch main config and slides in parallel
			const [configRes, slidesRes] = await Promise.all([
				fetch('/api/config/get', { cache: 'no-store' }),
				fetch('/api/slides', { cache: 'no-store' })
			])

			let remoteConfig: Partial<SiteConfig> = {}
			if (configRes.ok) {
				const data = await configRes.json()
				remoteConfig = data.config || {}
				console.log('Loaded remote config from /api/config/get:', remoteConfig)
			} else {
				console.warn(`Failed to load remote config from /api/config/get: HTTP ${configRes.status}`)
			}

			let slides: HeroSlide[] = []
			if (slidesRes.ok) {
				const data = await slidesRes.json()
				slides = data.slides || []
				console.log('Loaded slides from /api/slides:', slides)
			} else {
				console.warn(`Failed to load slides from /api/slides: HTTP ${slidesRes.status}, using empty array`)
			}

			if (Object.keys(remoteConfig).length > 0 || slides.length > 0) {
				setConfig((prev) => {
					// Start with default, then apply current local state, then remote config
					// This ensures local changes (e.g., from Firestore updates) are not overwritten
					// by an older remote config, unless the remote config explicitly provides a value.
					const merged = {
						...defaultSiteConfig,
						...prev, // Apply current state to preserve any real-time updates not yet saved to server
						...remoteConfig,
					}

					// Prioritize server data for specific arrays if they exist in remoteConfig
					// This ensures that if the server has an empty array, it overwrites local data.
					if (remoteConfig.gallery !== undefined) {
						merged.gallery = remoteConfig.gallery;
					}
					if (remoteConfig.stats !== undefined) {
						merged.stats = remoteConfig.stats;
					}
					if (remoteConfig.testimonials !== undefined) {
						merged.testimonials = remoteConfig.testimonials;
					}
					if (remoteConfig.services !== undefined) {
						merged.services = remoteConfig.services;
					}
					if (remoteConfig.navigation !== undefined) {
						merged.navigation = remoteConfig.navigation;
					}

					// Always overwrite heroSlides if we got actual slides from the API
					// This is because slides are managed separately and should always reflect the latest from /api/slides
					merged.heroSlides = slides

					console.log('Merged site configuration set to state:', merged)
					saveSiteConfigToLocal(merged)
					setLastFetch(Date.now())
					console.log('Site config successfully updated from server and merged with local state.')
					return merged
				})
			} else {
				console.log('No new remote config or slides to merge. Using current state or local cache.')
			}
		} catch (error) {
			console.warn('Failed to load site config from server, attempting to use local cache or defaults:', error)
			// Try to load from local storage as fallback
			const cached = loadSiteConfigFromLocal()
			if (cached && cached !== defaultSiteConfig) {
				setConfig(cached)
			}
		} finally {
			setIsLoaded(true)
		}
	}, [])

	useEffect(() => {
		// Load from local cache immediately
		const cached = loadSiteConfigFromLocal()
		setConfig(cached)
		setIsLoaded(true)

		// Always fetch fresh config from server immediately
		setTimeout(loadFromServer, 0)

		// Real-time updates from Firestore for slides (only if Firebase is available)
		let unsubscribe: (() => void) | undefined
		try {
			// Real-time synchronization is disabled to support unified configuration management
			// We rely on loadFromServer and manual saves for better consistency
		} catch (error) {
			console.warn('Firestore subscription not available, using polling only:', error)
		}

		// Lightweight periodic refresh as a fallback safety net
		const intervalId = setInterval(() => {
			loadFromServer()
		}, 300000) // Increased from 60 seconds to 300 seconds (5 minutes)

		return () => {
			clearInterval(intervalId)
			if (unsubscribe) unsubscribe()
		}
	}, [loadFromServer])

	const save = useCallback((next: SiteConfig) => {
		setConfig(next)
		saveSiteConfigToLocal(next)
		
		; (async () => {
			try {
				if (typeof window === 'undefined') return

				console.log('Sending config to server /api/config/save:', next)
				const response = await fetch('/api/config/save', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(next),
				})
				
				if (!response.ok) {
					const errData = await response.json()
					console.error('Server failed to save config:', errData)
					throw new Error(errData.error || 'Failed to save to server')
				}
				
				const result = await response.json()
				console.log('Config saved successfully to server:', result)

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				
				console.log('Site config saved to server successfully')
			} catch (error) {
				console.warn('Failed to save config to server, will retry later or rely on local:', error)
				// The local state and localStorage are already updated, 
				// so the user sees their changes immediately.
			}
		})()
	}, [])

	const refresh = useCallback(() => {
		loadFromServer()
	}, [loadFromServer])

	const memoizedConfig = useMemo(() => config, [config])

	return { config: memoizedConfig, setConfig: save, isLoaded, refresh }
}


