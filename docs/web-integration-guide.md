# data-peek Web Integration Guide

> Complete walkthrough for testing, purchasing, and integrating the license system with the desktop app.

---

## Table of Contents

1. [Feature Checklist](#feature-checklist)
2. [Environment Setup](#environment-setup)
3. [Purchase Flow](#purchase-flow)
4. [Desktop App Integration](#desktop-app-integration)
5. [API Reference](#api-reference)
6. [Testing Scenarios](#testing-scenarios)

---

## Feature Checklist

### Marketing Site

| Page | Feature | Status |
|------|---------|--------|
| **Landing** | Hero section with animations | ⬜ |
| **Landing** | Features grid (12 cards) | ⬜ |
| **Landing** | Pricing cards (Free vs Pro) | ⬜ |
| **Landing** | Comparison table | ⬜ |
| **Landing** | FAQ accordion | ⬜ |
| **Landing** | CTA section | ⬜ |
| **Landing** | Footer with links | ⬜ |
| **Landing** | Mobile responsive | ⬜ |
| **Download** | Platform cards (macOS, Windows, Linux) | ⬜ |
| **Download** | Download links work | ⬜ |
| **Download** | System requirements shown | ⬜ |

### Screenshots to Add

Replace these placeholder locations with actual screenshots:

| Location | File | Recommended Size |
|----------|------|------------------|
| Hero section | `public/screenshots/hero.png` | 1920×1080 |
| Query Editor | `public/screenshots/editor.png` | 1200×750 |
| ER Diagrams | `public/screenshots/erd.png` | 1200×750 |

### Backend APIs

| Endpoint | Test Command | Expected |
|----------|--------------|----------|
| License Validate | `curl -X POST /api/license/validate` | Returns validation status |
| License Activate | `curl -X POST /api/license/activate` | Creates activation |
| License Deactivate | `curl -X POST /api/license/deactivate` | Removes activation |
| Update Check | `curl /api/updates/check?version=1.0.0` | Returns update info |
| Dodo Webhook | POST with signature | Creates license |

---

## Environment Setup

### 1. Database (Supabase or Neon)

```bash
# Create a PostgreSQL database, then:
cd apps/web
cp .env.example .env.local
```

Add your database URL:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

Run migrations:
```bash
pnpm db:push
```

### 2. Clerk Authentication

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 3. DodoPayments

1. Create account at [dodopayments.com](https://dodopayments.com)
2. Create a product:
   - Name: `data-peek Pro License`
   - Type: One-time payment
   - Price: $29 (or $99 regular)
3. Set up webhook:
   - URL: `https://your-domain.com/api/webhooks/dodo`
   - Events: `payment.completed`, `payment.refunded`
4. Copy credentials:

```env
DODO_API_KEY="..."
DODO_WEBHOOK_SECRET="..."
```

### 4. Resend (Email)

1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Create API key:

```env
RESEND_API_KEY="re_..."
```

---

## Purchase Flow

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         PURCHASE FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. User clicks "Get Pro — $29" on website                     │
│                        ↓                                         │
│   2. Redirected to DodoPayments checkout                        │
│                        ↓                                         │
│   3. User completes payment                                      │
│                        ↓                                         │
│   4. DodoPayments sends webhook to /api/webhooks/dodo           │
│                        ↓                                         │
│   5. Backend creates customer + license in database              │
│                        ↓                                         │
│   6. Welcome email sent with license key                         │
│                        ↓                                         │
│   7. User enters key in desktop app → activated!                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### License Key Format

```
DPRO-XXXX-XXXX-XXXX-XXXX
```

- Prefix: `DPRO` (Pro), `DTEAM` (Team), `DENT` (Enterprise)
- 4 groups of 4 alphanumeric characters
- No confusing characters (0, O, 1, I, l excluded)

### Setting Up the Buy Button

Update the pricing component to link to DodoPayments:

```tsx
// src/components/marketing/pricing.tsx

// Replace href with your DodoPayments checkout link
{
  cta: 'Get Pro License',
  href: 'https://checkout.dodopayments.com/buy/your-product-id',
  // Or use their SDK for embedded checkout
}
```

### Testing Purchases Locally

1. Use DodoPayments test mode
2. Use webhook testing tool (ngrok or similar):

```bash
ngrok http 3000
# Use the ngrok URL for webhook endpoint
```

3. Make a test purchase
4. Check database for new license:

```bash
pnpm db:studio
# Opens Drizzle Studio to inspect data
```

---

## Desktop App Integration

### 1. Install Dependencies

```bash
cd apps/desktop
pnpm add node-machine-id
```

### 2. Add License Types

Create `src/shared/license.ts`:

```typescript
export interface LicenseInfo {
  valid: boolean
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  status: 'active' | 'revoked' | 'expired'
  updatesUntil: string
  activationsUsed: number
  activationsMax: number
}

export interface ActivationInfo {
  id: string
  deviceId: string
  deviceName: string | null
  activatedAt: string
}

export interface ActivateResponse {
  success: boolean
  activation?: ActivationInfo
  license?: LicenseInfo
  error?: string
}
```

### 3. Create License Service (Main Process)

Create `src/main/license.ts`:

```typescript
import { machineIdSync } from 'node-machine-id'
import { app } from 'electron'
import Store from 'electron-store'
import os from 'os'

const store = new Store()
const API_BASE = 'https://datapeek.app/api' // or your domain

// Get unique device identifier
export function getDeviceId(): string {
  return machineIdSync()
}

export function getDeviceInfo() {
  return {
    deviceId: getDeviceId(),
    deviceName: os.hostname(),
    os: process.platform, // darwin, win32, linux
    appVersion: app.getVersion(),
  }
}

// Validate license with server
export async function validateLicense(licenseKey: string): Promise<LicenseInfo> {
  const response = await fetch(`${API_BASE}/license/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey,
      deviceId: getDeviceId(),
    }),
  })

  return response.json()
}

// Activate license on this device
export async function activateLicense(licenseKey: string): Promise<ActivateResponse> {
  const deviceInfo = getDeviceInfo()

  const response = await fetch(`${API_BASE}/license/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey,
      ...deviceInfo,
    }),
  })

  const result = await response.json()

  if (result.success) {
    // Store license locally
    store.set('license', {
      key: licenseKey,
      ...result.license,
      lastValidated: new Date().toISOString(),
    })
  }

  return result
}

// Deactivate this device
export async function deactivateLicense(licenseKey: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/license/deactivate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey,
      deviceId: getDeviceId(),
    }),
  })

  if (response.ok) {
    store.delete('license')
  }

  return response.json()
}

// Get stored license
export function getStoredLicense() {
  return store.get('license') as StoredLicense | undefined
}

// Check license on app startup
export async function checkLicenseOnStartup(): Promise<LicenseStatus> {
  const stored = getStoredLicense()

  if (!stored) {
    return { status: 'free', features: FREE_FEATURES }
  }

  try {
    // Try online validation
    const result = await validateLicense(stored.key)

    if (result.valid) {
      // Update cache
      store.set('license', {
        ...stored,
        ...result,
        lastValidated: new Date().toISOString(),
      })
      return { status: 'pro', features: PRO_FEATURES, license: result }
    } else {
      // License revoked or invalid
      store.delete('license')
      return { status: 'free', features: FREE_FEATURES, error: 'License invalid' }
    }
  } catch (error) {
    // Offline - use cached validation with grace period
    const lastValidated = new Date(stored.lastValidated)
    const gracePeriod = 14 * 24 * 60 * 60 * 1000 // 14 days

    if (Date.now() - lastValidated.getTime() < gracePeriod) {
      return { status: 'pro', features: PRO_FEATURES, offline: true }
    }

    return { status: 'free', features: FREE_FEATURES, error: 'License validation failed' }
  }
}
```

### 4. Add IPC Handlers

In `src/main/index.ts`:

```typescript
import {
  checkLicenseOnStartup,
  activateLicense,
  deactivateLicense,
  getStoredLicense,
} from './license'

// License IPC handlers
ipcMain.handle('license:check', async () => {
  return checkLicenseOnStartup()
})

ipcMain.handle('license:activate', async (_, licenseKey: string) => {
  return activateLicense(licenseKey)
})

ipcMain.handle('license:deactivate', async (_, licenseKey: string) => {
  return deactivateLicense(licenseKey)
})

ipcMain.handle('license:get', async () => {
  return getStoredLicense()
})
```

### 5. Update Preload Script

In `src/preload/index.ts`:

```typescript
// Add to the API object
license: {
  check: () => ipcRenderer.invoke('license:check'),
  activate: (key: string) => ipcRenderer.invoke('license:activate', key),
  deactivate: (key: string) => ipcRenderer.invoke('license:deactivate', key),
  get: () => ipcRenderer.invoke('license:get'),
}
```

### 6. Create License Store (Renderer)

Create `src/renderer/src/stores/license-store.ts`:

```typescript
import { create } from 'zustand'

interface LicenseState {
  status: 'loading' | 'free' | 'pro' | 'team' | 'enterprise'
  license: LicenseInfo | null
  isOffline: boolean
  error: string | null

  // Actions
  checkLicense: () => Promise<void>
  activateLicense: (key: string) => Promise<{ success: boolean; error?: string }>
  deactivateLicense: () => Promise<void>

  // Feature checks
  isPro: () => boolean
  canUseFeature: (feature: string) => boolean
}

// Feature limits for free tier
const FREE_LIMITS = {
  connections: 2,
  queryHistory: 50,
  tabs: 3,
  erDiagrams: 1,
}

export const useLicenseStore = create<LicenseState>((set, get) => ({
  status: 'loading',
  license: null,
  isOffline: false,
  error: null,

  checkLicense: async () => {
    try {
      const result = await window.api.license.check()
      set({
        status: result.status,
        license: result.license ?? null,
        isOffline: result.offline ?? false,
        error: result.error ?? null,
      })
    } catch (error) {
      set({ status: 'free', error: 'Failed to check license' })
    }
  },

  activateLicense: async (key: string) => {
    try {
      const result = await window.api.license.activate(key)
      if (result.success) {
        set({
          status: result.license?.plan ?? 'pro',
          license: result.license ?? null,
          error: null,
        })
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: 'Activation failed' }
    }
  },

  deactivateLicense: async () => {
    const license = get().license
    if (license) {
      await window.api.license.deactivate(license.key)
    }
    set({ status: 'free', license: null })
  },

  isPro: () => {
    const status = get().status
    return status === 'pro' || status === 'team' || status === 'enterprise'
  },

  canUseFeature: (feature: string) => {
    const isPro = get().isPro()
    if (isPro) return true

    // Check free tier limits
    switch (feature) {
      case 'unlimited-connections':
      case 'unlimited-history':
      case 'unlimited-tabs':
      case 'unlimited-erd':
      case 'inline-editing':
      case 'query-plans':
        return false
      default:
        return true
    }
  },
}))
```

### 7. Create License Dialog Component

Create `src/renderer/src/components/license-dialog.tsx`:

```tsx
import { useState } from 'react'
import { useLicenseStore } from '@/stores/license-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Key, Check, AlertCircle, ExternalLink } from 'lucide-react'

interface LicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LicenseDialog({ open, onOpenChange }: LicenseDialogProps) {
  const [licenseKey, setLicenseKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { status, license, activateLicense, deactivateLicense } = useLicenseStore()
  const isPro = status !== 'free' && status !== 'loading'

  const handleActivate = async () => {
    if (!licenseKey.trim()) return

    setIsLoading(true)
    setError(null)

    const result = await activateLicense(licenseKey.trim())

    setIsLoading(false)

    if (result.success) {
      setLicenseKey('')
      onOpenChange(false)
    } else {
      setError(result.error ?? 'Activation failed')
    }
  }

  const handleDeactivate = async () => {
    setIsLoading(true)
    await deactivateLicense()
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            License
          </DialogTitle>
        </DialogHeader>

        {isPro ? (
          // Pro license view
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium">Pro License Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Updates until: {new Date(license?.updatesUntil ?? '').toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Activations: {license?.activationsUsed} / {license?.activationsMax}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleDeactivate}
              disabled={isLoading}
            >
              Deactivate This Device
            </Button>
          </div>
        ) : (
          // Free tier view
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">License Key</label>
              <Input
                placeholder="DPRO-XXXX-XXXX-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                className="font-mono"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleActivate}
              disabled={isLoading || !licenseKey.trim()}
            >
              {isLoading ? 'Activating...' : 'Activate License'}
            </Button>

            <div className="text-center">
              <a
                href="https://datapeek.app/#pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Get a Pro license
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

### 8. Feature Gating Example

```tsx
// Example: Gating the "Add Connection" button

import { useLicenseStore } from '@/stores/license-store'

function ConnectionList() {
  const { isPro, canUseFeature } = useLicenseStore()
  const connections = useConnectionStore((s) => s.connections)

  const canAddConnection = isPro() || connections.length < 2

  return (
    <div>
      {/* ... connection list ... */}

      <Button
        onClick={handleAddConnection}
        disabled={!canAddConnection}
      >
        Add Connection
        {!canAddConnection && (
          <Badge variant="secondary" className="ml-2">Pro</Badge>
        )}
      </Button>

      {!canAddConnection && (
        <p className="text-xs text-muted-foreground mt-2">
          Free tier limited to 2 connections.
          <a href="#" onClick={openLicenseDialog}>Upgrade to Pro</a>
        </p>
      )}
    </div>
  )
}
```

---

## API Reference

### POST /api/license/validate

Validate a license key and check if device is activated.

**Request:**
```json
{
  "licenseKey": "DPRO-XXXX-XXXX-XXXX-XXXX",
  "deviceId": "unique-machine-id"
}
```

**Response:**
```json
{
  "valid": true,
  "plan": "pro",
  "status": "active",
  "updatesUntil": "2025-11-28T00:00:00.000Z",
  "activationsUsed": 1,
  "activationsMax": 3
}
```

### POST /api/license/activate

Activate a license on a new device.

**Request:**
```json
{
  "licenseKey": "DPRO-XXXX-XXXX-XXXX-XXXX",
  "deviceId": "unique-machine-id",
  "deviceName": "MacBook Pro",
  "os": "darwin",
  "appVersion": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "activation": {
    "id": "uuid",
    "deviceId": "unique-machine-id",
    "deviceName": "MacBook Pro",
    "activatedAt": "2024-11-28T00:00:00.000Z"
  },
  "license": {
    "plan": "pro",
    "updatesUntil": "2025-11-28T00:00:00.000Z",
    "activationsUsed": 1,
    "activationsMax": 3
  }
}
```

### POST /api/license/deactivate

Deactivate a device.

**Request:**
```json
{
  "licenseKey": "DPRO-XXXX-XXXX-XXXX-XXXX",
  "deviceId": "unique-machine-id"
}
```

**Response:**
```json
{
  "success": true,
  "activationsRemaining": 2
}
```

### GET /api/updates/check

Check for app updates.

**Request:**
```
GET /api/updates/check?version=1.0.0&platform=macos-arm
```

**Response:**
```json
{
  "hasUpdate": true,
  "latestVersion": "1.1.0",
  "currentVersion": "1.0.0",
  "downloadUrl": "https://...",
  "releaseNotes": "Bug fixes and improvements",
  "forceUpdate": false
}
```

---

## Testing Scenarios

### Manual Test Checklist

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| **Fresh install (free)** | Open app with no license | Free tier limits apply |
| **Valid activation** | Enter valid license key | Unlocks Pro features |
| **Invalid key** | Enter random key | Shows error message |
| **Max activations** | Activate on 4th device | Shows "max reached" error |
| **Deactivate** | Deactivate from settings | Reverts to free tier |
| **Offline mode** | Disconnect internet, open app | Uses cached license (14 day grace) |
| **Revoked license** | Revoke via webhook | Shows "revoked" error on next validation |
| **Update check** | Use older version | Shows update available |

### Test License Keys

For development, you can manually insert test licenses:

```sql
-- Insert test customer
INSERT INTO customers (email, name)
VALUES ('test@example.com', 'Test User');

-- Insert test license (get customer ID from above)
INSERT INTO licenses (customer_id, license_key, plan, status, max_activations, updates_until)
VALUES (
  'customer-uuid-here',
  'DPRO-TEST-TEST-TEST-TEST',
  'pro',
  'active',
  3,
  NOW() + INTERVAL '1 year'
);
```

---

## Deployment Checklist

- [ ] Database migrations run on production
- [ ] Environment variables set on Vercel/hosting
- [ ] DodoPayments webhook URL updated to production
- [ ] Clerk production keys configured
- [ ] Resend domain verified
- [ ] Download links point to actual releases
- [ ] Screenshots added to marketing site

---

*Document created: November 2024*
