import { renderToStaticMarkup } from 'react-dom/server';
import { FolderShowcase } from '../src/folder-entry.jsx';

const markup = renderToStaticMarkup(<FolderShowcase />);
for (const label of ['Kopp', 'FC Spes', 'E[S]1', 'E[S]2', 'amapp', 'HydeTech']) {
  if (!markup.includes(`aria-label="${label} folder"`)) {
    throw new Error(`${label} failed to render`);
  }
}
if ((markup.match(/class="folder-root"/g) || []).length !== 6) throw new Error('Expected exactly six folders');
if ((markup.match(/--folder-w:291\.2px/g) || []).length !== 6) {
  throw new Error('All folders must use size 1.3');
}
// The original component resolves CSS colors through canvas in the browser, not during SSR.
console.log('All six named folders render at size 1.3. Verify resolved colors in the browser.');
