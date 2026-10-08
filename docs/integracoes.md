# Integrações e dependências comerciais

## Apple CarPlay

CarPlay faz parte do programa MFi. Especificações, componentes de autenticação,
ferramentas e certificação são disponibilizados aos participantes do programa.
Para um produto comercial, a rota correta é entrar no MFi ou contratar um
fabricante/fornecedor já licenciado.

Referências oficiais:

- <https://mfi.apple.com/en/how-it-works>
- <https://mfi.apple.com/en/faqs>

O repositório reserva o adaptador `OMNI_PROJECTION_CARPLAY`, mas não contém nem
tentará reproduzir protocolo proprietário ou chaves de autenticação.

## Android Auto

Android Auto é projeção a partir de um telefone para uma central compatível. O
Desktop Head Unit do Google é apropriado para desenvolvimento e teste de
aplicativos, mas não substitui o caminho OEM/aftermarket para distribuir uma
central receptora. No produto, será integrado um middleware/BSP autorizado e
testado com a matriz de telefones exigida pelo fornecedor.

Referências oficiais:

- <https://developer.android.com/training/cars/platforms/android-auto>
- <https://developer.android.com/training/cars/testing/dhu>

## Google Maps na tela inicial

Há três cenários diferentes:

1. **Google Maps projetado pelo telefone**: é a rota preferencial neste hardware;
   quando Android Auto ou CarPlay está ativo, o telefone fornece navegação.
2. **Google Maps nativo embarcado**: o Navigation SDK estabelece que uso em
   dispositivo embarcado, exceto projeção, exige consentimento explícito do
   Google. Também há custos, conectividade e consumo de RAM a considerar.
3. **Mapa local de contingência**: MapLibre com dados OSM pode fornecer mapa e
   posição offline, sem ser chamado ou apresentado como Google Maps.

Referência oficial:

- <https://developers.google.com/maps/documentation/navigation/android-sdk/policies>

Até existir contrato e chave adequados, o protótipo usa uma representação de
mapa marcada como demonstração. Não usa tiles, logotipos nem APIs do Google.

## Decisão recomendada para o MVP

- tela inicial com mapa local simples e posição do GPS;
- botão de navegação abre a projeção do telefone quando disponível;
- Android Auto com fornecedor homologado primeiro;
- CarPlay após adesão MFi ou parceria licenciada;
- avaliar Google Maps nativo somente após medir a placa e obter autorização.

