import './styles.css';
import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderHero } from './components/hero.js';
import { renderPrinciples } from './components/principles.js';
import { renderCurriculum, initCurriculum } from './components/curriculum.js';
import { renderInferenceDemo, initInferenceDemo } from './components/inferenceDemo.js';
import { renderArchitecture } from './components/architecture.js';
import { renderCTA, renderFooter } from './components/cta.js';

const app = document.getElementById('app');

app.innerHTML = [
  renderNavbar(),
  '<main>',
  renderHero(),
  renderPrinciples(),
  renderCurriculum(),
  renderInferenceDemo(),
  renderArchitecture(),
  renderCTA(),
  '</main>',
  renderFooter(),
].join('');

initNavbar();
initCurriculum();
initInferenceDemo();
