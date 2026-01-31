# NeuroBank Dashboard Design Concepts

## Selected Approach: Premium Dark Banking Interface

**Design Movement:** Modern Financial Minimalism with AI-Forward Aesthetics

**Core Principles:**
1. **Data Clarity Through Hierarchy** - Complex financial information distilled into scannable, actionable insights
2. **Conversational AI Integration** - Natural language interface for financial planning, not just dashboards
3. **Glassmorphic Depth** - Layered cards with subtle transparency and backdrop blur to create visual hierarchy
4. **Accessibility First** - High contrast, clear typography, keyboard navigation throughout

**Color Philosophy:**
- **Primary Palette:** Deep Navy (#050610, #131C58) as the foundation, representing trust and stability
- **Accent Colors:** Vibrant Electric Blue (#0D17E7) for interactive elements and CTAs, creating energy without aggression
- **Supporting Tones:** Soft Gray-Blue (#B2B5CA, #646BA2) for secondary information, maintaining visual harmony
- **Reasoning:** Dark theme reduces eye strain during extended financial analysis, while electric blue accents guide attention to actionable elements. The palette conveys both security and innovation.

**Layout Paradigm:**
- **Sidebar Navigation** - Persistent left sidebar with icon + label navigation for quick access to core features
- **Dashboard Grid** - Asymmetric card layout (not uniform grid) with varying sizes to emphasize key metrics
- **Responsive Sections** - Stacked on mobile, multi-column on desktop with intelligent reflow
- **Floating Elements** - AI assistant and action buttons float contextually, never blocking content

**Signature Elements:**
1. **Gradient Line Charts** - Soft gradient fills under financial data lines (blue to transparent), creating visual depth
2. **Rounded Card Containers** - Consistent 12-16px border radius across all cards, with subtle border and shadow
3. **AI Insight Badges** - Distinctive blue badges highlighting AI-generated insights and recommendations

**Interaction Philosophy:**
- **Micro-interactions** - Smooth transitions on hover, subtle scale changes on interactive elements
- **Contextual Feedback** - Toast notifications for actions, inline validation for forms
- **Progressive Disclosure** - Show summary by default, expand for details without page navigation
- **Keyboard-First** - All interactive elements accessible via keyboard, clear focus states

**Animation Guidelines:**
- **Entrance Animations** - Staggered fade-in for cards on page load (100-150ms stagger)
- **Hover States** - Subtle lift effect (2-4px shadow increase) and slight scale (1.02x) on cards
- **Loading States** - Skeleton loaders with gradient shimmer for data-heavy sections
- **Transitions** - 200-300ms cubic-bezier(0.4, 0, 0.2, 1) for smooth, natural motion

**Typography System:**
- **Display Font** - Geist Sans (system font) for headings, weight 700-800, tracking -0.02em
- **Body Font** - Geist Sans (system font) for body text, weight 400-500, line-height 1.5
- **Hierarchy:**
  - H1: 28px, weight 700 (page titles)
  - H2: 20px, weight 600 (section headers)
  - H3: 16px, weight 600 (card titles)
  - Body: 14px, weight 400 (default text)
  - Small: 12px, weight 400 (metadata, labels)
  - Mono: 13px (transaction IDs, amounts)

**Component Styling:**
- **Buttons** - Rounded corners (8px), full-width on mobile, icon + text combinations
- **Inputs** - Subtle border, focus ring in accent color, placeholder text in muted color
- **Cards** - Consistent padding (20px), border (1px solid rgba(255,255,255,0.1)), shadow (0 8px 32px rgba(0,0,0,0.1))
- **Charts** - Recharts library with custom theme matching palette, no gridlines (clean look)
