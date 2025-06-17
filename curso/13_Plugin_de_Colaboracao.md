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
