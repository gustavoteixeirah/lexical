# Aula 5 - Personalização de Temas

Agora que temos um editor funcional, vamos deixá-lo com a nossa cara. O Lexical permite definir um objeto de `theme` onde cada tipo de nó recebe uma classe CSS.

## Criando o tema
1. Dentro da pasta `src`, crie um arquivo `theme.ts` exportando o objeto abaixo:
   ```ts
   const theme = {
     paragraph: 'editor-paragraph',
     text: {
       bold: 'text-bold',
       italic: 'text-italic'
     }
   };
   export default theme;
   ```
2. No arquivo de estilos global (ex.: `index.css`), defina essas classes:
   ```css
   .editor-paragraph { margin: 0 0 8px; }
   .text-bold { font-weight: bold; }
   .text-italic { font-style: italic; }
   .editor { border: 1px solid #ccc; padding: 8px; }
   .placeholder { color: #999; }
   ```
3. Importe `theme` no `Editor.tsx` e passe-o para `LexicalComposer`.
4. Execute a aplicação novamente e demonstre a diferença visual ao aplicar negrito ou itálico.
5. Explique que podemos alterar cores, espaçamento e adicionar classes para outros nós (listas, cabeçalhos) conforme o projeto evoluir.

Esse cuidado estético deixa o editor integrado ao layout do aplicativo e melhora a experiência do usuário.
