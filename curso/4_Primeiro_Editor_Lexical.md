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

## Explicação detalhada do código
Cada parte do exemplo tem uma função específica:
- `LexicalComposer`: responsável por fornecer o contexto do editor para todos os plugins.
- `PlainTextPlugin`: combina o componente `ContentEditable` com o placeholder e cuida da atualização básica do texto.
- `HistoryPlugin`: habilita as funções de desfazer/refazer sem esforço adicional.
- `OnChangePlugin`: expõe um callback para acompanharmos as mudanças no estado do editor. Útil para salvar em tempo real ou integrar com bancos de dados.

Adicione estilos simples ao `index.css` para deixar a interface mais agradável:
```css
.editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 150px;
  padding: 8px;
}
.placeholder {
  color: #999;
}
```

## Depuração
Para entender melhor, ative o plugin de desenvolvimento do Lexical no `DevTools` do navegador. Basta instalar a extensão e ela identificará o editor, permitindo inspecionar nós e atualizações em tempo real.

## Exercício
Peça que os alunos modifiquem o placeholder e adicionem um botão que limpa o editor chamando `editor.update(() => $getRoot().clear())`. Isso ajuda a testar a manipulação do estado.

## Próximos passos
Na próxima aula, veremos como personalizar temas para dar identidade ao editor, alterando cores e estilos de forma global.

## Possíveis problemas e soluções
Caso o editor não apareça corretamente:
1. Verifique se o componente `Editor` foi importado no `App.tsx`.
2. Confirme se o CSS está sendo carregado (cheque o console e a aba Network do navegador).
3. Certifique-se de que a versão do React e do Lexical são compatíveis (consultar `package.json`).

### Dica de acessibilidade
Adicione `aria-label="editor lexical"` ao elemento `ContentEditable` para que leitores de tela reconheçam o editor como uma área de edição de texto.

### Revisão final
Ao final da aula, revise o fluxo:
- Configuramos o editor básico.
- Entendemos como o `LexicalComposer` agrupa plugins.
- Testamos o funcionamento com um placeholder e com a visualização do estado.

Com isso, concluímos a implementação mínima do editor. Siga para a aula de personalização de temas.

Finalizando, reforce a importância de praticar os passos para fixar o conhecimento.
Próxima aula: personalizando temas.
