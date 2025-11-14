import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

const hardcodedServices = [
  // Cleaning Services
  {
    title: 'Residential Cleaning',
    description: 'Professional cleaning services for homes and residential properties',
    category: 'Cleaning Services',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Commercial Office Cleaning',
    description: 'Comprehensive cleaning solutions for offices and commercial spaces',
    category: 'Cleaning Services',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Industrial Facility Cleaning',
    description: 'Specialized cleaning for industrial facilities and warehouses',
    category: 'Cleaning Services',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'High-Pressure Cleaning',
    description: 'High-pressure washing for exterior surfaces and hard-to-clean areas',
    category: 'Cleaning Services',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
  },
  
  // Laundry Services
  {
    title: 'Residential Laundry',
    description: 'Professional laundry services for your home',
    category: 'Laundry Services',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Commercial Laundry',
    description: 'Large-scale laundry solutions for businesses',
    category: 'Laundry Services',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Industrial Laundry',
    description: 'Heavy-duty laundry services for industrial needs',
    category: 'Laundry Services',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Specialized Fabric Care',
    description: 'Delicate and specialized fabric cleaning services',
    category: 'Laundry Services',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
  },
  
  // Maintenance Services
  {
    title: 'Post-Construction Cleaning',
    description: 'Thorough cleaning after construction or renovation projects',
    category: 'Maintenance Services',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Carpet & Upholstery Cleaning',
    description: 'Deep cleaning for carpets, rugs, and upholstered furniture',
    category: 'Maintenance Services',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Window & Glass Cleaning',
    description: 'Streak-free window and glass surface cleaning',
    category: 'Maintenance Services',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Kitchen & Bathroom Deep Clean',
    description: 'Intensive cleaning and sanitization for kitchens and bathrooms',
    category: 'Maintenance Services',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
  },
  
  // Specialized Services
  {
    title: 'Event & Venue Cleaning',
    description: 'Pre and post-event cleaning for venues and special occasions',
    category: 'Specialized Services',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Vehicle Cleaning',
    description: 'Professional cleaning services for vehicles and fleets',
    category: 'Specialized Services',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Equipment Maintenance',
    description: 'Maintenance and cleaning of equipment and machinery',
    category: 'Specialized Services',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    title: 'Quality Assurance',
    description: 'Quality control and assurance for all our services',
    category: 'Specialized Services',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
  }
]

export async function POST() {
  try {
    console.log('=== MIGRATION START ===', new Date().toISOString())
    const db = await getAdminDb()
    
    // Check if services already exist
    const existingServices = await db.collection('services').limit(1).get()
    console.log('Existing services check:', existingServices.empty ? 'No services found' : 'Services exist')
    
    if (!existingServices.empty) {
      console.log('Migration skipped - services already exist')
      return NextResponse.json({ 
        success: true,
        message: 'Services already exist in database. Migration skipped.',
        count: 0 
      })
    }
    
    // Migrate services
    console.log('Starting batch write of', hardcodedServices.length, 'services')
    const batch = db.batch()
    let count = 0
    
    for (const service of hardcodedServices) {
      const docRef = db.collection('services').doc()
      batch.set(docRef, {
        ...service,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      count++
    }
    
    await batch.commit()
    console.log('=== MIGRATION SUCCESS === Migrated', count, 'services')
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully migrated ${count} services to database`,
      count 
    })
  } catch (error) {
    console.error('=== MIGRATION ERROR ===', error)
    return NextResponse.json({ 
      success: false,
      error: `Failed to migrate services: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
