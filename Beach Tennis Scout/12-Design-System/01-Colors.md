# Colors — Paleta "Areia & Oceano"

> **Tema único: claro.** Não existe variante escura do produto.

---

## Fundos

| Nome | Hex | Uso |
|---|---|---|
| Areia Clara | `#F6F3EE` | Fundo padrão de todas as telas |
| Areia Suave | `#F1E7D7` | Seções alternadas, banners informativos |
| Branco | `#FFFFFF` | Cards, inputs, folhas elevadas |
| Areia Borda *(derivado)* | `#E7DECB` | Bordas e divisores |

## Cards

| Nome | Hex | Uso |
|---|---|---|
| Branco | `#FFFFFF` | Card padrão |
| Cinza muito claro | `#F8F8F6` | Superfície secundária dentro de um card |

## Texto

| Nome | Hex | Uso |
|---|---|---|
| Grafite | `#22303C` | Texto principal, números de placar |
| Cinza Médio | `#6B7280` | Texto secundário, legendas |

## Cores principais

| Nome | Hex | Uso |
|---|---|---|
| Azul Oceano | `#1E88E5` | CTA primário · Dupla A |
| Turquesa Mar | `#00ACC1` | Destaques secundários · cabeçalho do Super Tie-Break |
| Verde Vitória | `#2E7D32` | Winner · Forçou erro do adversário · Sucesso |
| Laranja Dupla B | `#FB8500` | Dupla B — **nunca vermelho** (substitui o antigo "Coral" `#FF7043`) |
| Laranja Areia | `#F59E0B` | Avisos, indicador de troca de lado no Super Tie-Break |

## Estados

| Nome | Hex | Uso |
|---|---|---|
| Sucesso | `#2E7D32` | Confirmações |
| Erro | `#E53935` | Exclusivo para erro — nunca para identidade de dupla |
| Aviso | `#F59E0B` | Alertas não-bloqueantes |
| Informação | `#1E88E5` | Mensagens neutras |
| Desabilitado | `#B0BEC5` | Botões/campos inativos |

## Duplas

| Dupla | Nome | Hex |
|---|---|---|
| A | Azul Oceano | `#1E88E5` |
| B | Laranja Dupla B | `#FB8500` |

**Regra:** vermelho nunca representa uma dupla. Fica reservado exclusivamente para o estado de erro.

## Eventos de ponto

| Evento | Cor | Hex |
|---|---|---|
| Winner | Verde Vitória | `#2E7D32` |
| Forçou erro do adversário | Verde Vitória (idêntico ao Winner) | `#2E7D32` |
| Erro não forçado | Erro | `#E53935` |

Todos os botões de evento (Winner, Forçou Erro, Erro) têm exatamente a mesma largura, altura e peso de fonte — a única variável é a cor semântica.

---

## Tons derivados (claro/escuro de cada cor principal)

Necessários para fundos de badge (tom claro) e texto sobre fundo claro (tom escuro). Sempre derivados da mesma cor-base — nunca uma cor nova.

| Base | Claro (fundo de badge) | Escuro (texto sobre fundo claro) |
|---|---|---|
| Azul Oceano | `#E4F1FC` | `#0F5FA8` |
| Turquesa Mar | `#DFF6F9` | `#007887` |
| Verde Vitória | `#E5F3E6` | `#1B5E20` |
| Laranja Dupla B | `#FFF1DE` | `#B35C00` |
| Laranja Areia | `#FEF3D9` | `#92660A` |
| Erro | `#FDE7E6` | `#B3221D` |

---

## Nota de acessibilidade

O antigo "Coral" (`#FF7043`) e o Erro (`#E53935`) eram matizes vizinhos (~12° de distância no círculo cromático — laranja-avermelhado vs. vermelho puro), o que gerava confusão visual em contextos onde os dois apareciam próximos (nome da Dupla B ao lado de um botão de erro vermelho, por exemplo). O Laranja Dupla B (`#FB8500`) foi escolhido deliberadamente ~30° mais distante do Erro no círculo cromático — lê como laranja inequívoco, não como "vermelho errado". A cor de erro nunca representa uma dupla; a cor de dupla nunca é usada para sinalizar erro.

---

## Tokens CSS correspondentes (`apps/web/src/app/globals.css`)

```css
--sand-clear: #F6F3EE;
--sand-soft: #F1E7D7;
--white: #FFFFFF;
--card-grey: #F8F8F6;
--ink: #22303C;
--ink-muted: #6B7280;
--line: #E7DECB;

--ocean: #1E88E5;      --ocean-dark: #0F5FA8;   --ocean-tint: #E4F1FC;
--lagoon: #00ACC1;     --lagoon-dark: #007887;  --lagoon-tint: #DFF6F9;
--victory: #2E7D32;    --victory-dark: #1B5E20; --victory-tint: #E5F3E6;
--coral: #FB8500;      --coral-dark: #B35C00;   --coral-tint: #FFF1DE;
--dune: #F59E0B;       --dune-dark: #92660A;    --dune-tint: #FEF3D9;

--success: #2E7D32;
--error: #E53935;      --error-tint: #FDE7E6;
--warning: #F59E0B;
--info: #1E88E5;
--disabled: #B0BEC5;
```

> O token CSS mantém o nome `--coral` por compatibilidade com o código existente, mas o valor e o nome de exibição no Design System são "Laranja Dupla B".

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
