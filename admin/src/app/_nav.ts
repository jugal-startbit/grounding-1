export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: any;
  title?: boolean;
  children?: any;
  variant?: string;
  attributes?: object;
  divider?: boolean;
  class?: string;
}
export interface DeoData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: any;
  title?: boolean;
  children?: any;
  variant?: string;
  attributes?: object;
  divider?: boolean;
  class?: string;
}

export interface ManagerData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: any;
  title?: boolean;
  children?: any;
  variant?: string;
  attributes?: object;
  divider?: boolean;
  class?: string;
}

export const navItems: NavData[] = [
  /*{
    name: 'Dashboard',
    url: '/dashboardEvent',
    icon: 'icon-settings',

  },{
    name: 'Login Event',
    url: '/loginEvent',
    icon: 'icon-energy',
  },{
    name: 'Logout Event',
    url: '/logoutEvent',
    icon: 'icon-speedometer',
  },*/{
    name: 'Analytics',
    url: '/aboutusEvent',
    icon: 'icon-globe',
  },/*{
    name: 'Contact',
    url: '/contactusEvent',
    icon: 'icon-support',
  },{
    name: 'Read about Grounding',
    url: '/aboutgroundinglogEvent',
    icon: 'icon-note',
  },{
    name: 'PDF',
    url: '/pdfEvent',
    icon: 'icon-pencil',
  },*/{
    name: 'Reviews',
    url: '/review',
    icon: 'icon-people',
  },

];
