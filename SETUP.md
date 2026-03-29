# Supabase Edge Function Secrets

Go to Supabase Dashboard → Settings → Edge Functions → Secrets and add:

GOOGLE_CLIENT_ID = your google client id
GOOGLE_CLIENT_SECRET = your google client secret  
GOOGLE_ADS_DEV_TOKEN = your developer token
GOOGLE_ADS_MCC_ID = 2407401276
APP_URL = http://localhost:8080

Then deploy the edge function by running:
supabase functions deploy google-ads-auth
