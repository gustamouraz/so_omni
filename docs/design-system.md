# Identidade visual do SO Omni

## Paleta oficial

| Token | Cor | HEX | Uso |
| --- | --- | --- | --- |
| green | Verde neon | #6CCB3C | ação principal, seleção e conexão |
| green-light | Verde limão claro | #8FE35A | iluminação, foco e estado ativo |
| green-dark | Verde escuro | #3E8E2E | sombra e estado pressionado |
| black | Preto | #181818 | fundo principal |
| black-matte | Preto fosco | #2C2C2C | cartões e superfícies elevadas |
| white | Branco | #F2F2F2 | texto de maior contraste |
| gray-very-light | Cinza muito claro | #D9D9D9 | detalhes claros |
| gray-light | Cinza claro | #BEBEBE | texto secundário |
| gray | Cinza médio | #8F9397 | ícones inativos e molduras |
| gray-dark | Cinza escuro | #5E646A | sombras e vias do mapa |
| danger | Vermelho | #C8232A | erro, perigo e ação destrutiva |
| danger-dark | Vermelho escuro | #8B1A20 | sombra/pressão de ações críticas |

## Regras de uso

- verde indica ação segura, conexão ou estado confirmado;
- vermelho aparece apenas em falhas, alertas críticos e cancelamentos destrutivos;
- nunca comunicar estado somente pela cor: usar também texto, ícone ou forma;
- alvos de toque devem ter ao menos 48 x 48 px;
- texto sobre #181818 usa #F2F2F2 ou #BEBEBE;
- animações decorativas são reduzidas e não competem com a direção.

Os tokens já estão aplicados em prototype/src/styles.css.

## Ícone oficial

O arquivo mestre está em `assets/branding/omni-icon.png`. O protótipo o usa no
favicon e na barra superior; a imagem embarcada o instala em
`/usr/share/omni/omni-icon.png`. Alterações futuras devem substituir somente o
arquivo mestre, preservando o nome e as proporções quadradas.
