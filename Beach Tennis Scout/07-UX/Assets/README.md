# Beach Tennis Scout — Assets Gráficos

> **Origem:** todos os ativos desta pasta derivam do logo oficial localizado em
> `07-UX/135ab4e5-ef73-4307-824c-43d7dccbc7f7.png` — o mesmo personagem visual
> (palmeira + bola + wordmark "BEACH TENNIS SCOUT") já usado em produção como
> `apps/web/public/logo-palm.webp`, `logo-wordmark.webp` e `logo-ball.webp`.
>
> **Nada foi redesenhado.** O arquivo original é uma composição (sticker) sobre
> uma foto de praia desfocada, usada apenas como moldura de apresentação. Para
> gerar os PNGs transparentes desta pasta, o fundo fotográfico foi removido
> (recorte/matte) preservando exatamente os pixels, cores, traços e tipografia
> do sticker original — nenhuma forma, cor ou letra foi alterada, redesenhada
> ou recriada. Onde o formato de destino exige fundo sólido (ex.: ícone de
> App Store, apple-touch-icon, maskable icon), o logo foi apenas composto sobre
> a cor de fundo "Areia Clara" do Design System (`#F6F3EE` / `#F8F5EF`,
> ver [[12-Design-System/01-Colors]]) — sem qualquer alteração da ilustração.
>
> **SVG e PDF:** como a arte original é uma ilustração raster (não vetorial,
> com textura/sombreado pintado), os arquivos `.svg` desta pasta são o PNG
> embutido em base64 dentro de um wrapper SVG (preserva os pixels exatamente,
> sem vetorização/recriação de formas). O `.pdf` é o mesmo PNG em uma página
> única, fundo branco.
>
> **Resolução-fonte:** o arquivo oficial em `07-UX` tem 1408×768px; a área do
> sticker recortada é 450×539px. Não existe um arquivo-fonte de resolução
> maior no projeto. A versão "4x" (`logo-principal@4x.png`, 1800×2156px) é uma
> ampliação por interpolação Lanczos de alta qualidade a partir desse mesmo
> recorte — não adiciona detalhe novo, apenas oferece um arquivo maior para
> impressão/telas de alta densidade quando a resolução original não bastar.

---

## 1. Logo-Principal/

Logo completo (palmeira + bola + wordmark "Beach Tennis Scout"), exatamente
como está no arquivo oficial, apenas sem o fundo de praia.

| Arquivo | Resolução | Formato | Uso |
|---|---|---|---|
| `logo-principal-original.png` | 450×539px | PNG transparente | Uso geral, documentos, apresentações |
| `logo-principal@4x.png` | 1800×2156px | PNG transparente | Telas de alta densidade / impressão, quando 450×539 for pequeno demais |
| `logo-principal.svg` | 450×539 (viewBox) | SVG (PNG embutido) | Web, quando é preciso um único arquivo escalável sem gerenciar múltiplos PNGs |
| `logo-principal.pdf` | 450×539, fundo branco | PDF | Materiais impressos, documentos institucionais |

---

## 2. Logo-Reduzido/

Versão simplificada — apenas **palmeira + bola**, sem o texto — usada onde o
espaço é pequeno demais para o wordmark ser legível (ícones, favicons,
notificações).

| Arquivo | Resolução | Formato | Uso |
|---|---|---|---|
| `logo-reduzido.png` | 450×237px | PNG transparente | Base para recortes/composições |
| `logo-reduzido-quadrado.png` | 558×558px | PNG transparente | Base quadrada centralizada — usada para gerar todos os ícones (Favicon, PWA, Android, iOS) |
| `logo-reduzido.svg` | 450×237 (viewBox) | SVG (PNG embutido) | Web, favicon vetorial (`<link rel="icon" type="image/svg+xml">`) |

---

## 3. Favicon/

Gerado a partir do Logo Reduzido. Fundo transparente.

| Arquivo | Tamanho | Uso |
|---|---|---|
| `favicon.ico` | multi-resolução (16/32/48/64/128/256) | `<link rel="icon" href="/favicon.ico">` — compatibilidade universal com navegadores |
| `favicon-16x16.png` | 16×16 | Aba do navegador (densidade padrão) |
| `favicon-32x32.png` | 32×32 | Aba do navegador (retina) |
| `favicon-48x48.png` | 48×48 | Atalhos do Windows |
| `favicon-64x64.png` | 64×64 | Atalhos de área de trabalho |
| `favicon-128x128.png` | 128×128 | Chrome Web Store / extensões |
| `favicon-256x256.png` | 256×256 | Uso geral em alta resolução |

---

## 4. PWA/

Ícones para o manifest do Progressive Web App (`manifest.json`). Gerados a
partir do Logo Reduzido.

| Arquivo | Tamanho | Fundo | Uso |
|---|---|---|---|
| `icon-192.png` | 192×192 | Transparente | `manifest.json` → `icons` (purpose "any") |
| `icon-512.png` | 512×512 | Transparente | `manifest.json` → `icons` (purpose "any"), splash automático do Android |
| `maskable-192.png` | 192×192 | Sólido — Areia Clara `#F6F3EE` | `manifest.json` → `icons` (purpose "maskable"); conteúdo dentro da safe zone (~65%) para não ser cortado em máscaras circulares/squircle |
| `maskable-512.png` | 512×512 | Sólido — Areia Clara `#F6F3EE` | Idem, alta resolução |
| `apple-touch-icon.png` | 180×180 | Sólido — Areia Clara `#F6F3EE` (iOS não aceita transparência) | `<link rel="apple-touch-icon">` — ícone ao adicionar à tela de início no iOS |
| `manifest-icon.png` | 512×512 | Transparente | Ícone genérico de fallback para manifest/theming |

