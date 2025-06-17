# Aula 4 - Criando o Primeiro Editor com Lexical

Chegou o momento de colocar o Lexical em prática. Nesta aula criaremos um editor de texto básico apenas com funcionalidades de plain text.

## Passos
1. **Importar componentes**: no arquivo `Editor.tsx`, importe `LexicalComposer`, `PlainTextPlugin`, `ContentEditable`, `HistoryPlugin` e `OnChangePlugin` de `@lexical/react`.
2. **Configurar o theme**: crie um objeto simples com classes CSS para parágrafo, texto e foco. O LexicalComposer recebe essas informações para estilizar o editor.
3. **Estrutura do componente**:
   ```tsx
   const editorConfig = {
     namespace: 'MeuEditor',
     theme,
     onError(error) { throw error; }
   };
   export default function Editor() {
     return (
       <LexicalComposer initialConfig={editorConfig}>
         <PlainTextPlugin
           contentEditable={<ContentEditable className="editor" />}
           placeholder={<div className="placeholder">Digite aqui...</div>}
         />
         <HistoryPlugin />
         <OnChangePlugin onChange={state => console.log(state.toJSON())} />
       </LexicalComposer>
     );
   }
   ```
4. **Testar**: execute `npm run dev` e digite algum texto. Verifique no console do navegador que o estado é impresso sempre que algo muda.
5. **Explicar** que, por enquanto, estamos lidando apenas com texto simples, mas a estrutura já suporta adicionar novos plugins.

Esse será o ponto de partida para todas as customizações nas aulas seguintes.
