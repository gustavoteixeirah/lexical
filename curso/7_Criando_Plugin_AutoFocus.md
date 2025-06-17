# Aula 7 - Criando um Plugin de Auto Focus

Hora de escrever nosso primeiro plugin de verdade. A ideia é que o editor receba o foco automaticamente assim que a página carregar.

## Implementação passo a passo
1. Crie um arquivo `AutoFocusPlugin.tsx` em `src/plugins`.
2. No início do arquivo, importe `useLexicalComposerContext` e `useEffect`.
3. Defina o componente:
   ```tsx
   export default function AutoFocusPlugin() {
     const [editor] = useLexicalComposerContext();
     useEffect(() => {
       // Aguarda a próxima iteração do event loop para garantir que o editor exista
       setTimeout(() => editor.focus(), 0);
     }, [editor]);
     return null;
   }
   ```
4. No componente `Editor`, importe e inclua `<AutoFocusPlugin />` logo abaixo do `HistoryPlugin`.
5. Execute `npm run dev` e mostre que, ao recarregar a página, o cursor já aparece dentro da área de edição pronto para digitar.

Esse plugin simples demonstra como interagir com o editor no momento em que ele é montado. A mesma estrutura servirá para plugins mais complexos.
