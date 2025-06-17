# Aula 9 - Gerenciando Imagens

Imagens deixam o texto muito mais interessante. Vamos aprender como permitir que o usuário envie figuras para o editor e as manipule.

## Implementação
1. Instale o pacote opcional `@lexical/react/LexicalImage` ou utilize um exemplo de `ImageNode` customizado.
2. No componente `Toolbar`, adicione um botão "Inserir Imagem" que abre o seletor de arquivos (`<input type="file" />`).
3. No `onChange` desse input, leia o arquivo e converta para URL com `URL.createObjectURL` ou envie para um servidor.
4. Dentro do `Editor`, insira o nó de imagem usando `editor.insertNodes([new ImageNode({src})])`.
5. Permita que o usuário redimensione ou remova a imagem adicionando handlers de drag e um ícone de exclusão.
6. Fale sobre a importância de adicionar um campo para texto alternativo (atributo `alt`) garantindo a acessibilidade.

## Dicas de armazenamento
- Para testes locais, armazenar as imagens em memória usando `blob:` URLs é suficiente.
- Em produção, considere enviar para um serviço como Amazon S3 ou Cloudinary e salvar apenas a URL no estado do documento.

Com suporte a imagens, nosso editor fica mais completo e pronto para lidar com outros tipos de mídia.

## Código de exemplo
```tsx
// Dentro do handler de envio
function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;
  const src = URL.createObjectURL(file);
  editor.update(() => {
    const imageNode = $createImageNode({src, altText: file.name});
    $insertNodes([imageNode]);
  });
}
```
Explique cada linha, desde a leitura do arquivo até a criação do nó e inserção no estado.

## Plugins auxiliares
Cite bibliotecas que ajudam no upload, como React Dropzone. Mostre rapidamente como integrar para permitir arrastar e soltar imagens na área do editor.

## Exercícios
1. Implemente um painel flutuante ao clicar em uma imagem, exibindo campos de edição de tamanho e texto alternativo.
2. Permita posicionar a imagem à esquerda ou direita do texto (float) usando classes CSS.

Finalizando esta aula, vamos avançar para a inserção de áudio.

### Otimização de desempenho
- Reduza o tamanho dos arquivos antes de enviá-los ao servidor.
- Utilize formatos modernos como WebP quando possível.
- Carregue as imagens de forma assíncrona para evitar travamentos no editor.

### Acessibilidade
- Sempre ofereça campo de texto alternativo para descrever a imagem.
- Evite usar imagens apenas como decoração; se for o caso, marque com `role="presentation"` ou `aria-hidden="true"`.

## Conversão para HTML
Quando exportarmos o documento como HTML, o Lexical converterá cada `ImageNode` para uma tag `<img src="..." alt="..." />`. Certifique-se de que as URLs continuam acessíveis após o upload.

## Conclusão
Com imagens implementadas, abrimos caminho para tratar de outras mídias nos próximos capítulos.

### Exercício final
Adicione suporte para arrastar e soltar imagens diretamente no editor. Dica: escute o evento `onDrop` no `ContentEditable`, previna o comportamento padrão e capture os arquivos da propriedade `dataTransfer`. Em seguida, utilize o mesmo processo de `createObjectURL` para inserir a imagem.

Concluída esta aula, prepare-se para a manipulação de áudio.

### Links úteis
- [MDN: input type="file"](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input/file)
- [Exemplo de ImageNode no repositório do Lexical](https://github.com/facebook/lexical/blob/main/packages/lexical/src/nodes/ImageNode.ts)
- [Lib React Dropzone](https://react-dropzone.js.org)

Pratique bastante a inserção e manipulação de imagens para dominar o processo.

### Dica de performance
Se muitas imagens forem adicionadas, considere paginar ou renderizar de forma preguiçosa (lazy load). Isso pode ser feito utilizando a API de Intersection Observer para carregar apenas quando a imagem estiver próxima do viewport.

Terminamos a parte de imagens. Nos próximos vídeos vamos tratar de áudio e vídeo para completar a parte de multimídia.

Encerramos esta aula. Até a próxima!
Próximo tópico: inserindo áudio.
Obrigado por acompanhar.
Nos vemos em breve.
Até mais!
Fim desta aula.
