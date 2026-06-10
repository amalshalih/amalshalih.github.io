import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

const performanceConfig = {
	logToConsole: true,
	sampleRate: 1.0,
}

function formatMetric(name: string, value: number, rating: string): object {
	return {
		name,
		value,
		rating,
		timestamp: Date.now(),
		url: window.location.href,
		userAgent: navigator.userAgent,
	}
}

const onCoreMetric = (metric: { name: string; value: number; rating: string }) => {
	const formatted = formatMetric(metric.name, metric.value, metric.rating)

	if (performanceConfig.logToConsole) {
		console.log('[Web Vitals]', formatted)
	}
}

export function initWebVitalsMonitoring() {
	onLCP((metric) => onCoreMetric({ name: 'LCP', value: metric.value, rating: metric.rating }))
	onINP((metric) => onCoreMetric({ name: 'INP', value: metric.value, rating: metric.rating }))
	onCLS((metric) => onCoreMetric({ name: 'CLS', value: metric.value, rating: metric.rating }))
	onFCP((metric) => onCoreMetric({ name: 'FCP', value: metric.value, rating: metric.rating }))
	onTTFB((metric) => onCoreMetric({ name: 'TTFB', value: metric.value, rating: metric.rating }))

	console.log('[Web Vitals] Monitoring initialized')
}

initWebVitalsMonitoring()
