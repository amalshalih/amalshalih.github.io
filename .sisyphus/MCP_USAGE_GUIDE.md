# 🤖 Front-End Checklist MCP Usage Guide

**Server:** `https://mcp.frontendchecklist.io`  
**Status:** ✅ Configured in `.opencode/mcp.json`  
**Total Rules:** 385 across 11 categories

---

## 🔧 Configuration

**File:** `.opencode/mcp.json`

```json
{
  "mcpServers": {
    "frontend-checklist": {
      "url": "https://mcp.frontendchecklist.io",
      "enabled": true,
      "tools": [
        "review_code",
        "audit_url",
        "search_rules",
        "get_rule",
        "get_workflow",
        "get_checklist_rules"
      ]
    }
  }
}
```

---

## 📚 Available Tools

### 1. `review_code` - Code Review

**Use:** Review pasted code against checklist

**Example:**
```
Use Front-End Checklist MCP to review this React component:

```jsx
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}
```

Report issues by priority (Critical, High, Medium, Low).
```

**Expected Output:**
- Missing accessibility attributes
- Missing type attribute
- Missing focus styles
- Recommendations with code examples

---

### 2. `audit_url` - URL Audit

**Use:** Audit live public URL

**Example:**
```
Use Front-End Checklist MCP to audit https://amalshalih.or.id

Focus on:
- Accessibility (WCAG AA)
- Performance (Core Web Vitals)
- SEO (meta tags, structured data)
- Security (HTTPS, CSP, headers)

Return findings grouped by priority.
```

**Expected Output:**
- List of violations by category
- Priority scores
- Remediation steps
- Verification methods

---

### 3. `search_rules` - Search Rules

**Use:** Search by keyword, category, or priority

**Example:**
```
Use Front-End Checklist MCP to search for rules about:
- Category: "accessibility"
- Priority: "high"
- Keyword: "focus"

Return matching rules with descriptions.
```

**Expected Output:**
- List of matching rules
- Rule IDs and slugs
- Priority levels
- Links to full documentation

---

### 4. `get_rule` - Get Specific Rule

**Use:** Get detailed information about a specific rule

**Example:**
```
Use Front-End Checklist MCP to get details about rule:
- Slug: "meta-description"
- Or ID: "en-meta-description"

Include:
- Description
- Why it matters
- How to implement
- How to verify
- Code examples
```

**Expected Output:**
- Full rule documentation
- Implementation guide
- Before/after examples
- Verification checklist

---

### 5. `get_workflow` - Get Audit Workflow

**Use:** Get step-by-step audit workflow

**Example:**
```
Use Front-End Checklist MCP to get workflow for:
- Type: "accessibility-audit"
- Or: "performance-audit"
- Or: "seo-audit"

Return step-by-step process.
```

**Expected Output:**
- Pre-audit checklist
- Tools needed
- Step-by-step process
- Post-audit actions
- Reporting template

---

### 6. `get_checklist_rules` - Get Category Checklist

**Use:** Get all rules for a specific category

**Example:**
```
Use Front-End Checklist MCP to get checklist for:
- Category: "html"
- Or: "css"
- Or: "accessibility"
- Or: "seo"

Return all rules in that category with priority.
```

**Expected Output:**
- Complete checklist for category
- Priority for each rule
- Status (Critical/High/Medium/Low)
- Rule slugs for detailed lookup

---

### 7. `list_categories` - List Categories

**Use:** List all 11 categories

**Example:**
```
Use Front-End Checklist MCP to list all categories.
```

**Expected Output:**
- HTML (25 rules)
- CSS (32 rules)
- JavaScript (26 rules)
- Performance (43 rules)
- Accessibility (95 rules)
- SEO (94 rules)
- Security (22 rules)
- Images (25 rules)
- Testing (13 rules)
- Privacy (5 rules)
- Internationalization (5 rules)

---

### 8. `list_priorities` - List Priority Levels

**Use:** List priority levels and their meanings

**Example:**
```
Use Front-End Checklist MCP to list priority levels.
```

**Expected Output:**
- 🔴 Critical - Site-breaking, compliance, security
- 🟠 High - Major UX, performance, accessibility
- 🟡 Medium - Strong best practices
- 🟢 Low - Situational improvements

