# Integração de Fórmulas Matemáticas com KaTeX no Lexical

Este documento descreve como criar um plugin para integrar fórmulas matemáticas usando KaTeX com o editor Lexical.

## Introdução

[KaTeX](https://katex.org/) é uma biblioteca rápida e precisa para renderização de notação matemática em navegadores web. Integrar o KaTeX com o Lexical permite que os usuários insiram e editem fórmulas matemáticas complexas em seus documentos.

## Pré-requisitos

Antes de começar, você precisa instalar as dependências necessárias:

```bash
npm install katex @types/katex
# ou
yarn add katex @types/katex
```

Também é necessário importar os estilos CSS do KaTeX:

```typescript
import 'katex/dist/katex.css';
```

## Estrutura do Plugin

A integração do KaTeX com o Lexical envolve vários componentes:

1. **EquationNode**: Um nó personalizado para representar equações
2. **EquationComponent**: Um componente para renderizar e editar equações
3. **KatexRenderer**: Um componente para renderizar equações usando KaTeX
4. **EquationEditor**: Um componente para editar equações
5. **EquationsPlugin**: O plugin principal que registra o comando para inserir equações

## Implementação

### 1. Criando o EquationNode

Primeiro, crie um nó personalizado que estenda `DecoratorNode`:

```typescript
import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type {JSX} from 'react';

import katex from 'katex';
import {$applyNodeReplacement, DecoratorNode, DOMExportOutput} from 'lexical';
import * as React from 'react';

// Importe o componente que será usado para renderizar a equação
const EquationComponent = React.lazy(() => import('./EquationComponent'));

// Defina o tipo para o nó serializado
export type SerializedEquationNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

// Função para converter elementos DOM em nós de equação
function $convertEquationElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  let equation = domNode.getAttribute('data-lexical-equation');
  const inline = domNode.getAttribute('data-lexical-inline') === 'true';
  // Decodifica a equação de base64
  equation = atob(equation || '');
  if (equation) {
    const node = $createEquationNode(equation, inline);
    return {node};
  }

  return null;
}

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return 'equation';
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key);
  }

  constructor(equation: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline ?? false;
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(
      serializedNode.equation,
      serializedNode.inline,
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedEquationNode {
    return {
      ...super.exportJSON(),
      equation: this.getEquation(),
      inline: this.__inline,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    element.className = 'editor-equation';
    return element;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    // Codifica a equação em base64 para evitar problemas com caracteres especiais
    const equation = btoa(this.__equation);
    element.setAttribute('data-lexical-equation', equation);
    element.setAttribute('data-lexical-inline', `${this.__inline}`);
    katex.render(this.__equation, element, {
      displayMode: !this.__inline,
      errorColor: '#cc0000',
      output: 'html',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    });
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null;
        }
        return {
          conversion: $convertEquationElement,
          priority: 2,
        };
      },
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null;
        }
        return {
          conversion: $convertEquationElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(prevNode: this): boolean {
    // Se a propriedade inline mudar, substitua o elemento
    return this.__inline !== prevNode.__inline;
  }

  getTextContent(): string {
    return this.__equation;
  }

  getEquation(): string {
    return this.__equation;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  decorate(): JSX.Element {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    );
  }
}

// Função auxiliar para criar um nó de equação
export function $createEquationNode(
  equation = '',
  inline = false,
): EquationNode {
  const equationNode = new EquationNode(equation, inline);
  return $applyNodeReplacement(equationNode);
}

// Função auxiliar para verificar se um nó é um nó de equação
export function $isEquationNode(
  node: LexicalNode | null | undefined,
): node is EquationNode {
  return node instanceof EquationNode;
}
```

### 2. Criando o KatexRenderer

Em seguida, crie um componente para renderizar equações usando KaTeX:

```typescript
import type {JSX} from 'react';

import katex from 'katex';
import * as React from 'react';
import {useEffect, useRef} from 'react';

export default function KatexRenderer({
  equation,
  inline,
  onDoubleClick,
}: Readonly<{
  equation: string;
  inline: boolean;
  onDoubleClick: () => void;
}>): JSX.Element {
  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline, // true = modo bloco
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return (
    <>
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
      <span
        role="button"
        tabIndex={-1}
        onDoubleClick={onDoubleClick}
        ref={katexElementRef}
      />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
    </>
  );
}
```

### 3. Criando o EquationEditor

Crie um componente para editar equações:

```typescript
import type {JSX, Ref, RefObject} from 'react';

import './EquationEditor.css';

import {isHTMLElement} from 'lexical';
import {ChangeEvent, forwardRef} from 'react';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
};

function EquationEditor(
  {equation, setEquation, inline}: BaseEquationEditorProps,
  forwardedRef: Ref<HTMLInputElement | HTMLTextAreaElement>,
): JSX.Element {
  const onChange = (event: ChangeEvent) => {
    setEquation((event.target as HTMLInputElement).value);
  };

  return inline && isHTMLElement(forwardedRef) ? (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input
        className="EquationEditor_inlineEditor"
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={forwardedRef as RefObject<HTMLInputElement>}
      />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  ) : (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea
        className="EquationEditor_blockEditor"
        value={equation}
        onChange={onChange}
        ref={forwardedRef as RefObject<HTMLTextAreaElement>}
      />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

export default forwardRef(EquationEditor);
```

### 4. Criando o EquationComponent

Crie um componente que alterna entre o editor e o renderizador:

```typescript
import type {JSX} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {mergeRegister} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ESCAPE_COMMAND,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import EquationEditor from '../ui/EquationEditor';
import KatexRenderer from '../ui/KatexRenderer';
import {$isEquationNode} from './EquationNode';

type EquationComponentProps = {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
};

export default function EquationComponent({
  equation,
  inline,
  nodeKey,
}: EquationComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [equationValue, setEquationValue] = useState(equation);
  const [showEquationEditor, setShowEquationEditor] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const onHide = useCallback(
    (restoreSelection?: boolean) => {
      setShowEquationEditor(false);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isEquationNode(node)) {
          node.setEquation(equationValue);
          if (restoreSelection) {
            node.selectNext(0, 0);
          }
        }
      });
    },
    [editor, equationValue, nodeKey],
  );

  useEffect(() => {
    if (!showEquationEditor && equationValue !== equation) {
      setEquationValue(equation);
    }
  }, [showEquationEditor, equation, equationValue]);

  useEffect(() => {
    if (!isEditable) {
      return;
    }
    if (showEquationEditor) {
      return mergeRegister(
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement;
            const inputElem = inputRef.current;
            if (inputElem !== activeElement) {
              onHide();
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement;
            const inputElem = inputRef.current;
            if (inputElem === activeElement) {
              onHide(true);
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      );
    } else {
      return editor.registerUpdateListener(({editorState}) => {
        const isSelected = editorState.read(() => {
          const selection = $getSelection();
          return (
            $isNodeSelection(selection) &&
            selection.has(nodeKey) &&
            selection.getNodes().length === 1
          );
        });
        if (isSelected) {
          setShowEquationEditor(true);
        }
      });
    }
  }, [editor, nodeKey, onHide, showEquationEditor, isEditable]);

  return (
    <>
      {showEquationEditor && isEditable ? (
        <EquationEditor
          equation={equationValue}
          setEquation={setEquationValue}
          inline={inline}
          ref={inputRef}
        />
      ) : (
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
          <KatexRenderer
            equation={equationValue}
            inline={inline}
            onDoubleClick={() => {
              if (isEditable) {
                setShowEquationEditor(true);
              }
            }}
          />
        </ErrorBoundary>
      )}
    </>
  );
}
```

### 5. Criando o EquationsPlugin

Finalmente, crie o plugin principal:

```typescript
import type {JSX} from 'react';

import 'katex/dist/katex.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$wrapNodeInElement} from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import {useCallback, useEffect} from 'react';
import * as React from 'react';

import {$createEquationNode, EquationNode} from '../../nodes/EquationNode';
import KatexEquationAlterer from '../../ui/KatexEquationAlterer';

type CommandPayload = {
  equation: string;
  inline: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
  createCommand('INSERT_EQUATION_COMMAND');

export function InsertEquationDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {equation, inline});
      onClose();
    },
    [activeEditor, onClose],
  );

  return <KatexEquationAlterer onConfirm={onEquationConfirm} />;
}

export default function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor',
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const {equation, inline} = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
```

## Registrando o Plugin

Para usar o plugin, você precisa registrar o nó `EquationNode` e o plugin `EquationsPlugin` no seu editor:

```typescript
import {EquationNode} from './nodes/EquationNode';
import EquationsPlugin from './plugins/EquationsPlugin';

// No seu componente de editor
function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    nodes: [
      // ... outros nós
      EquationNode,
    ],
    // ... outras configurações
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* ... outros plugins */}
        <EquationsPlugin />
      </div>
    </LexicalComposer>
  );
}
```

## Adicionando um Botão para Inserir Equações

Para permitir que os usuários insiram equações, você pode adicionar um botão à barra de ferramentas:

```typescript
import {INSERT_EQUATION_COMMAND} from './plugins/EquationsPlugin';

// No seu componente de barra de ferramentas
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const insertEquation = useCallback(() => {
    editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
      equation: '',
      inline: false,
    });
  }, [editor]);

  return (
    <div className="toolbar">
      {/* ... outros botões */}
      <button onClick={insertEquation} title="Inserir equação">
        Equação
      </button>
    </div>
  );
}
```

## Estilização

Você precisará adicionar alguns estilos CSS para os componentes. Aqui estão alguns exemplos:

### EquationEditor.css

```css
.EquationEditor_inputBackground {
  background-color: #eee;
  border-radius: 4px;
  display: inline-block;
  padding: 4px;
  margin: 4px;
}

.EquationEditor_dollarSign {
  color: #888;
  display: inline-block;
  margin: 0 4px;
}

.EquationEditor_inlineEditor {
  border: none;
  outline: none;
  background-color: transparent;
  font-family: monospace;
}

.EquationEditor_blockEditor {
  border: none;
  outline: none;
  background-color: transparent;
  font-family: monospace;
  min-height: 100px;
  min-width: 300px;
  resize: both;
}
```

## Conclusão

Com esses componentes, você pode integrar o KaTeX com o Lexical para permitir que os usuários insiram e editem fórmulas matemáticas. O plugin suporta tanto equações inline quanto em bloco, e fornece uma interface amigável para edição.

Para mais informações sobre o KaTeX, consulte a [documentação oficial do KaTeX](https://katex.org/docs/api.html).