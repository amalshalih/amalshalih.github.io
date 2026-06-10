/**
 * Toast notification utilities
 * Shows user-friendly error/success messages
 */

interface ToastOptions {
	type?: 'error' | 'success' | 'info'
	duration?: number
}

/**
 * Show a toast notification
 */
export function showToast(message: string, options: ToastOptions = {}): void {
	const { type = 'info', duration = 5000 } = options

	const toast = document.createElement('div')
	toast.setAttribute('data-toast', '')
	toast.setAttribute('role', 'alert')
	toast.setAttribute('aria-live', 'polite')
	toast.className = 'fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-in-out'

	const bgColor =
		type === 'error'
			? 'bg-red-100 border-red-500 text-red-800'
			: type === 'success'
				? 'bg-green-100 border-green-500 text-green-800'
				: 'bg-blue-100 border-blue-500 text-blue-800'

	toast.innerHTML = `
		<div class="rounded-lg px-4 py-3 shadow-lg max-w-sm border ${bgColor}">
			<div class="flex items-start">
				<div class="flex-1">
					<p class="text-sm font-medium">${escapeHtml(message)}</p>
				</div>
				<button
					type="button"
					class="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
					aria-label="Close notification"
				>
					<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	`

	// Add close button handler
	const closeBtn = toast.querySelector('button')
	closeBtn?.addEventListener('click', () => removeToast(toast))

	document.body.appendChild(toast)

	// Auto-dismiss
	setTimeout(() => removeToast(toast), duration)
}

/**
 * Show error toast
 */
export function showErrorToast(message: string): void {
	showToast(message, { type: 'error' })
}

/**
 * Show success toast
 */
export function showSuccessToast(message: string): void {
	showToast(message, { type: 'success' })
}

/**
 * Remove toast from DOM
 */
function removeToast(toast: Element): void {
	const htmlToast = toast as HTMLElement
	htmlToast.style.opacity = '0'
	htmlToast.style.transform = 'translateY(1rem)'
	setTimeout(() => htmlToast.remove(), 300)
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
	const div = document.createElement('div')
	div.textContent = text
	return div.innerHTML
}
