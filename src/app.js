import { navigateTo } from "./route.js";

// expõe globalmente para onclick inline funcionar
window.navigate = navigateTo;

// inicia na home
navigateTo("home");
