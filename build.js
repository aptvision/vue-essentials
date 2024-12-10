const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./prod/modules/index.js'], // Plik wejściowy
  bundle: true, // Zbierz wszystko w jeden plik
  outfile: './prod/modules/bundle.js', // Plik wynikowy
  format: 'iife', // Format dla przeglądarki (Immediately Invoked Function Expression)
  globalName: 'Helpers', // Nazwa globalnego obiektu w przeglądarce
  target: 'es2015', // Wsparcie dla starszych przeglądarek
  minify: true, // Minimalizacja kodu
  sourcemap: true, // Dodanie mapy źródłowej (opcjonalnie)
}).then(() => {
  console.log('Build completed!');
}).catch(() => process.exit(1));
