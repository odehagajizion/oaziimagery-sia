// One place for site-wide settings and the page list.

export const SITE = {
  name: 'OAZI IMAGERY',
  url: 'https://www.oaziimagery.org',
  // SIA, the signed-in client and team system. Not live yet: this link
  // will not work until app.oaziimagery.org is set up.
  signInUrl: 'https://app.oaziimagery.org',
  ogImage: '/img/img023.jpg',
};

// `component` is the file in src/components; `interactive` pages ship the
// renderer to the browser so their tabs, toggles and forms work.
export const PAGES = [
  { component: 'Website', path: '/', interactive: false,
    title: 'OAZI IMAGERY · Your story. Our strategy. Shared impact.',
    description: 'OAZI IMAGERY helps organisations across Nigeria and beyond communicate their value, document their impact and influence the audiences that matter.' },
  { component: 'About', path: '/about/', interactive: true,
    title: 'About OAZI IMAGERY',
    description: 'A strategic visual communications company founded in Benue State and based in Abuja. Partners, not vendors: led by the founder on every project.' },
  { component: 'Services', path: '/services/', interactive: true,
    title: 'Services · OAZI IMAGERY',
    description: 'Communications strategy and consultation, strategic advisory, and creative production and campaign delivery, with a documented impact report.' },
  { component: 'Work', path: '/work/', interactive: true,
    title: 'Work · OAZI IMAGERY',
    description: 'Documentaries, health outreach stories and portrait series made with NGOs and communities across Nigeria.' },
  { component: 'Sectors', path: '/sectors/', interactive: true,
    title: 'Sectors · OAZI IMAGERY',
    description: 'Communications for NGOs and development, government and the public sector, corporate and ESG, and media and entertainment.' },
  { component: 'Process', path: '/process/', interactive: true,
    title: 'Process · OAZI IMAGERY',
    description: 'From brief to impact in four steps: discover, strategise, create and deliver, then measure and improve.' },
  { component: 'Contact', path: '/contact/', interactive: true,
    title: 'Contact · OAZI IMAGERY',
    description: 'Tell us your story and book a free 30-minute discovery call. Every enquiry gets a personal reply within 48 hours.' },
  { component: 'Privacy', path: '/privacy/', interactive: false,
    title: 'Privacy notice · OAZI IMAGERY',
    description: 'What personal information OAZI IMAGERY collects through this website, why, and your rights under the Nigeria Data Protection Act 2023.' },
  { component: 'NotFound', path: '/404.html', interactive: false, sitemap: false,
    title: 'Page not found · OAZI IMAGERY',
    description: 'This page could not be found.' },
];

// Links in the design files point at "<Name>.dc.html"; map them to real URLs.
export const ROUTES = Object.fromEntries(
  PAGES.filter((p) => p.component !== 'NotFound').map((p) => [`${p.component}.dc.html`, p.path]),
);
