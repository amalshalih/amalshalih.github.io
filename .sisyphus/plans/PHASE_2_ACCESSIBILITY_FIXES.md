# 🚀 PHASE 2: HIGH PRIORITY ACCESSIBILITY FIXES

**Timeline:** 1 week (17-24 Juni 2026)  
**Goal:** WCAG Compliance 75% → 90%  
**Effort:** ~14 hours  
**Status:** 🟢 **IN PROGRESS**

---

## 📋 **TASK BREAKDOWN**

### **Task 2.1: Navbar ARIA Labels** (2h)
**File:** `src/components/Navbar.astro`  
**WCAG Impact:** +5%  
**Priority:** 🔴 HIGH

**Requirements:**
- [ ] Add `aria-haspopup="true"` to dropdown buttons
- [ ] Add `aria-expanded="true/false"` based on state
- [ ] Add `aria-label` to hamburger menu
- [ ] Add `role="menu"` to dropdown
- [ ] Add `role="menuitem"` to dropdown items

**Implementation:**
```astro
<!-- Desktop Dropdown -->
<button
  aria-haspopup="true"
  aria-expanded={isDropdownOpen ? 'true' : 'false'}
  aria-label="BARKAS menu"
>
  BARKAS ▾
</button>

<div role="menu" aria-label="BARKAS submenu">
  <a role="menuitem" href="/barkas">Katalog</a>
  <!-- ... -->
</div>

<!-- Mobile Menu -->
<button
  aria-label="Toggle menu"
  aria-expanded={mobileMenuOpen ? 'true' : 'false'}
  aria-controls="mobile-menu"
>
  <Icon name="menu" />
</button>
```

---

### **Task 2.2: Program Tabs Keyboard Navigation** (2h)
**File:** `src/pages/program.astro`  
**WCAG Impact:** +3%  
**Priority:** 🔴 HIGH

**Requirements:**
- [ ] Add `role="tablist"` to container
- [ ] Add `role="tab"` to each tab button
- [ ] Add `role="tabpanel"` to content panels
- [ ] Add `aria-selected="true/false"` to tabs
- [ ] Add `aria-controls` linking tabs to panels
- [ ] Implement arrow key navigation (← →)
- [ ] Implement Home/End key navigation

**Implementation:**
```astro
<div role="tablist" aria-label="Program categories">
  <button
    role="tab"
    id="tab-pendidikan"
    aria-selected={activeTab === 'pendidikan' ? 'true' : 'false'}
    aria-controls="panel-pendidikan"
    onclick={() => setActiveTab('pendidikan')}
    onkeydown={(e) => handleKeyDown(e, 0)}
  >
    Pendidikan
  </button>
  <!-- ... other tabs -->
</div>

<div
  role="tabpanel"
  id="panel-pendidikan"
  aria-labelledby="tab-pendidikan"
  tabindex="0"
>
  <!-- Content -->
</div>

<script>
const handleKeyDown = (e, tabIndex) => {
  const tabs = document.querySelectorAll('[role="tab"]');
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      const prevIndex = (tabIndex - 1 + tabs.length) % tabs.length;
      tabs[prevIndex].focus();
      tabs[prevIndex].click();
      break;
    case 'ArrowRight':
      e.preventDefault();
      const nextIndex = (tabIndex + 1) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
      break;
    case 'Home':
      e.preventDefault();
      tabs[0].focus();
      tabs[0].click();
      break;
    case 'End':
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      tabs[tabs.length - 1].click();
      break;
  }
};
</script>
```

---

### **Task 2.3: Form Validation + Error States** (3h)
**Files:** `src/pages/kontak.astro`, `src/pages/donasi.astro`  
**WCAG Impact:** +4%  
**Priority:** 🔴 HIGH

**Requirements:**
- [ ] Client-side validation (required fields, email format, phone format)
- [ ] Error messages with `aria-describedby`
- [ ] `aria-invalid="true/false"` on invalid fields
- [ ] Error summary at top of form
- [ ] Focus management (move to first error on submit)
- [ ] Success state after submission
- [ ] Loading state during submission

**Implementation:**
```astro
<form id="contact-form" novalidate>
  <!-- Error Summary -->
  {errors.length > 0 && (
    <div 
      role="alert" 
      aria-live="assertive"
      class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
    >
      <h3 class="text-red-800 dark:text-red-300 font-semibold mb-2">
        Terdapat {errors.length} kesalahan:
      </h3>
      <ul class="list-disc list-inside text-red-700 dark:text-red-400 text-sm">
        {errors.map(err => <li>{err}</li>)}
      </ul>
    </div>
  )}

  <!-- Email Field -->
  <div class="form-group">
    <label for="email">Email *</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-invalid={errors.email ? 'true' : 'false'}
      aria-describedby={errors.email ? 'email-error' : undefined}
      class={errors.email ? 'border-red-500' : 'border-border-primary'}
    />
    {errors.email && (
      <p id="email-error" role="alert" class="text-red-600 text-sm mt-1">
        {errors.email}
      </p>
    )}
  </div>

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
  </button>
</form>

<script>
const validateForm = () => {
  const errors = {};
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  
  // Email validation
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Email tidak valid';
  }
  
  // Phone validation (Indonesian format)
  if (phone.value && !/^(\+62|08)[0-9]{8,11}$/.test(phone.value.replace(/[\s-]/g, ''))) {
    errors.phone = 'Nomor WhatsApp tidak valid (contoh: 081234567890)';
  }
  
  return errors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const errors = validateForm();
  
  if (Object.keys(errors).length > 0) {
    // Focus first error
    const firstErrorField = Object.keys(errors)[0];
    document.getElementById(firstErrorField)?.focus();
    return;
  }
  
  // Submit form...
};
</script>
```

