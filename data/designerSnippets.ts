export interface DesignerSnippet {
  id: string;
  projectName: string; // t.ex. "Mobile Navigation Bar"
  image: string; // thumbnail/preview
  category: string; // Header, Hero, Modal, Banner, etc.
  platform: string; // Web, Mobile, iOS, Android
  brand: string; // Filippa K, POC, Rixo, etc.
  author: string;
  description: string;
  figmaLink?: string;
  createdAt: string;
}

export const designerSnippets: DesignerSnippet[] = [
  {
    id: "1",
    projectName: "Navigation Design System",
    image: "/assets/img_nav_design.png",
    category: "Header",
    platform: "Mobile",
    brand: "Filippa K",
    author: "Sarah Chen",
    description:
      "Comprehensive navigation design system with consistent spacing, typography, and interaction patterns. Features mobile-first approach with accessibility considerations.",
    figmaLink: "https://figma.com/file/nav-design-system-filippa-k",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    projectName: "Modal Design Patterns",
    image: "/assets/img_modal_design.png",
    category: "Modal",
    platform: "Web",
    brand: "POC",
    author: "Emma Wilson",
    description:
      "Versatile modal design patterns with different sizes, animations, and overlay treatments. Includes accessibility guidelines and responsive behavior.",
    figmaLink: "https://figma.com/file/modal-design-patterns-poc",
    createdAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "3",
    projectName: "Category Navigation Design",
    image: "/assets/img_category_design.png",
    category: "Navigation",
    platform: "Web",
    brand: "Humans Since 1982",
    author: "Alex Kim",
    description:
      "Intuitive category navigation with clear visual hierarchy and filtering options. Designed for easy browsing and quick content discovery.",
    figmaLink: "https://figma.com/file/category-nav-hs1982",
    createdAt: "2024-01-25T09:15:00Z",
  },
  {
    id: "4",
    projectName: "Product Card Design",
    image: "/assets/img_productcard_design.png",
    category: "Card",
    platform: "Web",
    brand: "Rixo",
    author: "Lisa Zhang",
    description:
      "Elegant product card design with hover effects, image optimization, and clear pricing display. Optimized for e-commerce conversion.",
    figmaLink: "https://figma.com/file/product-card-design-rixo",
    createdAt: "2024-02-01T16:20:00Z",
  },
  {
    id: "5",
    projectName: "Grid Layout System",
    image: "/assets/img_grid_design.png",
    category: "Layout",
    platform: "Web",
    brand: "Sweed beauty",
    author: "David Park",
    description:
      "Flexible grid layout system with responsive breakpoints and consistent spacing. Perfect for showcasing content in organized, visually appealing arrangements.",
    figmaLink: "https://figma.com/file/grid-layout-sweed",
    createdAt: "2024-02-05T11:30:00Z",
  },
  {
    id: "6",
    projectName: "Footer Design Component",
    image: "/assets/img_footer_design.png",
    category: "Footer",
    platform: "Web",
    brand: "Filippa K",
    author: "Sarah Chen",
    description:
      "Comprehensive footer design with organized link sections, social media integration, and brand elements. Clean and functional layout for better user experience.",
    figmaLink: "https://figma.com/file/footer-design-filippa-k",
    createdAt: "2024-02-10T13:45:00Z",
  },
];
