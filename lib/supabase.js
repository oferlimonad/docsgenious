import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client if environment variables are available
// Otherwise, create a mock client that allows the app to work in local-only mode
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error)
    supabase = createMockClient()
  }
} else {
  console.warn('Supabase environment variables not found. App will work in local-only mode.')
  supabase = createMockClient()
}

function createMockClient() {
  // Create a chainable mock that returns promises that resolve with errors
  const createChainableMock = () => {
    const mock = () => mock
    mock.eq = () => mock
    mock.order = () => mock
    mock.select = () => mock
    mock.single = () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    mock.insert = () => mock
    mock.update = () => mock
    mock.delete = () => mock
    mock.upsert = () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    return Promise.resolve({ data: [], error: null })
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
      }),
      upsert: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    })
  }
}

export { supabase }

