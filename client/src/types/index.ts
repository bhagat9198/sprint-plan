export interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  stats: string[];
  benefits: string[];
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface NavLink {
  title: string;
  path: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

export interface AnimationConfig {
  initial: Record<string, number>;
  animate: Record<string, number>;
  transition: {
    duration: number;
    delay?: number;
    ease?: string[];
  };
}

export interface Stats {
  icon: JSX.Element;
  stat: string;
  label: string;
}