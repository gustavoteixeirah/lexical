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
