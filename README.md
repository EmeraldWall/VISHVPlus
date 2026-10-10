Official repo of VISHVPlus.
The VISHVPlus website is live at: https://emeraldwall.github.io/VISHVPlus/

## Editing styles or scripts

Pages load the minified files `assets/style.min.css` and `assets/main.min.js`.
After editing `assets/style.css` or `assets/main.js`, regenerate them and bump
the `?v=` value in each page so browsers fetch the new version:

```
npx esbuild assets/style.css --minify --target=chrome109,firefox115 --outfile=assets/style.min.css
npx esbuild assets/main.js --minify --target=chrome109,firefox115 --outfile=assets/main.min.js
```

Fonts are self-hosted in `assets/fonts` under the SIL Open Font License (see `assets/fonts/LICENSE.txt`).
