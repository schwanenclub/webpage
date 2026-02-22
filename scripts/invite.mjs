// Invite script: adds member to Firestore and sends sign-in email
// Usage: node scripts/invite.mjs <email> [name] [role]

const API_KEY = 'AIzaSyBM-fzZfE9zh7LXssFYsLiirs7vBxeAfGk'
const PROJECT_ID = 'schwanenclub-web'
const CONTINUE_URL = 'https://schwanenclub.github.io/webpage/login'

const email = process.argv[2]
const name = process.argv[3] || email.split('@')[0]
const role = process.argv[4] || 'member'

if (!email) {
    console.error('Usage: node scripts/invite.mjs <email> [name] [role]')
    process.exit(1)
}

async function sendSignInLink() {
    console.log(`📧 Sending sign-in link to ${email}...`)

    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requestType: 'EMAIL_SIGNIN',
                email,
                continueUrl: CONTINUE_URL,
                canHandleCodeInApp: true,
            }),
        }
    )

    const data = await res.json()
    if (data.error) {
        console.error('❌ Error sending email:', data.error.message)
        return false
    }

    console.log('✅ Sign-in link sent!')
    return true
}

async function addMemberToFirestore() {
    console.log(`📝 Adding ${email} to Firestore members...`)

    let accessToken
    try {
        const { readFileSync } = await import('fs')
        const { homedir } = await import('os')
        const configPath = homedir() + '/.config/configstore/firebase-tools.json'
        const config = JSON.parse(readFileSync(configPath, 'utf-8'))
        const refreshToken = config.tokens?.refresh_token

        if (!refreshToken) throw new Error('No refresh token found')

        // Exchange Firebase CLI refresh token for Google OAuth access token
        const oauthRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
                client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
            }),
        })
        const oauthData = await oauthRes.json()
        accessToken = oauthData.access_token
    } catch (err) {
        console.log('⚠️  Could not get access token:', err.message)
        console.log('   Run "firebase login" first, then retry.')
        return
    }

    if (!accessToken) {
        console.log('⚠️  Could not get access token. Run "firebase login" first.')
        return
    }

    // Add to Firestore
    const docData = {
        fields: {
            email: { stringValue: email },
            name: { stringValue: name },
            role: { stringValue: role },
            invitedAt: { stringValue: new Date().toISOString() },
        },
    }

    const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/members?documentId=${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
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
        console.log('✅ Member added to Firestore!')
    }
}

async function main() {
    const emailSent = await sendSignInLink()
    if (emailSent) {
        await addMemberToFirestore()
    }
    console.log('\n🦢 Done!')
}

main().catch(console.error)
