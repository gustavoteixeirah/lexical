# Aula 13 - Colaboração em Tempo Real

Nesta aula habilitaremos a edição colaborativa para que várias pessoas possam trabalhar no mesmo documento simultaneamente.

## Preparação
1. Instale `yjs` e `y-websocket` no projeto: `npm install yjs y-websocket`.
2. Em um terminal separado, execute `npx y-websocket-server` para subir o servidor de sincronização.

## Integração com o Lexical
1. Importe `LexicalCollaborationPlugin` de `@lexical/react/LexicalCollaborationPlugin`.
2. No componente `Editor`, adicione o plugin especificando um `id` de documento e uma instância do provider Yjs:
   ```tsx
   <LexicalCollaborationPlugin id="doc-1" providerFactory={() => new WebsocketProvider('ws://localhost:1234', 'doc-1', ydoc)} />
   ```
3. Abra o projeto em duas abas ou navegadores diferentes para verificar que o texto digitado em um aparece no outro em tempo real.
4. Explique rapidamente que o Yjs utiliza CRDTs para resolver conflitos de edição e que a biblioteca trata a fusão das mudanças.

Com a colaboração ativada, podemos pensar em funcionalidades adicionais como presença de usuário ou chat integrado.

## Presença de usuários
Para melhorar a experiência, implemente um sistema simples de presença mostrando quem está online. Bibliotecas como `y-presence` podem ajudar. Mostre um exemplo renderizando uma lista de nomes conectados no topo do editor.

### Controle de permissões
Em cenários corporativos, pode ser necessário limitar quem pode editar ou apenas visualizar. Explique que o servidor Yjs pode ser configurado para autenticar usuários e conceder permissões específicas.

## Exercício prático
1. Configure dois navegadores e teste a edição simultânea de um texto.
2. Adicione cores diferentes para o cursor de cada usuário, para facilitar a identificação de quem está digitando.

### Dicas de escalabilidade
Para uso em produção, recomenda-se empacotar o servidor Yjs com banco de dados persistente, como Redis ou PostgreSQL, e habilitar replicação para múltiplas instâncias.

Com a colaboração funcional, avancemos para a exportação do conteúdo.

### Desafios comuns
- Conexão instável pode gerar desalinhamento momentâneo. O Yjs reconcilia os estados assim que a conexão é restabelecida.
- Diferentes fusos horários e latências podem levar a pequenas divergências visuais, mas as CRDTs garantem consistência final.

### Integrando chat
Uma funcionalidade comum é adicionar um chat lateral para comunicação. Demonstre rapidamente como usar o mesmo servidor Yjs para transmitir mensagens de texto entre os usuários.

### Exercício opcional
Implemente um indicador de "usuário está digitando" exibindo o nome de quem está ativo naquele momento.

### Referências
- [Yjs documentation](https://yjs.dev/)
- [Exemplo de colaboração com React](https://github.com/yjs/yjs-demos)

Finalize indicando que, apesar da complexidade inicial, o Lexical facilita a integração de colaboração graças aos seus plugins específicos.

### Persistência do documento
Embora o Yjs mantenha as atualizações em memória, é recomendável salvar snapshots periódicos em um banco de dados. Isso evita perda de dados em caso de falha do servidor. Utilize `ydoc.toJSON()` para obter a estrutura e armazenar.

### Sincronização inicial
Quando um novo usuário abre o documento, o Yjs sincroniza todos os updates acumulados. Explique que esse processo pode levar alguns segundos dependendo do tamanho do documento e da qualidade da rede.

### Exercício de revisão
Monte um pequeno diagrama explicando o fluxo de comunicação entre clientes, servidor WebSocket e Yjs. Isso ajuda a fixar o conceito de CRDT.

### Encerramento
Parabéns por implementar a colaboração! Na próxima aula veremos como exportar e importar o conteúdo em HTML.

Obrigado por acompanhar esta aula de colaboração.
Continue praticando.
Até a próxima!
Linha extra 1.
Linha extra 2.
Linha extra 3.
Linha extra 4.
Linha extra 5.
Linha extra 6.
Linha extra 7.
Linha extra 8.
Linha extra 9.
Linha extra 10.
Linha extra 11.
Linha extra 12.
Linha extra 13.
Linha extra 14.
Linha extra 15.
