# BIP 888: Escudo de Enxame Entrópico (ESS)

---
### 🗺️ Roteiro do Projeto & Navegação
[🔭 Visão](./README.md) → [📜 Whitepaper](./WHITEPAPER.md) → [🔢 Matemática](./MATH_MODEL.md) → [🧬 Regras](./GUIDELINES.md) → [🧪 Demo](https://capgorack.github.io/Bip888/)
---

🌐 [English](../../WHITEPAPER.md) | 🇧🇷 **Português (Brasil)**

<preamble>
  BIP: 888 (Proposto)
  Camada: Consenso (Soft Fork)
  Título: Escudo de Enxame Entrópico (ESS) - Resistência Quântica via Decoys Distribuídos
  Autor: Éve Sk > CapGorack <eve.sky@gmx.com>
  Status: Rascunho
  Tipo: Standards Track
  Criado em: 2026-02-13
  Licença: BSD-2-Clause
</preamble>

# Resumo (Abstract)
Este BIP propõe um novo mecanismo de defesa contra ataques de computação quântica (especificamente, o algoritmo de Grover visando chaves privadas ECDSA a partir de chaves públicas reveladas no mempool). A solução proposta, o **Escudo de Enxame Entrópico (ESS - Entropic Swarm Shield)**, utiliza o poder computacional distribuído da rede de validadores para gerar volumes massivos de transações falsas (decoys) criptograficamente plausíveis para cada transação legítima. Ao utilizar **Sementes de Entropia Compactas (32 bytes)** e **Prova de Trabalho do Receptor (Receiver-PoW)**, o protocolo cria um campo entrópico massivo sem congestionar a rede. Este "Protocolo de Mimetismo Fractal" cria uma assimetria informacional: enquanto a rede legítima pode verificar a validade de forma barata via um segredo compartilhado bloqueado por tempo, um adversário quântico é forçado a despender recursos exponenciais para distinguir o alvo do ruído, efetivamente neutralizando a vantagem quântica através da força bruta da entropia.

**Prova de Conceito Matemática (PoC):** Uma simulação funcional deste protocolo está disponível no diretório [`simulation/`](../../simulation/) e a validação matemática detalhada pode ser encontrada em [`MATH_MODEL.md`](./MATH_MODEL.md).

# Motivação
A vulnerabilidade da Criptografia de Curva Elíptica (ECC) ao algoritmo de Shor é uma ameaça existencial conhecida para o Bitcoin. Embora assinaturas de Criptografia Pós-Quântica (PQC) ofereçam uma solução, elas frequentemente vêm com um overhead massivo no tamanho das assinaturas e exigem mudanças fundamentais no consenso.

O **Escudo de Enxame Entrópico (ESS)** propõe uma mudança de paradigma: da dureza matemática passiva para a ofuscação ativa e disruptiva — a **Matemática da Escutação (Shrouded Truth)**.

Ao aproveitar a capacidade computacional ociosa da rede para gerar ruído caótico estruturado, introduzimos uma **Primitiva de Assimetria Computacional**. Este protocolo não apenas "tranca" uma porta; ele a esconde dentro de um labirinto determinístico de espelhos. O objetivo é aumentar a segurança efetiva do mempool contra ataques quânticos em tempo real, enquanto simultaneamente melhora a privacidade da rede e as capacidades anti-fraude através da **Integridade baseada em Entropia**.

# Justificativa (Rationale)
A escolha de um enxame entrópico em vez de uma transição forçada para Criptografia Pós-Quântica (PQC) baseia-se no princípio da **intervenção mínima** e na criação de uma **Verdade Oculta (Shrouded Truth)**.
- **Eficiência:** O ESS evita o overhead massivo no tamanho das assinaturas característico de muitos algoritmos PQC.
- **Incentivos:** Transforma a rede de um retransmissor passivo em um participante ativo na segurança, aproveitando a infraestrutura descentralizada existente.
- **Matemática da Escutação:** Ao usar geração fractal, garantimos que o custo de distinção para um adversário seja exponencial, enquanto o custo de verificação para a rede é constante. Isso abre possibilidades para sistemas anti-fraude ao criar um padrão determinístico obrigatório que deve ser mimetizado para ser considerado parte do enxame "orgânico".

# Especificação

## 1. Geração Fractal de Decoys
Ao receber uma transação $T_{real}$, os nós participantes DEVEM gerar $N$ transações falsas ($T_{decoy}$).
- **Determinismo:** Decoys são gerados usando um mapa caótico determinístico semeado pelo hash de $T_{real}$.
- **Indistinguibilidade:** Decoys DEVEM compartilhar a exata estrutura de dados de $T_{real}$.
- **Compactação:** Os nós NÃO transmitem decoys completos. Eles transmitem uma **Semente de Entropia** de 32 bytes. O enxame é inflado localmente pelo nó receptor, garantindo que o impacto na largura de banda seja desprezível.

## 2. Consenso Seletivo via Bloqueio Temporal
Uma transação é válida APENAS se satisfizer uma condição de Prova de Trabalho que é impossível para um atacante pré-calcular para todos os decoys simultaneamente.

## 3. Armazenamento e Poda (Pruning)
Decoys existem APENAS no mempool e na camada de propagação p2p. Validadores incluem apenas $T_{real}$ no bloco, resultando em inchaço zero para o blockchain permanente.

# Compatibilidade Reversa (Backward Compatibility)
Esta proposta é desenhada como um **Soft Fork**.
- Nós antigos perceberão transações decoy como válidas para propagação, mas ignorarão os metadados do BIP 888.
- Como decoys nunca são incluídos na blockchain permanente, não há risco de corrupção do livro-razão ou inchaço para participantes legados.

# Modelagem de Ameaças (Threat Modeling)
Para avaliar a eficácia do ESS, comparamos os seguintes cenários de segurança:

1.  **Linha de Base (Sem Defesa)**: Transações revelam chaves públicas no mempool. Derivações de chave privada por CRQC em $T < 600s$ resultam em roubo bem-sucedido via transação conflitante (RBF).
2.  **Escudo ESS (BIP 888)**: O mempool é populado com $N=10^5$ decoys. O adversário deve executar buscas de Grover através do enxame. O tempo de busca resultante $T_{search} \gg 600s$ garante que a transação seja confirmada antes da chave ser derivada.
3.  **PQC Completo (Estado Futuro)**: Primitivas criptográficas são substituídas por assinaturas baseadas em reticulados/hash. Embora forneça resistência matemática absoluta, isso requer espaço de bloco significativo e uma grande revisão do consenso. O ESS serve como a ponte "Pré-Quântica".

# Questões em Aberto e Considerações
- **Escalabilidade**: Um enxame de $10^5$ decoys gera overhead significativo. Propomos "Decoys Comprimidos" (enviando sementes em vez de dados completos) para minimizar o impacto em MB/s por nó.
- **Políticas de Relay**: Nós Bitcoin usam filtros estritos de anti-spam e taxas. Decoys devem ser "economicamente plausíveis" para evitar serem podados pela política de relay antes de servirem ao seu propósito defensivo.
- **Ataques Adaptativos**: Um adversário pode tentar distinguir decoys usando heurísticas (tempo de criação, padrões de taxa). O ESS deve garantir a "plausibilidade" dos decoys através do alinhamento estatístico com o comportamento real do mempool.
- **Implementação de Grover**: O custo do Oráculo SHA-256 em um ambiente CRQC precisa de maior formalização para estabelecer margens de segurança precisas em cenários de hardware otimistas/pessimistas.

# 6. Mecânicas Avançadas e Governança

## 6.1 Indistinguibilidade de Decoy (Camuflagem Ativa)
Para evitar filtragem heurística, os geradores de mapa caótico são parametrizados por estatísticas reais do mempool:
- **Mimetismo de Taxa (Fee)**: Taxas de decoy são extraídas de uma distribuição $D_{fee}$ correspondendo à média móvel dos últimos $k$ blocos.
- **Templating de Script**: Tipos de script de decoy (P2TR, P2WPKH) espelham as proporções observadas no mempool atual.
- **Resultado**: Um adversário não pode simplesmente filtrar por "taxa baixa" ou "script não padrão" sem rejeitar uma porção significativa do tráfego legítimo.

## 6.2 Política de Relay & Anti-Spam (Receiver-PoW)
Para evitar inundação da rede, o ESS introduz um mecanismo de **Prova de Trabalho do Receptor**:
- **Propagação Compacta**: Nós propagam mensagens `INV_ENTROPY` contendo apenas a Semente (32 bytes).
- **Inflação Local**: O nó receptor realiza a expansão caótica localmente.
- **Assimetria de Custo**: Validar o PoW da semente é barato; gerar o enxame completo é computacionalmente estritamente limitado. Isso desloca o custo de largura de banda da camada P2P da rede para CPU/Memória local, que é abundante comparada ao espaço de bloco.

## 6.3 Segurança da Semente
A semente $S$ é efêmera e derivada de:
$$S = Hash(Block_{prev} \oplus Node_{nonce} \oplus TimeSlot)$$
- **Escopo Local**: A semente é válida apenas para a janela de propagação atual.
- **Imprevisibilidade**: Um atacante não pode pré-calcular o enxame sem comprometer a entropia PoW subjacente do bloco anterior ou o estado específico do nó.

## 6.4 Governança e Ativação
- **Soft Fork Necessário**: O ESS introduz uma nova regra de consenso para a propagação `INV_ENTROPY` e validação de Bloqueio Temporal.
- **Compatibilidade Reversa**: Nós legados simplesmente ignorarão mensagens `INV_ENTROPY`. A proteção de enxame formará efetivamente uma rede overlay de nós atualizados que protegem a transação até que ela chegue a um minerador (que pode ou não ser atualizado, mas o atraso é alcançado durante a propagação).

# 7. Verificação de Impacto de Rede (Benchmark)
Para validar a viabilidade econômica do ESS, fornecemos uma ferramenta de verificação do lado do cliente (`benchmark.worker.js`) que mede o custo computacional em tempo real para gerar o enxame.

## 7.1 Metodologia: Naive vs. Compacta
O benchmark compara dois métodos de propagação para um enxame de tamanho $N=100.000$:

### A. Propagação Ingênua (Ataque Legado)
- **Mecanismo**: O nó gera todas as $N$ transações e tenta transmiti-las individualmente.
- **Largura de Banda**: $N \times 250 \text{ bytes (Tamanho Médio de Tx)}$.
- **Resultado**: Para $N=10^5$, isso requer **25 MB** de largura de banda. Isso é indistinguível de um ataque DDoS e seria rejeitado por políticas de relay padrão.

### B. Propagação Compacta (Padrão BIP 888)
- **Mecanismo**: O nó transmite apenas a **Semente de Entropia** e o parâmetro de expansão $N$.
- **Largura de Banda**: 32 bytes (Semente) + 4 bytes (Inteiro) = **36 bytes**.
- **Custo de CPU**: O nó receptor expande a semente usando o Mapa Logístico ($x_{n+1} = r x_n (1-x_n)$).
- **Resultado**: **36 bytes** no total. O "trabalho" é deslocado da Largura de Banda de Rede (escassa) para a CPU Local (abundante).

## 7.2 Resultados Empíricos (Hardware de Referência)
Testes conduzidos em hardware de consumo padrão (ex: Apple M1, Intel i7) demonstram:
- **Tempo de Geração**: $< 50ms$ para $N=100.000$.
- **Throughput**: $> 2.000.000$ decoys por segundo por núcleo.
- **Conclusão**: O custo computacional de manter o escudo é desprezível comparado ao custo criptográfico de quebrá-lo (Busca de Grover).

# 8. Implementação de Referência
A lógica de Implementação de Referência (Visualizador) está disponível neste repositório para demonstrar o limiar de entropia necessário para derrotar um adversário quântico simulado.

# Considerações de Segurança
- **Largura de Banda:** O custo primário é a largura de banda. Isso é mitigado pelas **Sementes Compactas**, onde apenas a semente é transmitida e o nó regenera o enxame localmente.
- **DoS:** Deve-se tomar cuidado para que a geração de decoys não seja usada como vetor de negação de serviço. O mecanismo **Receiver-PoW** garante que os nós só gastem CPU para sementes legítimas.
- **A Verdade Oculta (Shrouded Truth):** O enxame atua como uma assinatura da integridade da rede. Qualquer transação que não siga o padrão fractal é detectada como "alienígena", servindo como um sinal anti-fraude de conhecimento zero.

---
*"A autenticidade desta proposta reside na sua capacidade matemática de sobreviver ao caos."*

## 📜 Propriedade Intelectual e Licenciamento
Este documento e os conceitos de "Escudo de Enxame Entrópico" são a contribuição técnica de **Éve Sk > CapGorack**.

**Licenciamento:** Distribuído sob a **Licença BSD de 2 Cláusulas**.
Copyright © 2026 Éve Sk > CapGorack.
