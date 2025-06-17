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

## Explicando o código
- `useLexicalComposerContext()` retorna o editor que foi criado pelo `LexicalComposer`.
- Utilizamos `useEffect` sem dependências além do editor para que o foco seja aplicado uma única vez.
- O `setTimeout` com delay `0` garante que o foco ocorra após o editor ser montado no DOM.

### Opção com `useLayoutEffect`
Se preferir, podemos usar `useLayoutEffect` para que o foco aconteça antes do navegador pintar a tela. Em ambientes com React estrito (StrictMode), atente-se à dupla execução no desenvolvimento.

```tsx
useLayoutEffect(() => {
  editor.focus();
}, [editor]);
```

## Testando em dispositivos móveis
Explique que em dispositivos móveis o foco automático pode abrir o teclado virtual imediatamente, o que pode ou não ser desejável. Avalie a experiência do usuário em cada contexto.

## Exercício
Adicione uma condição para focar apenas se a URL possuir um hash específico, por exemplo `#editar`. Isso demonstra como podemos ler valores da página e decidir quando ativar o foco.

Finalizada esta aula, partiremos para recursos de rich text.

## Tratando exceções
Em alguns navegadores, a tentativa de focar programaticamente pode ser bloqueada caso não haja interação do usuário. Mostre como envolver a chamada em um `try/catch` e exibir uma mensagem de aviso no console.

```tsx
useEffect(() => {
  try {
    setTimeout(() => editor.focus(), 0);
  } catch (err) {
    console.warn('Não foi possível aplicar foco automaticamente', err);
  }
}, [editor]);
```

## Integração com testes
Se estiver escrevendo testes automatizados (por exemplo, com Jest e React Testing Library), valide que o foco realmente está no elemento `contentEditable` usando `expect(editor.getRootElement()).toHaveFocus()`.

## Quando não usar
Explique que o autofoco pode ser inconveniente em formulários com múltiplos campos ou quando a página possui diversas áreas interativas. Considere adicionar uma opção no componente para habilitar ou desabilitar o comportamento.

### Parâmetro opcional
```tsx
export default function AutoFocusPlugin({enabled = true}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (enabled) {
      setTimeout(() => editor.focus(), 0);
    }
  }, [editor, enabled]);
  return null;
}
```
Use essa versão aprimorada para que o usuário controle se o foco deve ser aplicado.

Encerre a aula reforçando que plugins simples como esse aprimoram a experiência do usuário com pouco código.
Na sequência aprenderemos recursos de rich text.
