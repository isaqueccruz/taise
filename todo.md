# Taise Sena Confeitaria - Project TODO

## Database & Backend
- [x] Products table (id, name, description, price, imageUrl, categoryId, featured, available, servings, ingredients, createdAt)
- [x] Categories table (id, name, slug, description)
- [x] Contact messages table (id, name, email, phone, subject, message, productId, read, createdAt)
- [x] tRPC router: products (list, getById, getFeatured, create, update, delete, uploadImage)
- [x] tRPC router: categories (list, create, update, delete)
- [x] tRPC router: contact (submit form + owner notification, listMessages, markRead, deleteMessage, unreadCount)
- [x] Image upload endpoint with S3 storage
- [x] Admin-only procedures with role guard (adminProcedure)

## Public Pages
- [x] Homepage with hero section, featured products, about teaser, CTA
- [x] Product catalog page with grid layout, category filter, search
- [x] Product detail page with full info, WhatsApp order button
- [x] About page with story, values, team
- [x] Contact page with inquiry form

## Admin Panel
- [x] Admin login page (OAuth-based via DashboardLayout)
- [x] Admin dashboard overview (stats: total products, categories, messages, unread)
- [x] Product list management (grid with edit/delete)
- [x] Product create/edit form with image upload (file + URL)
- [x] Category management (create, edit, delete)
- [x] Contact messages inbox view (read/unread, reply by email/WhatsApp, delete)

## UI/UX
- [x] Global theme: elegant rose-gold/cream palette, Playfair Display + Lato fonts
- [x] Responsive navbar with logo and navigation links
- [x] Elegant footer with social links and contact info
- [x] WhatsApp floating button on all pages
- [x] Smooth animations and transitions (framer-motion)
- [x] Mobile-first responsive design
- [x] Loading skeletons and empty states
- [x] Toast notifications for form submissions
- [x] Dark sidebar admin panel (cocoa theme)

## Integration
- [x] S3 image upload for product photos
- [x] Owner notification on contact form submission
- [x] WhatsApp deep link integration

## Testing
- [x] Vitest tests for product CRUD procedures (9 tests passing)
- [x] Vitest tests for contact form submission
- [x] Vitest tests for category procedures
- [x] Vitest tests for auth.logout

## Seed Data
- [x] 5 sample categories seeded
- [x] 6 sample products seeded with real images


## Bug Fixes
- [x] Fix 404 error on add products page (/admin/produtos/novo)
- [x] Update WhatsApp number to 71988461789
- [x] Update email to isaquec946@gmail.com
- [x] Prepare for Vercel deployment (vercel.json, .vercelignore)