---

## 5. Android/

Ícones de launcher para o futuro app Android (Expo/React Native).

| Pasta/Arquivo | Tamanho | Uso |
|---|---|---|
| `mipmap-mdpi/ic_launcher.png` | 48×48 | Launcher — densidade mdpi (baseline 1x) |
| `mipmap-hdpi/ic_launcher.png` | 72×72 | Launcher — densidade hdpi (1.5x) |
| `mipmap-xhdpi/ic_launcher.png` | 96×96 | Launcher — densidade xhdpi (2x) |
| `mipmap-xxhdpi/ic_launcher.png` | 144×144 | Launcher — densidade xxhdpi (3x) |
| `mipmap-xxxhdpi/ic_launcher.png` | 192×192 | Launcher — densidade xxxhdpi (4x) |
| `round/ic_launcher_round_*.png` | mesmas densidades acima | Variante circular (`ic_launcher_round`) para launchers que usam máscara redonda |
| `adaptive-icon/ic_launcher_foreground.png` | 432×432, transparente | Camada de primeiro plano do Adaptive Icon (Android 8+); conteúdo dentro da safe zone (~62%) |
| `adaptive-icon/ic_launcher_background.png` | 432×432, cor sólida Areia Clara | Camada de fundo do Adaptive Icon |

---

## 6. iOS/

Ícones de app para o futuro app iOS (Expo/React Native) e submissão à App
Store. Sem canal alpha (exigência da Apple) — fundo sólido Areia Clara
`#F6F3EE`.

| Arquivo | Tamanho (px) | Uso típico |
|---|---|---|
| `icon-20.png` | 20×20 | Notificação @1x |
| `icon-29.png` | 29×29 | Configurações @1x |
| `icon-40.png` | 40×40 | Spotlight @1x / Notificação @2x |
| `icon-58.png` | 58×58 | Configurações @2x |
| `icon-60.png` | 60×60 | Notificação @3x |
| `icon-76.png` | 76×76 | Home Screen iPad @1x |
| `icon-80.png` | 80×80 | Spotlight @2x |
| `icon-87.png` | 87×87 | Configurações @3x |
| `icon-120.png` | 120×120 | Home Screen iPhone @2x / Spotlight @3x |
| `icon-152.png` | 152×152 | Home Screen iPad @2x |
| `icon-167.png` | 167×167 | Home Screen iPad Pro @2x |
| `icon-180.png` | 180×180 | Home Screen iPhone @3x |
| `icon-1024.png` | 1024×1024 | App Store (ícone de submissão) |

---

## 7. Splash/

Tela de abertura oficial. Fundo claro inspirado em areia (`#F8F5EF`), logo
principal centralizado, sombra suave sob o logo — sem fotografia, sem praia
desfocada, sem elementos extras. Exportadas em PNG (RGB, sem transparência).

| Arquivo | Resolução | Plataforma/Uso |
|---|---|---|
| `splash-mobile-portrait-1080x1920.png` | 1080×1920 | Celular, orientação retrato |
| `splash-mobile-landscape-1920x1080.png` | 1920×1080 | Celular, orientação paisagem |
| `splash-tablet-1668x2388.png` | 1668×2388 | Tablet (proporção iPad Pro 11") |
| `splash-desktop-2560x1440.png` | 2560×1440 | Splash/loading em navegador desktop |

---

## 8. OpenGraph/

Imagens para compartilhamento e apresentação institucional. Fundo Areia Clara,
logo principal, título e subtítulo do produto.

| Arquivo | Resolução | Uso |
|---|---|---|
| `opengraph-1200x630.png` | 1200×630 | Meta tags `og:image` / `twitter:image` — preview ao compartilhar o link em redes sociais e apps de mensagem |
| `banner-1600x900.png` | 1600×900 | Banner institucional para uso futuro no site (hero, apresentações, mídia kit) |

---

## 9. Backup/

Pasta reservada para versões anteriores de ativos, caso algum arquivo já
existente (ex.: os `.webp` em `apps/web/public/`) precise ser substituído no
futuro. Nenhum arquivo foi movido para cá nesta geração — nenhum ativo
existente foi sobrescrito.

---

## Paleta usada nestes ativos

Todos os fundos sólidos usam tokens já definidos em
[[12-Design-System/01-Colors]] — nenhuma cor nova foi criada:

- **Areia Clara** `#F6F3EE` — fundo padrão de ícones com fundo sólido (PWA maskable, apple-touch-icon, Android, iOS)
- **Areia (Splash/OG)** `#F8F5EF` — fundo das telas de Splash, Open Graph e Banner (valor pedido especificamente para essas peças)
- **Grafite** `#22303C` — texto de título (Open Graph/Banner)
- **Cinza Médio** `#6B7280` — texto de subtítulo (Open Graph/Banner)
- **Laranja Escuro "Ember"** `#B45309` — barra de destaque sob o título (Open Graph/Banner)

---

*Gerado a partir do logo oficial em `07-UX/135ab4e5-ef73-4307-824c-43d7dccbc7f7.png` — identidade visual preservada integralmente.*
