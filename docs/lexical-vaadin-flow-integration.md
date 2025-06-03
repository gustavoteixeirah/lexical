# Integração do Lexical Editor com Vaadin Flow

Este documento descreve como integrar o editor Lexical com o framework Vaadin Flow para aplicações Java.

## Introdução

[Vaadin Flow](https://vaadin.com/flow) é um framework Java para construção de aplicações web modernas. Ele permite que desenvolvedores Java criem interfaces de usuário interativas usando principalmente código Java, com a possibilidade de integrar componentes JavaScript quando necessário.

O [Lexical Editor](https://lexical.dev/) é um framework de edição de texto extensível e baseado em JavaScript, desenvolvido pelo Facebook (Meta). Integrá-lo com o Vaadin Flow permite adicionar recursos avançados de edição de texto em aplicações Vaadin.

## Pré-requisitos

Antes de começar, você precisa ter:

1. Um projeto Vaadin Flow configurado (versão 14+)
2. Conhecimento básico de Java e TypeScript/JavaScript
3. Maven ou Gradle para gerenciamento de dependências

## Arquitetura da Integração

A integração do Lexical com o Vaadin Flow envolve três componentes principais:

1. **Componente Java do lado do servidor**: Uma classe Java que estende `Component` do Vaadin
2. **Componente TypeScript do lado do cliente**: Um componente web que encapsula o Lexical
3. **Ponte de comunicação**: Mecanismos para sincronizar dados entre o servidor e o cliente

### Visão Geral da Arquitetura

```
+------------------+        +------------------+        +------------------+
|                  |        |                  |        |                  |
|  Componente Java |<------>|  Ponte Vaadin   |<------>| Componente Web   |
|  (Servidor)      |        |  (Comunicação)   |        | Lexical (Cliente)|
|                  |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
```

## Implementação

### 1. Criando o Componente Java

Primeiro, crie uma classe Java que representará o editor Lexical no lado do servidor:

```java
package com.example.lexical;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.dom.Element;

@Tag("lexical-editor")
@NpmPackage(value = "lexical", version = "0.11.1")
@JsModule("./src/lexical-editor.ts")
public class LexicalEditor extends Component {

    private final Div container;

    public LexicalEditor() {
        container = new Div();
        container.setClassName("lexical-editor-container");
        getElement().appendChild(container.getElement());

        // Configurar propriedades iniciais
        getElement().setProperty("editorState", "{}");
        getElement().setProperty("readOnly", false);
    }

    /**
     * Define o conteúdo do editor.
     * 
     * @param editorState O estado do editor serializado como JSON
     */
    public void setEditorState(String editorState) {
        getElement().setProperty("editorState", editorState);
    }

    /**
     * Obtém o conteúdo atual do editor.
     * 
     * @return O estado do editor serializado como JSON
     */
    public String getEditorState() {
        return getElement().getProperty("editorState", "{}");
    }

    /**
     * Define se o editor está em modo somente leitura.
     * 
     * @param readOnly true para somente leitura, false para edição
     */
    public void setReadOnly(boolean readOnly) {
        getElement().setProperty("readOnly", readOnly);
    }

    /**
     * Registra um listener para mudanças no conteúdo do editor.
     * 
     * @param listener O listener a ser chamado quando o conteúdo mudar
     */
    public void addEditorStateChangeListener(EditorStateChangeListener listener) {
        getElement().addEventListener("editor-state-changed", event -> {
            String newState = event.getEventData().getString("event.detail.state");
            listener.onEditorStateChange(newState);
        }).addEventData("event.detail.state");
    }

    /**
     * Interface para listeners de mudanças no estado do editor.
     */
    @FunctionalInterface
    public interface EditorStateChangeListener {
        void onEditorStateChange(String newState);
    }
}
```

### 2. Criando o Componente TypeScript do Cliente

Crie um arquivo `lexical-editor.ts` no diretório `frontend/src/` do seu projeto Vaadin:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createEditor, EditorState, LexicalEditor } from 'lexical';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

// Adaptador para usar componentes React em LitElement
import { createComponent } from '@lit-labs/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@customElement('lexical-editor')
export class LexicalEditorElement extends LitElement {
  @property({ type: String })
  editorState = '{}';

  @property({ type: Boolean })
  readOnly = false;

  private editor: LexicalEditor | null = null;
  private reactRoot: ReactDOM.Root | null = null;

  static styles = css`
    :host {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-height: 200px;
    }

    .editor-container {
      position: relative;
      height: 100%;
      min-height: 150px;
    }

    .editor-inner {
      background: #fff;
      position: relative;
      height: 100%;
    }

    .editor-input {
      height: 100%;
      resize: none;
      font-size: 15px;
      caret-color: rgb(5, 5, 5);
      position: relative;
      tab-size: 1;
      outline: 0;
      padding: 15px 10px;
      caret-color: #444;
    }

    .editor-placeholder {
      color: #999;
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
      top: 15px;
      left: 10px;
      font-size: 15px;
      user-select: none;
      display: inline-block;
      pointer-events: none;
    }
  `;

  firstUpdated() {
    this.initLexical();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('editorState') && this.editor) {
      this.updateEditorFromProp();
    }

    if (changedProperties.has('readOnly') && this.editor) {
      this.editor.setEditable(!this.readOnly);
    }
  }

  private initLexical() {
    const container = this.renderRoot.querySelector('.editor-container');
    if (!container) return;

    // Configuração inicial do Lexical
    const initialConfig = {
      namespace: 'VaadinLexicalEditor',
      theme: {
        ltr: 'ltr',
        rtl: 'rtl',
        paragraph: 'editor-paragraph',
        quote: 'editor-quote',
        heading: {
          h1: 'editor-heading-h1',
          h2: 'editor-heading-h2',
          h3: 'editor-heading-h3',
          h4: 'editor-heading-h4',
          h5: 'editor-heading-h5',
        },
        list: {
          nested: {
            listitem: 'editor-nested-listitem',
          },
          ol: 'editor-list-ol',
          ul: 'editor-list-ul',
          listitem: 'editor-listitem',
        },
        image: 'editor-image',
        link: 'editor-link',
        text: {
          bold: 'editor-text-bold',
          italic: 'editor-text-italic',
          underline: 'editor-text-underline',
          code: 'editor-text-code',
          strikethrough: 'editor-text-strikethrough',
          subscript: 'editor-text-subscript',
          superscript: 'editor-text-superscript',
        },
      },
      onError: (error: Error) => {
        console.error(error);
      },
    };

    // Componente React para o editor Lexical
    const LexicalEditorComponent = () => {
      return React.createElement(
        LexicalComposer,
        { initialConfig },
        React.createElement(
          'div',
          { className: 'editor-inner' },
          React.createElement(RichTextPlugin, {
            contentEditable: React.createElement(ContentEditable, {
              className: 'editor-input',
            }),
            placeholder: React.createElement(
              'div',
              { className: 'editor-placeholder' },
              'Digite algo...'
            ),
          }),
          React.createElement(HistoryPlugin),
          React.createElement(OnChangePlugin, {
            onChange: this.handleEditorChange.bind(this),
          })
        )
      );
    };

    // Renderizar o componente React
    this.reactRoot = ReactDOM.createRoot(container);
    this.reactRoot.render(React.createElement(LexicalEditorComponent));

    // Armazenar referência ao editor
    // Nota: Isso é um hack, idealmente devemos obter a referência do editor de forma mais limpa
    setTimeout(() => {
      // @ts-ignore - Acessando a instância do editor através do namespace global
      this.editor = window.VaadinLexicalEditor;

      if (this.editor) {
        this.updateEditorFromProp();
        this.editor.setEditable(!this.readOnly);
      }
    }, 100);
  }

  private updateEditorFromProp() {
    if (!this.editor) return;

    try {
      const editorState = JSON.parse(this.editorState);
      this.editor.setEditorState(EditorState.create(editorState));
    } catch (e) {
      console.error('Erro ao analisar o estado do editor:', e);

      // Inicializar com conteúdo vazio se o estado for inválido
      this.editor.update(() => {
        const root = $getRoot();
        if (root.getFirstChild() === null) {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(''));
          root.append(paragraph);
        }
      });
    }
  }

  private handleEditorChange(editorState: EditorState) {
    editorState.read(() => {
      const json = JSON.stringify(editorState.toJSON());
      this.editorState = json;

      // Disparar evento para o lado do servidor
      this.dispatchEvent(new CustomEvent('editor-state-changed', {
        detail: {
          state: json
        },
        bubbles: true,
        composed: true
      }));
    });
  }

  render() {
    return html`
      <div class="editor-container"></div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
```

### 3. Configurando o Maven/Gradle para Incluir as Dependências do Lexical

Adicione as seguintes dependências ao seu arquivo `pom.xml` (para Maven):

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-core</artifactId>
</dependency>

<!-- Configuração para permitir o uso de npm -->
<build>
    <plugins>
        <plugin>
            <groupId>com.vaadin</groupId>
            <artifactId>vaadin-maven-plugin</artifactId>
            <version>${vaadin.version}</version>
            <executions>
                <execution>
                    <goals>
                        <goal>prepare-frontend</goal>
                        <goal>build-frontend</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <productionMode>false</productionMode>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Para Gradle, adicione ao seu arquivo `build.gradle`:

```groovy
dependencies {
    implementation 'com.vaadin:vaadin-core'
    // Outras dependências...
}

vaadin {
    productionMode = false
    pnpmEnable = true
}
```

### 4. Configurando o package.json

Crie ou atualize o arquivo `package.json` na raiz do seu projeto:

```json
{
  "name": "vaadin-lexical-integration",
  "version": "1.0.0",
  "dependencies": {
    "@lexical/react": "^0.11.1",
    "lexical": "^0.11.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@lit-labs/react": "^1.1.1",
    "lit": "^2.7.0"
  },
  "vaadin": {
    "dependencies": {
      "@lexical/react": "^0.11.1",
      "lexical": "^0.11.1",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@lit-labs/react": "^1.1.1",
      "lit": "^2.7.0"
    },
    "devDependencies": {
      "typescript": "^5.0.4"
    }
  }
}
```

## Usando o Componente LexicalEditor

Agora você pode usar o componente `LexicalEditor` em suas views Vaadin:

```java
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;

@Route("")
public class MainView extends VerticalLayout {

    private final LexicalEditor editor;

    public MainView() {
        editor = new LexicalEditor();
        editor.setWidth("100%");
        editor.setHeight("400px");

        // Inicializar com algum conteúdo
        String initialContent = "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Bem-vindo ao Editor Lexical no Vaadin!\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";
        editor.setEditorState(initialContent);

        // Adicionar listener para mudanças
        editor.addEditorStateChangeListener(newState -> {
            // Você pode salvar o estado ou processá-lo aqui
            System.out.println("Editor state changed: " + newState);
        });

        Button saveButton = new Button("Salvar Conteúdo", e -> {
            String content = editor.getEditorState();
            Notification.show("Conteúdo salvo!");
            // Aqui você pode salvar o conteúdo no banco de dados
        });

        Button toggleReadOnlyButton = new Button("Alternar Modo Somente Leitura", e -> {
            boolean currentMode = editor.getElement().getProperty("readOnly", false);
            editor.setReadOnly(!currentMode);
            e.getSource().setText((!currentMode) ? "Habilitar Edição" : "Alternar Modo Somente Leitura");
        });

        add(editor, saveButton, toggleReadOnlyButton);
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }
}
```

## Personalizando o Editor

### Adicionando Plugins do Lexical

Você pode estender o componente TypeScript para incluir plugins adicionais do Lexical:

```typescript
// Importar plugins adicionais
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

// No método de renderização do componente React, adicione os plugins:
React.createElement(
  LexicalComposer,
  { initialConfig },
  React.createElement(
    'div',
    { className: 'editor-inner' },
    React.createElement(RichTextPlugin, {
      contentEditable: React.createElement(ContentEditable, {
        className: 'editor-input',
      }),
      placeholder: React.createElement(
        'div',
        { className: 'editor-placeholder' },
        'Digite algo...'
      ),
    }),
    React.createElement(HistoryPlugin),
    React.createElement(ListPlugin),
    React.createElement(LinkPlugin),
    React.createElement(TablePlugin),
    React.createElement(OnChangePlugin, {
      onChange: this.handleEditorChange.bind(this),
    })
  )
);
```

#### Adicionando o Plugin KaTeX para Fórmulas Matemáticas

Para adicionar suporte a fórmulas matemáticas usando KaTeX, siga estes passos:

1. **Instale as dependências necessárias**:

```bash
npm install katex @types/katex
```

2. **Atualize o arquivo `package.json`** para incluir o KaTeX:

```json
{
  "dependencies": {
    // Outras dependências...
    "katex": "^0.16.8",
    "@types/katex": "^0.16.0"
  },
  "vaadin": {
    "dependencies": {
      // Outras dependências...
      "katex": "^0.16.8"
    }
  }
}
```

3. **Crie os arquivos necessários para o plugin KaTeX**:

Você precisará criar vários arquivos no diretório `frontend/src/` do seu projeto:

- `nodes/EquationNode.ts` - O nó personalizado para representar equações
- `ui/KatexRenderer.ts` - O componente para renderizar equações
- `ui/EquationEditor.ts` - O componente para editar equações
- `plugins/EquationsPlugin.ts` - O plugin principal

4. **Modifique o componente TypeScript do cliente** para incluir o plugin KaTeX:

```typescript
// Em lexical-editor.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createEditor, EditorState, LexicalEditor } from 'lexical';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

// Importar o plugin KaTeX e os estilos
import 'katex/dist/katex.css';
import { EquationNode } from './nodes/EquationNode';
import { EquationsPlugin } from './plugins/EquationsPlugin';

// Adaptador para usar componentes React em LitElement
import { createComponent } from '@lit-labs/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@customElement('lexical-editor')
export class LexicalEditorElement extends LitElement {
  // ... código existente ...

  private initLexical() {
    const container = this.renderRoot.querySelector('.editor-container');
    if (!container) return;

    // Configuração inicial do Lexical
    const initialConfig = {
      namespace: 'VaadinLexicalEditor',
      theme: {
        // ... tema existente ...
      },
      nodes: [
        // Registrar o nó de equação
        EquationNode
      ],
      onError: (error: Error) => {
        console.error(error);
      },
    };

    // Componente React para o editor Lexical
    const LexicalEditorComponent = () => {
      return React.createElement(
        LexicalComposer,
        { initialConfig },
        React.createElement(
          'div',
          { className: 'editor-inner' },
          React.createElement(RichTextPlugin, {
            contentEditable: React.createElement(ContentEditable, {
              className: 'editor-input',
            }),
            placeholder: React.createElement(
              'div',
              { className: 'editor-placeholder' },
              'Digite algo...'
            ),
          }),
          React.createElement(HistoryPlugin),
          // Adicionar o plugin de equações
          React.createElement(EquationsPlugin),
          React.createElement(OnChangePlugin, {
            onChange: this.handleEditorChange.bind(this),
          })
        )
      );
    };

    // ... resto do código existente ...
  }

  // ... resto do código existente ...
}
```

5. **Adicione um botão para inserir equações** na barra de ferramentas:

```typescript
// Em toolbar-plugin.ts
import { LexicalEditor } from 'lexical';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import * as React from 'react';
import { INSERT_EQUATION_COMMAND } from './plugins/EquationsPlugin';

export function ToolbarPlugin({ editor }: { editor: LexicalEditor }) {
  // ... código existente ...

  const insertEquation = () => {
    editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
      equation: '',
      inline: false,
    });
  };

  return React.createElement(
    'div',
    { className: 'toolbar' },
    // ... botões existentes ...
    React.createElement(
      'button',
      {
        onClick: insertEquation,
        'aria-label': 'Inserir Equação Matemática'
      },
      'Equação'
    )
  );
}
```

#### Adicionando o Plugin Kekule.js para Fórmulas Químicas

Para adicionar suporte a fórmulas químicas usando Kekule.js, siga estes passos:

1. **Instale as dependências necessárias**:

```bash
npm install kekule
```

2. **Atualize o arquivo `package.json`** para incluir o Kekule.js:

```json
{
  "dependencies": {
    // Outras dependências...
    "kekule": "^0.9.0"
  },
  "vaadin": {
    "dependencies": {
      // Outras dependências...
      "kekule": "^0.9.0"
    }
  }
}
```

3. **Crie os arquivos necessários para o plugin Kekule.js**:

Você precisará criar vários arquivos no diretório `frontend/src/` do seu projeto:

- `nodes/ChemicalFormulaNode.ts` - O nó personalizado para representar fórmulas químicas
- `ui/KekuleRenderer.ts` - O componente para renderizar fórmulas químicas
- `ui/ChemicalFormulaEditor.ts` - O componente para editar fórmulas químicas
- `plugins/ChemicalFormulasPlugin.ts` - O plugin principal

4. **Modifique o componente TypeScript do cliente** para incluir o plugin Kekule.js:

```typescript
// Em lexical-editor.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createEditor, EditorState, LexicalEditor } from 'lexical';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

// Importar os plugins KaTeX e Kekule.js e os estilos
import 'katex/dist/katex.css';
import 'kekule/dist/themes/default/kekule.css';
import { EquationNode } from './nodes/EquationNode';
import { EquationsPlugin } from './plugins/EquationsPlugin';
import { ChemicalFormulaNode } from './nodes/ChemicalFormulaNode';
import { ChemicalFormulasPlugin } from './plugins/ChemicalFormulasPlugin';

// Adaptador para usar componentes React em LitElement
import { createComponent } from '@lit-labs/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@customElement('lexical-editor')
export class LexicalEditorElement extends LitElement {
  // ... código existente ...

  private initLexical() {
    const container = this.renderRoot.querySelector('.editor-container');
    if (!container) return;

    // Configuração inicial do Lexical
    const initialConfig = {
      namespace: 'VaadinLexicalEditor',
      theme: {
        // ... tema existente ...
      },
      nodes: [
        // Registrar os nós personalizados
        EquationNode,
        ChemicalFormulaNode
      ],
      onError: (error: Error) => {
        console.error(error);
      },
    };

    // Componente React para o editor Lexical
    const LexicalEditorComponent = () => {
      return React.createElement(
        LexicalComposer,
        { initialConfig },
        React.createElement(
          'div',
          { className: 'editor-inner' },
          React.createElement(RichTextPlugin, {
            contentEditable: React.createElement(ContentEditable, {
              className: 'editor-input',
            }),
            placeholder: React.createElement(
              'div',
              { className: 'editor-placeholder' },
              'Digite algo...'
            ),
          }),
          React.createElement(HistoryPlugin),
          // Adicionar os plugins
          React.createElement(EquationsPlugin),
          React.createElement(ChemicalFormulasPlugin),
          React.createElement(OnChangePlugin, {
            onChange: this.handleEditorChange.bind(this),
          })
        )
      );
    };

    // ... resto do código existente ...
  }

  // ... resto do código existente ...
}
```

5. **Adicione um botão para inserir fórmulas químicas** na barra de ferramentas:

```typescript
// Em toolbar-plugin.ts
import { LexicalEditor } from 'lexical';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import * as React from 'react';
import { INSERT_EQUATION_COMMAND } from './plugins/EquationsPlugin';
import { INSERT_CHEMICAL_FORMULA_COMMAND } from './plugins/ChemicalFormulasPlugin';

export function ToolbarPlugin({ editor }: { editor: LexicalEditor }) {
  // ... código existente ...

  const insertEquation = () => {
    editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
      equation: '',
      inline: false,
    });
  };

  const insertChemicalFormula = () => {
    editor.dispatchCommand(INSERT_CHEMICAL_FORMULA_COMMAND, {
      formula: '',
      inline: false,
    });
  };

  return React.createElement(
    'div',
    { className: 'toolbar' },
    // ... botões existentes ...
    React.createElement(
      'button',
      {
        onClick: insertEquation,
        'aria-label': 'Inserir Equação Matemática'
      },
      'Equação'
    ),
    React.createElement(
      'button',
      {
        onClick: insertChemicalFormula,
        'aria-label': 'Inserir Fórmula Química'
      },
      'Fórmula Química'
    )
  );
}
```

6. **Atualize o componente Java** para expor métodos relacionados aos plugins:

```java
@Tag("lexical-editor")
@NpmPackage(value = "lexical", version = "0.11.1")
@NpmPackage(value = "katex", version = "0.16.8")
@NpmPackage(value = "kekule", version = "0.9.0")
@JsModule("./src/lexical-editor.ts")
public class LexicalEditor extends Component {
    // ... código existente ...

    /**
     * Insere uma equação matemática no editor.
     * 
     * @param equation A equação em formato LaTeX
     * @param inline Se true, a equação será inserida inline; se false, como bloco
     */
    public void insertEquation(String equation, boolean inline) {
        getElement().callJsFunction("insertEquation", equation, inline);
    }

    /**
     * Insere uma fórmula química no editor.
     * 
     * @param formula A fórmula química (geralmente em formato JSON ou MOL)
     * @param inline Se true, a fórmula será inserida inline; se false, como bloco
     */
    public void insertChemicalFormula(String formula, boolean inline) {
        getElement().callJsFunction("insertChemicalFormula", formula, inline);
    }

    // ... código existente ...
}
```

7. **Adicione os métodos JavaScript correspondentes** no componente TypeScript:

```typescript
// Em lexical-editor.ts
@customElement('lexical-editor')
export class LexicalEditorElement extends LitElement {
  // ... código existente ...

  insertEquation(equation: string, inline: boolean) {
    if (this.editor) {
      this.editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
    }
  }

  insertChemicalFormula(formula: string, inline: boolean) {
    if (this.editor) {
      this.editor.dispatchCommand(INSERT_CHEMICAL_FORMULA_COMMAND, { formula, inline });
    }
  }

  // ... código existente ...
}
```

Para implementações completas dos nós e plugins, consulte os guias detalhados:
- [Integração de Fórmulas Matemáticas com KaTeX no Lexical](/docs/katex-plugin-integration.md)
- [Integração de Fórmulas Químicas com Kekule.js no Lexical](/docs/kekule-plugin-integration.md)

### Adicionando uma Barra de Ferramentas

Você pode adicionar uma barra de ferramentas ao editor:

```typescript
// No componente TypeScript
import { ToolbarPlugin } from './toolbar-plugin';

// No método de renderização
React.createElement(ToolbarPlugin, {
  editor: this.editor,
})
```

E implementar o plugin da barra de ferramentas:

```typescript
// toolbar-plugin.ts
import { LexicalEditor } from 'lexical';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import * as React from 'react';

export function ToolbarPlugin({ editor }: { editor: LexicalEditor }) {
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
        }
      });
    });
  }, [editor]);

  const onBoldClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const onItalicClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  return React.createElement(
    'div',
    { className: 'toolbar' },
    React.createElement(
      'button',
      {
        onClick: onBoldClick,
        className: isBold ? 'active' : '',
        'aria-label': 'Format Bold'
      },
      'B'
    ),
    React.createElement(
      'button',
      {
        onClick: onItalicClick,
        className: isItalic ? 'active' : '',
        'aria-label': 'Format Italic'
      },
      'I'
    )
  );
}
```

## Considerações de Estilo

Adicione os seguintes estilos CSS ao seu tema Vaadin:

```css
/* Em styles.css ou como parte do seu tema Lumo */
lexical-editor {
  display: block;
  border: 1px solid var(--lumo-contrast-20pct);
  border-radius: var(--lumo-border-radius-m);
  overflow: hidden;
}

lexical-editor:focus-within {
  border-color: var(--lumo-primary-color);
}

.editor-paragraph {
  margin: 0;
  position: relative;
}

.editor-text-bold {
  font-weight: bold;
}

.editor-text-italic {
  font-style: italic;
}

.editor-text-underline {
  text-decoration: underline;
}

.editor-list-ol {
  list-style-type: decimal;
  margin: 0;
  padding-left: 20px;
}

.editor-list-ul {
  list-style-type: disc;
  margin: 0;
  padding-left: 20px;
}

.toolbar {
  display: flex;
  padding: 4px;
  border-bottom: 1px solid var(--lumo-contrast-10pct);
  background-color: var(--lumo-contrast-5pct);
}

.toolbar button {
  margin-right: 4px;
  background: none;
  border: 1px solid var(--lumo-contrast-20pct);
  border-radius: var(--lumo-border-radius-s);
  padding: 4px 8px;
  cursor: pointer;
}

.toolbar button.active {
  background-color: var(--lumo-primary-color-10pct);
  border-color: var(--lumo-primary-color);
}
```

## Lidando com Serialização e Desserialização

Para trabalhar com o conteúdo do editor no lado do servidor, você pode precisar de métodos auxiliares:

```java
// Na classe LexicalEditor ou em uma classe utilitária
public static class EditorUtils {
    /**
     * Extrai texto simples do estado do editor.
     * 
     * @param editorState O estado do editor serializado como JSON
     * @return O texto extraído
     */
    public static String extractPlainText(String editorState) {
        try {
            // Implementação simplificada - em um caso real, você precisaria
            // analisar o JSON e extrair o texto de cada nó
            // Esta é uma implementação de exemplo
            JsonObject json = Json.parse(editorState).asObject();
            StringBuilder text = new StringBuilder();
            extractTextFromNode(json.get("root").asObject(), text);
            return text.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private static void extractTextFromNode(JsonObject node, StringBuilder text) {
        if (node.get("type").asString().equals("text")) {
            text.append(node.get("text").asString());
        }

        if (node.has("children")) {
            JsonArray children = node.get("children").asArray();
            for (int i = 0; i < children.size(); i++) {
                extractTextFromNode(children.get(i).asObject(), text);
                if (node.get("type").asString().equals("paragraph") && i < children.size() - 1) {
                    text.append("\n");
                }
            }
        }
    }

    /**
     * Cria um estado de editor simples com texto plano.
     * 
     * @param text O texto a ser incluído
     * @return O estado do editor serializado como JSON
     */
    public static String createSimpleEditorState(String text) {
        // Implementação simplificada para criar um estado com um único parágrafo
        return String.format(
            "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"%s\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
            text.replace("\"", "\\\"")
        );
    }
}
```

## Casos de Uso

### Formulário com Editor de Texto Rico

```java
@Route("form")
public class FormView extends FormLayout {

    private final LexicalEditor descriptionEditor;
    private final TextField titleField;
    private final Button saveButton;

    public FormView() {
        titleField = new TextField("Título");

        descriptionEditor = new LexicalEditor();
        descriptionEditor.setHeight("300px");

        FormLayout.FormItem editorItem = addFormItem(descriptionEditor, "Descrição");
        editorItem.getElement().getStyle().set("--vaadin-form-item-label-width", "120px");

        saveButton = new Button("Salvar", e -> {
            String title = titleField.getValue();
            String description = descriptionEditor.getEditorState();

            // Salvar no banco de dados ou processar os dados
            Notification.show("Formulário salvo com sucesso!");
        });

        add(titleField, editorItem, saveButton);

        setResponsiveSteps(
            new ResponsiveStep("0", 1),
            new ResponsiveStep("500px", 1)
        );
        setColspan(editorItem, 1);
    }
}
```

### Visualização de Conteúdo

```java
@Route("view")
public class ContentView extends VerticalLayout {

    private final LexicalEditor contentViewer;

    public ContentView() {
        contentViewer = new LexicalEditor();
        contentViewer.setReadOnly(true);
        contentViewer.setHeight("500px");

        // Carregar conteúdo de alguma fonte
        String content = loadContentFromDatabase();
        contentViewer.setEditorState(content);

        add(new H2("Visualização de Conteúdo"), contentViewer);
        setPadding(true);
        setSpacing(true);
    }

    private String loadContentFromDatabase() {
        // Simulação - em um caso real, você buscaria do banco de dados
        return "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Este é um exemplo de conteúdo carregado do banco de dados.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";
    }
}
```

## Conclusão

A integração do Lexical Editor com o Vaadin Flow permite adicionar recursos avançados de edição de texto em aplicações Java. Esta abordagem combina o poder do Lexical para edição de texto com a facilidade de desenvolvimento do Vaadin Flow.

Alguns benefícios desta integração incluem:

1. Edição de texto rica e extensível em aplicações Vaadin
2. Comunicação bidirecional entre o servidor Java e o editor cliente
3. Capacidade de personalizar o editor com plugins adicionais
4. Integração com o sistema de temas do Vaadin

Para mais informações, consulte:

- [Documentação do Lexical](https://lexical.dev/)
- [Documentação do Vaadin Flow](https://vaadin.com/docs/flow/)
- [Integrando componentes web com Vaadin](https://vaadin.com/docs/latest/flow/web-components/integrating-a-web-component)
