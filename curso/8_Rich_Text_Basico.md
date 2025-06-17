# Aula 8 - Rich Text Básico

Nesta etapa transformaremos nosso editor de texto simples em um editor rico, com suporte a negrito, itálico, listas e links.

## Alterando o plugin principal
1. Abra `Editor.tsx` e substitua `PlainTextPlugin` por `RichTextPlugin`.
2. O `RichTextPlugin` requer a inclusão do `ContentEditable` e de um componente `Placeholder`. Podemos reutilizar a estrutura da aula anterior.
3. Adicione também os nodes extras recomendados, importando por exemplo `ListPlugin` e `LinkPlugin`.

## Criando a barra de ferramentas
1. Em `src/components`, crie `Toolbar.tsx` com botões para cada ação: Bold, Italic, Lista Ordenada e Link.
2. Utilize `useLexicalComposerContext` para pegar o `editor` dentro da `Toolbar` e dispare os comandos adequados, por exemplo:
   ```tsx
   import {FORMAT_TEXT_COMMAND} from 'lexical';
   editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
   ```
3. Posicione `<Toolbar />` acima do `RichTextPlugin` dentro do `Editor`.
4. Estilize os botões para que fiquem visíveis e intuitivos.

## Teste
Execute `npm run dev` e experimente aplicar as formatações. Digite um texto, selecione trechos e clique nos botões para ver o resultado.

Com esse passo concluído, nosso editor está preparado para trabalhar com conteúdo rico, abrindo espaço para adicionar imagens e outros tipos de mídia.

## Utilizando atalhos de teclado
O Lexical já vem com alguns comandos integrados para atalhos clássicos de formatação. Mostre como podemos usar `registerRichText()` ou `RichTextPlugin` para habilitar automaticamente `Ctrl+B` (negrito) e `Ctrl+I` (itálico). Reforçe que as listas podem ser criadas com atalhos como `Ctrl+Shift+7` (lista ordenada) e `Ctrl+Shift+8` (lista não ordenada).

## Personalização da barra de ferramentas
Exemplo de botão para link:
```tsx
<button
  onClick={() => {
    const url = prompt('Digite a URL');
    if (url) {
      editor.dispatchCommand(INSERT_LINK_COMMAND, url);
    }
  }}
>
  Link
</button>
```
Explique como remover um link selecionando o texto e despachando `TOGGLE_LINK_COMMAND` com `null`.

## Foco e seleção
Demonstre que, ao aplicar formatação via código, precisamos garantir que a seleção esteja correta. O Lexical oferece utilidades como `$getSelection()` e `$setSelection()` para manipular o caret.

## Exercício
Peça para os alunos implementarem botões de atalho para `H1` e `H2`, utilizando `FORMAT_ELEMENT_COMMAND`. O objetivo é testar como o editor lida com diferentes tipos de blocos.

No próximo encontro vamos adicionar suporte a imagens.

## Lidando com undo/redo
Relembre que o `HistoryPlugin` já está registrado, portanto as combinações `Ctrl+Z` e `Ctrl+Shift+Z` funcionam automaticamente. Experimente criar texto, aplicar estilos e desfazer para mostrar que o estado é preservado.

## Salvando o conteúdo
Utilize o `OnChangePlugin` para capturar mudanças e salvar o estado em JSON ou HTML. Mostre a função `exportHTMLFromLexical` em um exemplo rápido. Essa funcionalidade será aprofundada em aula futura.

## Conclusão
Após implementar o rich text básico, nosso editor está apto para trabalhos de blog, comentários ou qualquer texto formatado. Explore as opções de formatação e pratique combinando teclas e botões.

### Atalhos adicionais
- `Ctrl+Shift+L` para criar listas numeradas
- `Ctrl+Shift+M` para citações

Dependendo do sistema operacional, substitua `Ctrl` por `Cmd` no macOS.

### Exercício de fixação
Crie um parágrafo formatado com negrito, itálico e um link. Em seguida, copie e cole em outro parágrafo para verificar se a formatação se mantém. Por fim, experimente remover um link usando o comando apropriado.

Terminamos o módulo de rich text básico. A seguir, vamos aprender a incluir imagens no documento.

### Referências
- [Guia de Rich Text do Lexical](https://lexical.dev/docs/richtext)
- [Exemplo de Editor com React](https://lexical.dev/docs/react)

Lembre-se de revisar o código e compartilhar suas dúvidas.

Continue explorando para ganhar fluência na formatação.
Nos vemos na aula de imagens.
Até lá!
