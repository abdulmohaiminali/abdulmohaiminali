import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Folder from './Folder.jsx';
const items = [
  { title: 'Brand guidelines' },
  { title: 'Launch plan' },
  { image: '/photos/pier.jpg', title: 'The pier' }
];
const koppItems = [
  { image: './assets/projects/kopp/social-posts.png', title: 'Kopp social media', alt: 'Kopp social media posts collage' },
  { image: './assets/projects/kopp/company-logo.png', title: 'Kopp company logo', alt: 'Kopp company logo presentation' },
  { image: './assets/projects/kopp/company-ledger.png', title: 'Kopp company ledger', alt: 'Kopp company ledger interface' }
];
const settings = {
  mode: 'flap', variant: 'solid', layout: 'spread', color: '#00bf63',
  paperColor: '#ffffff', tabPosition: 'center', openOn: 'click', size: 1.3,
  frost: 0.25, tilt: 0.5, speed: 1, bounce: 0.4, peek: true,
  intro: true, draggable: true, zoomOnClick: true, theme: 'dark'
};
const folders = ['Kopp', 'FC Spes', 'E[S]1', 'E[S]2', 'amapp', 'HydeTech'];
export function FolderShowcase() {
 useEffect(() => {
  document.getElementById('folder-react-root')?.setAttribute('data-ready', 'true');
 }, []);
 return <div className="folder-grid">
  {folders.map(label => <div className={`folder-cell${label === 'Kopp' ? ' folder-cell-kopp' : ''}`} key={label}>
    <Folder {...settings} label={label} items={label === 'Kopp' ? koppItems : items} />
  </div>)}
 </div>;
}
const mount = typeof document !== 'undefined' ? document.getElementById('folder-animation-root') : null;
if (mount) createRoot(mount).render(<FolderShowcase />);