---

### 9. `get_rule_examples` - Get Code Examples

**Use:** Get code examples for a rule

**Example:**
```
Use Front-End Checklist MCP to get examples for:
- Rule: "subresource-integrity"

Show:
- Bad examples (what not to do)
- Good examples (correct implementation)
- Tools to generate SRI hashes
```

---

### 10. `get_remediation_steps` - Get Fix Steps

**Use:** Get step-by-step remediation

**Example:**
```
Use Front-End Checklist MCP to get remediation for:
- Rule: "missing-alt-text"

Return:
- Step-by-step fix guide
- Code examples
- Testing instructions
```

---

### 11. `get_verification_steps` - Get Verification

**Use:** Get verification/testing steps

**Example:**
```
Use Front-End Checklist MCP to get verification for:
- Rule: "meta-description"

Return:
- How to verify implementation
- Tools to use
- Manual testing steps
- Automated testing options
```

---

## 🎯 Recommended Workflows

### Workflow 1: New Component Review

```
1. Write component code
2. Use: review_code with Front-End Checklist MCP
3. Fix reported issues by priority
4. Re-review until clean
5. Commit code
```

### Workflow 2: Page Audit

```
1. Deploy page to staging
2. Use: audit_url with Front-End Checklist MCP
3. Review findings by category
4. Create fix tickets for Critical/High issues
5. Implement fixes
6. Re-audit
7. Deploy to production
```

### Workflow 3: Category Deep Dive

```
1. Use: get_checklist_rules for category (e.g., "accessibility")
2. Review all 95 rules
3. Audit current implementation against each rule
4. Create improvement plan
5. Implement by priority
6. Verify with: get_verification_steps
```

### Workflow 4: Learning Specific Rule

```
1. Use: search_rules for topic (e.g., "canonical")
2. Use: get_rule for specific rule
3. Use: get_rule_examples for code samples
4. Use: get_remediation_steps for fix guide
5. Implement and test
```

---

## 📋 Example Prompts

### Quick Audits
```
"Audit https://amalshalih.or.id for accessibility issues"
"Review this HTML for SEO best practices"
"Check this CSS for performance issues"
```

### Specific Rules
```
"What are the Critical priority HTML rules?"
"Show me all High priority accessibility rules"
"Explain the canonical URL rule with examples"
```

### Implementation Help
```
"How do I implement SRI for external scripts?"
"Show me how to add structured data for Organization"
"What's the best way to lazy load images?"
```

### Verification
```
"How do I verify my meta descriptions are correct?"
"What tools can test my accessibility implementation?"
"How do I measure Core Web Vitals?"
```

---

## 🔗 Integration with Our Workflow

### During Development
```typescript
// Before committing code
task(description="Review component", prompt="Use Front-End Checklist MCP to review src/components/Button.astro")
```

### During QA
```typescript
// Before deployment
task(description="Audit staging", prompt="Use Front-End Checklist MCP to audit https://staging.amalshalih.or.id")
```

### During Sprint Planning
```typescript
// Identify improvements
task(description="Accessibility audit", prompt="Use Front-End Checklist MCP to get all High priority accessibility rules and audit our implementation")
```

---

## 📊 Tracking Progress

**Create a spreadsheet or Notion page with:**

| Category | Total Rules | Implemented | % Complete | Priority Focus |
|----------|-------------|-------------|------------|----------------|
| HTML | 25 | 20 | 80% | Critical SRI |
| CSS | 32 | 27 | 85% | Print stylesheet |
| Accessibility | 95 | 67 | 70% | Form validation |
| SEO | 94 | 80 | 85% | LocalBusiness schema |
| Security | 22 | 15 | 70% | CSP headers |

**Update after each audit cycle.**

---

## 🚀 Next Steps

1. ✅ MCP configured in `.opencode/mcp.json`
2. ⏳ Test with first audit (recommend: `audit_url` for homepage)
3. ⏳ Create baseline report
4. ⏳ Prioritize fixes
5. ⏳ Implement Critical/High priority items
6. ⏳ Re-audit monthly

---

**Created:** 10 Juni 2026  
**Last Updated:** 10 Juni 2026  
**Owner:** PT Koneksi Jaringan Indonesia
