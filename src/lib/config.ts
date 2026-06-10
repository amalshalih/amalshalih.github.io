import { env } from 'cloudflare:workers'
import { z } from 'zod'

const googleDriveCredsSchema = z.object({
	client_email: z.string().email(),
	private_key: z.string().min(1),
})

export type GoogleDriveCredentials = z.infer<typeof googleDriveCredsSchema>

export function getGoogleDriveCredentials(): GoogleDriveCredentials {
	const raw = env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY
	if (!raw) {
		throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY is not configured in environment variables.')
	}

	let parsedJson: unknown
	try {
		parsedJson = JSON.parse(raw)
	} catch {
		throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY is not a valid JSON string.')
	}

	const validation = googleDriveCredsSchema.safeParse(parsedJson)
	if (!validation.success) {
		throw new Error(
			'GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY JSON is missing required fields: ' +
				validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
		)
	}

	return validation.data
}

export function getResendApiKey(): string {
	const key = env.RESEND_API_KEY
	if (!key || key.trim() === '') {
		throw new Error('RESEND_API_KEY is not configured in environment variables.')
	}
	return key
}

export function getSanityReadToken(): string {
	const token = env.SANITY_API_READ_TOKEN
	if (!token || token.trim() === '') {
		throw new Error('SANITY_API_READ_TOKEN is not configured in environment variables.')
	}
	return token
}
