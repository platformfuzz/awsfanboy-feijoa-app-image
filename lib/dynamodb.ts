'use client'

// Client-side functions to call API routes
export const getItem = async (id: string) => {
  try {
    const response = await fetch(`/api/items/${id}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error getting item:', error)
    throw error
  }
}

export const updateItem = async (id: string, data: Record<string, any>) => {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Error updating item:', error)
    throw error
  }
}