---

### **Task 2.4: Tighten CSP Headers** (30 min)
**File:** `src/components/BaseHead.astro`  
**Security Impact:** High  
**Priority:** 🟡 MEDIUM

**Current (Too Permissive):**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src *; ...">
```

**Recommended (Strict):**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.sanity.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://cdn.sanity.io https://images.unsplash.com https://lh3.googleusercontent.com;
  font-src 'self';
  connect-src 'self' https://cdn.sanity.io https://openpanel.com;
  frame-src 'none';
  object-src 'none';
">
```

**Implementation:**
```astro
<!-- In BaseHead.astro -->
<meta 
  http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.sanity.io; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.sanity.io https://images.unsplash.com https://lh3.googleusercontent.com; font-src 'self'; connect-src 'self' https://cdn.sanity.io https://openpanel.com; frame-src 'none'; object-src 'none';"
/>
```

---

### **Task 2.5: Skeleton Loading States** (3h)
**Files:** `src/components/gallery/MasonryGrid.astro`, `src/pages/blog/index.astro`  
**UX Impact:** High  
**Priority:** 🟡 MEDIUM

**Requirements:**
- [ ] Add shimmer placeholder for images
- [ ] Add skeleton text lines for titles
- [ ] Show skeleton while data loading
- [ ] Fade transition from skeleton to content

**Implementation:**
```astro
<!-- In MasonryGrid.astro -->
{isLoading ? (
  <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div class="rounded-xl overflow-hidden bg-surface-elevated dark:bg-surface-secondary">
        <!-- Image skeleton -->
        <div class="aspect-video bg-surface-placeholder animate-shimmer" />
        <!-- Title skeleton -->
        <div class="p-4 space-y-3">
          <div class="h-4 bg-surface-placeholder animate-shimmer rounded w-3/4" />
          <div class="h-3 bg-surface-placeholder animate-shimmer rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
) : (
  <!-- Actual content -->
  <MasonryGrid photos={photos} />
)}
```

**Add shimmer animation to global.css:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface-placeholder) 25%,
    var(--color-surface-elevated) 50%,
    var(--color-surface-placeholder) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

### **Task 2.6: Standardize Sanity Error Handling** (1h)
**File:** `src/lib/sanity/client.ts`  
**Code Quality Impact:** Medium  
**Priority:** 🟡 MEDIUM

**Current (Inconsistent):**
```typescript
// Some functions return null
export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
  // ...
}

// Some return empty array
export async function getFaqList(): Promise<SanityFaq[] | null> {
  // ...
}
```

**Standardized (Consistent):**
```typescript
// Lists always return empty array
export async function getKegiatanList(): Promise<SanityKegiatan[]> {
  return cachedFetch({
    key: sanityCacheKey(kegiatanListQuery),
    fetcher: () => sanityClient.fetch(kegiatanListQuery),
  }).catch((error) => {
    console.error('Failed to fetch kegiatan list:', error);
    return []; // Consistent return type
  });
}

// Single items return null
export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
  return cachedFetch({
    key: sanityCacheKey(kegiatanItemQuery, { slug }),
    fetcher: () => sanityClient.fetch(kegiatanItemQuery, { slug }),
  }).catch((error) => {
    console.error('Failed to fetch kegiatan item:', error);
    return null; // Consistent return type
  });
}
```

---

### **Task 2.7: Mobile Menu Focus Trap** (3h)
**File:** `src/components/Navbar.astro`  
**WCAG Impact:** +3%  
**Priority:** 🔴 HIGH

**Requirements:**
- [ ] Trap focus inside mobile menu when open
- [ ] Cycle through focusable elements (Tab key)
- [ ] Close on Escape key
- [ ] Return focus to hamburger button on close

**Implementation:**
```astro
<!-- Mobile Menu -->
<div
  id="mobile-menu"
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
  class={mobileMenuOpen ? 'block' : 'hidden'}
>
  <!-- Focusable elements -->
  <a href="/" class="focusable">Beranda</a>
  <a href="/tentang" class="focusable">Tentang</a>
  <!-- ... -->
  <button id="menu-close" class="focusable">Close</button>
</div>

<script>
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('menu-close');

const focusableElements = mobileMenu.querySelectorAll('.focusable');
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

// Handle Tab key for focus trap
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  
  if (e.shiftKey) { // Shift + Tab
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else { // Tab
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});

// Handle Escape key to close
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

const closeMobileMenu = () => {
  mobileMenuOpen = false;
  hamburgerBtn?.focus(); // Return focus
};
</script>
```

---

## ✅ **ACCEPTANCE CRITERIA**

### **Phase 2 Complete When:**
- [ ] All 7 tasks completed
- [ ] WCAG compliance score ≥ 90%
- [ ] All forms have proper validation
- [ ] All interactive elements keyboard-accessible
- [ ] Build passes without errors
- [ ] No new LSP errors introduced
- [ ] Front-end checklist audit passes

---

## 📈 **EXPECTED IMPACT**

| Metric | Current | Target | Change |
|--------|---------|--------|--------|
| **WCAG Compliance** | 75% | 90% | +15% |
| **Build Time** | 23s | < 25s | Maintained |
| **Accessibility Issues** | 12 | ≤ 3 | -75% |
| **Form Errors** | 0% validation | 100% validated | +100% |
| **Keyboard Navigation** | 60% | 95% | +35% |

---

## 🎯 **NEXT ACTION**

**Start with Task 2.1: Navbar ARIA Labels** (highest impact, quickest win)

**Estimated Completion:** 24 Juni 2026  
**Risk Level:** Low (all changes are additive, no breaking changes)

---

**Status:** 🟢 **READY TO EXECUTE**