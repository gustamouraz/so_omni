# Roadmap inicial

## Fase 0 — prova de hardware

- identificar placa, bootloader e BSP;
- inicializar Linux e obter console serial;
- validar tela, touch, áudio, USB, Wi-Fi, Bluetooth, GPS e câmera;
- medir boot, RAM, temperatura e consumo elétrico.

Saída: relatório de compatibilidade e `defconfig` específico da placa.

## Fase 1 — central básica

- launcher nativo;
- configuração e reconexão de Wi-Fi;
- pareamento Bluetooth, áudio A2DP e chamadas HFP;
- mídia local/USB;
- GPS e mapa de contingência;
- câmera de ré prioritária;
- persistência de preferências e logs limitados.

Saída: imagem instalável para teste em bancada.

## Fase 2 — projeção de telefone

- selecionar fornecedor homologado de Android Auto;
- iniciar processo MFi ou contratar integrador CarPlay;
- integrar USB, Bluetooth, Wi-Fi P2P, áudio, microfone e touch;
- testar interrupções, chamadas, suspensão e reconexão;
- executar matriz de compatibilidade e certificação.

Saída: build candidato à homologação.

## Fase 3 — robustez automotiva

- atualização A/B com rollback;
- secure boot, assinatura de imagens e proteção de credenciais;
- watchdog por serviço;
- testes de queda de energia, armazenamento cheio e corrupção;
- política de distração e validação em movimento;
- ensaios térmicos e de longa duração.

Saída: candidato de produção.

