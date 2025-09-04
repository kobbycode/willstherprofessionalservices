'use client'

export type HeroSlide = {
	imageUrl: string
	title?: string
	subtitle?: string
	ctaLabel?: string
	ctaHref?: string
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
}

export const defaultSiteConfig: SiteConfig = {
	siteName: 'Willsther Professional Services',
	siteDescription: 'Professional cleaning and maintenance services',
	contactEmail: 'willstherprofessionalservices@gmail.com',
	contactPhone: '(233) 594 850 005',
	maintenanceMode: false,
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
		embedUrl: '',
		lat: undefined,
		lng: undefined,
		zoom: 14
	},
	testimonials: [],
	gallery: []
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
import { doc, setDoc } from 'firebase/firestore'

export function useSiteConfig() {
	const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig)
	const [isLoaded, setIsLoaded] = useState(false)
	const [lastFetch, setLastFetch] = useState(0)

	const loadFromServer = useCallback(async () => {
		try {
			if (typeof window === 'undefined') return
			const res = await fetch('/api/config/get', { cache: 'no-store' })
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			const { config: remote } = await res.json()
			if (remote && typeof remote === 'object') {
				const merged = { ...defaultSiteConfig, ...remote }
				setConfig(merged)
				saveSiteConfigToLocal(merged)
				setLastFetch(Date.now())
				console.log('Site config loaded from server:', merged)
			}
		} catch (error) {
			console.warn('Failed to load site config from server:', error)
		}
	}, [])

	useEffect(() => {
		// Load from local cache immediately
		const cached = loadSiteConfigFromLocal()
		setConfig(cached)
		setIsLoaded(true)

		// Always fetch fresh config from server immediately
		setTimeout(loadFromServer, 0)
	}, [loadFromServer])

	const save = useCallback((next: SiteConfig) => {
		setConfig(next)
		saveSiteConfigToLocal(next)
		;(async () => {
			try {
				// Check if we're on the client side
				if (typeof window === 'undefined') return
				
				const db = getDb()
				const ref = doc(db, 'config', 'site')
				await setDoc(ref, next, { merge: true })
			} catch {
				// no-op
			}
		})()
	}, [])

	const refresh = useCallback(() => {
		loadFromServer()
	}, [loadFromServer])

	const memoizedConfig = useMemo(() => config, [config])

	return { config: memoizedConfig, setConfig: save, isLoaded, refresh }
}


