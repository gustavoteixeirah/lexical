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

## Dicas de design
- Escolha cores que tenham bom contraste para manter a legibilidade.
- Utilize unidades de medida relativas (`rem`, `em`) para facilitar o ajuste em diferentes tamanhos de tela.
- Caso esteja usando uma biblioteca de componentes (como Material UI ou Tailwind), integre suas classes no objeto de tema.

## Tema dinâmico
Você pode criar um seletor de temas claro/escuro. Exemplo simplificado:
```tsx
const lightTheme = {...};
const darkTheme = {...};

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <ThemeContext.Provider value={dark ? darkTheme : lightTheme}>
      <Editor />
      <button onClick={() => setDark(!dark)}>Alternar tema</button>
    </ThemeContext.Provider>
  );
}
```
Use o contexto para acessar o tema dentro do `Editor.tsx`.

## Exercício
Incentive os alunos a personalizarem o CSS para que o editor combine com a identidade visual do projeto. Peça que adicionem classes para cabeçalhos (`h1`, `h2`) e links.

Ao final, lembre de commitar as mudanças no repositório e executar `npm run format` para aplicar a formatação automática.

No próximo encontro veremos como funcionam os plugins do Lexical em detalhes.

## Inserindo ícones
Caso queira usar botões com ícones (para negrito, itálico, etc.), adicione fontes de ícones como Font Awesome ou Material Icons no `index.html`. Em seguida, inclua os botões dentro do componente `Editor` ou em um painel separado.

Exemplo:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
```
E no `Editor.tsx`:
```tsx
<button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
  <i className="fas fa-bold" />
</button>
```
Explique que esse botão executa o comando para aplicar negrito na seleção atual.

## Revisão final
- Criamos um arquivo de tema e aplicamos classes ao editor.
- Incluímos uma opção para alternar entre modos claro e escuro.
- Vimos a possibilidade de inserir ícones e botões de formatação.

Pratique modificando cores e estilos e compartilhando no fórum do curso.
