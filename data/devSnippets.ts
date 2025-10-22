export interface DevSnippet {
  id: string;
  projectName: string;
  image: string;
  framework: string;
  frameworkVersion: string;
  category: string;
  platform: string;
  author: string;
  description: string;
  codeLink: string;
  brand: string;
  createdAt: string;
}

export const devSnippets: DevSnippet[] = [
  {
    id: "1",
    projectName: "Mobile Navigation Bar",
    image: "/assets/img_nav_bar.png",
    framework: "React",
    frameworkVersion: "18.2.0",
    category: "Header",
    platform: "Mobile",
    author: "Sarah Chen",
    description: "Responsive mobile navigation with hamburger menu and smooth animations",
    codeLink: "https://github.com/sarahc/mobile-nav",
    brand: "Filippa K",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    projectName: "Hero Component",
    image: "/assets/img_hero_image.png",
    framework: "Vue",
    frameworkVersion: "3.3.0",
    category: "Hero",
    platform: "Web",
    author: "Mike Rodriguez",
    description: "Animated hero banner with call-to-action buttons and gradient backgrounds",
    codeLink: "https://github.com/miker/hero-banner",
    brand: "Filippa K",
    createdAt: "2024-01-20T14:45:00Z"
  },
  {
    id: "3",
    projectName: "Country Selector",
    image: "/assets/img_country_selector.png",
    framework: "React",
    frameworkVersion: "18.2.0",
    category: "Modal",
    platform: "Web",
    author: "Alex Kim",
    description: "Searchable country dropdown with flags and keyboard navigation",
    codeLink: "https://github.com/alexk/country-selector",
    brand: "Humans Since 1982",
    createdAt: "2024-01-25T09:15:00Z"
  },
  {
    id: "4",
    projectName: "Become a Member",
    image: "/assets/img_become_a_member_popup.png",
    framework: "React",
    frameworkVersion: "18.2.0",
    category: "Modal",
    platform: "Web",
    author: "Emma Wilson",
    description: "Interactive membership signup component with form validation and user onboarding",
    codeLink: "https://github.com/emmaw/become-a-member",
    brand: "POC",
    createdAt: "2024-02-01T16:20:00Z"
  },
  {
    id: "5",
    projectName: "Newsletter Popup",
    image: "/assets/img_newsletter_popup.png",
    framework: "Vue",
    frameworkVersion: "3.4.0",
    category: "Modal",
    platform: "Web",
    author: "David Park",
    description: "Newsletter subscription popup with email validation and subscription management",
    codeLink: "https://github.com/davidp/newsletter-popup",
    brand: "Sweed beauty",
    createdAt: "2024-02-05T11:30:00Z"
  },
  {
    id: "6",
    projectName: "Top Banner",
    image: "/assets/img_topbanner.png",
    framework: "React Native",
    frameworkVersion: "0.72.0",
    category: "Banner",
    platform: "Web",
    author: "Lisa Zhang",
    description: "Promotional top banner with call-to-action and dismiss functionality",
    codeLink: "https://github.com/lisaz/top-banner",
    brand: "Rixo",
    createdAt: "2024-02-10T13:45:00Z"
  },
];
