import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSupabase } from '@/lib/supabaseClient'

export default function GoogleAdsCallback() {
  const [status, setStatus] = useState('Connecting your Google Ads account...')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error || !code) {
        setStatus('❌ Connection cancelled.')
        setTimeout(() => navigate('/settings'), 2000)
        return
      }

      try {
        const supabase = getSupabase()
        
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          navigate('/login')
          return
        }

        setStatus('🔄 Saving your connection...')

        const { error: dbError } = await supabase
          .from('ad_accounts')
          .upsert({
            user_id: user.id,
            platform: 'google_ads',
            account_id: user.id,
            account_name: user.email,
            access_token: code,
            refresh_token: '',
          }, { onConflict: 'user_id,platform,account_id' })

        if (dbError) {
          console.error('DB error:', dbError)
          setStatus(`❌ Failed to save: ${dbError.message}`)
          setTimeout(() => navigate('/settings'), 4000)
          return
        }

        setStatus('✅ Google Ads connected successfully!')
        setTimeout(() => navigate('/settings'), 2000)

      } catch (err: any) {
        console.error('Error:', err)
        setStatus(`❌ Error: ${err.message}`)
        setTimeout(() => navigate('/settings'), 4000)
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ fontSize: '18px' }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
