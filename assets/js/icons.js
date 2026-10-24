// Small stroke icon set (stand-ins for the Figma icon components).
const ICON_PATHS = {
  'users': "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'/>",
  'bed': "<path d='M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9'/>",
  'walk': "<circle cx='13' cy='4' r='2'/><path d='M7 21l3-6 3 2v5M10 15l-1-5 4-2 3 4h3M9 10l-3 3'/>",
  'calendar': "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>",
  'calendar-check': "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4'/>",
  'check-circle': "<circle cx='12' cy='12' r='9'/><path d='M8 12l3 3 5-6'/>",
  'clock': "<circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/>",
  'x-circle': "<circle cx='12' cy='12' r='9'/><path d='M15 9l-6 6M9 9l6 6'/>",
  'person-circle': "<circle cx='12' cy='12' r='9'/><circle cx='12' cy='9' r='2'/><path d='M8 18c0-3 8-3 8 0'/>",
  'search': "<circle cx='11' cy='11' r='7'/><path d='M21 21l-4.3-4.3'/>",
  'chevron': "<path d='M6 9l6 6 6-6'/>",
  'plus': "<path d='M12 5v14M5 12h14'/>",
  'edit': "<path d='M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'/>",
  'more': "<circle cx='12' cy='5' r='1'/><circle cx='12' cy='12' r='1'/><circle cx='12' cy='19' r='1'/>",
  'arrow': "<path d='M5 12h14M13 6l6 6-6 6'/>",
  'bell': "<path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0'/>",
  'exit': "<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'/>",
  'grid': "<path d='M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z' fill='currentColor'/>",
  'clipboard-plus': "<rect x='5' y='3' width='14' height='18' rx='2'/><path d='M12 8v6M9 11h6'/>",
  'bag': "<rect x='3' y='7' width='18' height='13' rx='2'/><path d='M9 7V4h6v3M12 11v5M9.5 13.5h5'/>",
  'heart': "<path d='M20.8 5.6a5 5 0 0 0-7-.1L12 7.3l-1.8-1.8a5 5 0 0 0-7 7L12 21l8.8-8.4a5 5 0 0 0 0-7z' fill='currentColor'/>",
  'pill': "<path d='M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7zM8.5 8.5l7 7'/>",
  'id': "<rect x='3' y='4' width='18' height='16' rx='2'/><circle cx='12' cy='10' r='3'/><path d='M7 18c1-3 9-3 10 0'/>",
  'peso': "<text x='12' y='18' text-anchor='middle' font-size='18' font-weight='700' fill='currentColor' stroke='none' font-family='Inter'>\u20b1</text>",
  'branches': "<circle cx='12' cy='5' r='2'/><circle cx='5' cy='19' r='2'/><circle cx='19' cy='19' r='2'/><path d='M12 7v5M5 17v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3'/>",
  'receipt': "<path d='M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM8 8h8M8 12h8'/>"
};
function svg(name, size = 20, extra = '') {
  return "<svg width='" + size + "' height='" + size + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' " + extra + '>' + (ICON_PATHS[name] || '') + '</svg>';
}
