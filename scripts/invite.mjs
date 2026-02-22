// Invite script: creates a member account and adds profile to Firestore
// Usage: node scripts/invite.mjs <email> [name] [role]
// All new members get the default password and must change it on first login.

const API_KEY = 'AIzaSyBM-fzZfE9zh7LXssFYsLiirs7vBxeAfGk'
const PROJECT_ID = 'schwanenclub-web'
const DEFAULT_PASSWORD = 'Schwanen2026'

const email = process.argv[2]
const name = process.argv[3] || email.split('@')[0]
const role = process.argv[4] || 'member'

if (!email) {
    console.error('Usage: node scripts/invite.mjs <email> [name] [role]')
    process.exit(1)
}

async function getAccessToken() {
    const { readFileSync } = await import('fs')
    const { homedir } = await import('os')
    const configPath = homedir() + '/.config/configstore/firebase-tools.json'
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    const refreshToken = config.tokens?.refresh_token
    if (!refreshToken) throw new Error('No refresh token. Run "firebase login" first.')

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
            client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
        }),
    })
    const data = await res.json()
    if (!data.access_token) throw new Error('Token exchange failed')
    return data.access_token
}

async function main() {
    // 1. Create Firebase Auth user
    console.log(`👤 Creating account for ${email}...`)
    const signUpRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: DEFAULT_PASSWORD,
                returnSecureToken: true,
            }),
        }
    )
    const signUpData = await signUpRes.json()
    if (signUpData.error) {
        console.error('❌ Error creating account:', signUpData.error.message)
        process.exit(1)
    }
    const uid = signUpData.localId
    console.log(`✅ Account created (UID: ${uid})`)

    // 2. Add member profile to Firestore
    console.log(`📝 Adding profile to Firestore...`)
    const accessToken = await getAccessToken()

    const docData = {
        fields: {
            email: { stringValue: email },
            name: { stringValue: name },
            role: { stringValue: role },
            mustChangePassword: { booleanValue: true },
            createdAt: { stringValue: new Date().toISOString() },
        },
    }

    const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/members?documentId=${uid}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(docData),
        }
    )
    const result = await firestoreRes.json()
    if (result.error) {
        console.log('⚠️  Firestore:', result.error.message)
    } else {
        console.log('✅ Profile added to Firestore!')
    }

    // 3. Print credentials
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🦢 Share these credentials:')
    console.log(`   E-Mail:    ${email}`)
    console.log(`   Passwort:  ${DEFAULT_PASSWORD}`)
    console.log('   (Muss beim ersten Login geändert werden)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error)
