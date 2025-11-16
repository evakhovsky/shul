import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { View } from 'react-native';
import './PostAdEditor.css';
import 'draft-js/dist/Draft.css';
import ColorPickerDlg from '../controls/ColorPickerDlg'
import Select from 'react-select'

function PostAdEditor({onRichTextEditorStateChanged, initialEditorState, isReadOnly}) {
    const [showColorPickerDlg, setShowColorPickerDlg] = useState(false);    
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
    const [isInitialState, setIsInitialState] = useState(true);

    const editor = React.useRef(null);
    
    function focusEditor() {
        editor.current.focus();
    }

    React.useEffect(() => {
        focusEditor();
        
        if(initialEditorState !== null && initialEditorState !== undefined && initialEditorState){
            setEditorState(initialEditorState)
            if(isInitialState){
                if(onRichTextEditorStateChanged != null){
                    onRichTextEditorStateChanged(initialEditorState);
                }
                setIsInitialState(false);
            }
        }
        
    }, [initialEditorState]);

    const styleMap = {
        'HIGHLIGHT': {
            'color': '#17202A',
        },
        'RED': {
            'color': '#f44336',
        },
        'RED1': {
            'color': '#e91e63',
        },
        'PURPLE': {
            'color': '#9c27b0',
        },
        'PURPLE1': {
            'color': '#673ab7',
        },
        'BLUE': {
            'color': '#3f51b5',
        },
        'BLUE1': {
            'color': '#2196f3',
        },
        'BLUE2': {
            'color': '#03a9f4',
        },
        'OLDHUE': {
            'color': '#00bcd4',
        },
        'OLDHUE1': {
            'color': '#009688',
        },
        'GREEN': {
            'color': '#4caf50',
        },
        'GREEN1': {
            'color': '#8bc34a',
        },
        'GREEN2': {
            'color': '#cddc39',
        },
        'YELLOW': {
            'color': '#ffeb3b',
        },
        'YELLOW1': {
            'color': '#ffc107',
        },
        'YELLOW2': {
            'color': '#ff9800',
        },
        'MARS': {
            'color': '#ff5722',
        },
        'BROWN': {
            'color': '#795548',
        },
        'GREY': {
            'color': '#607d8b',
        },
        'FONT_SIZE_12': {
            'fontSize': '12px'
        },
        'FONT_SIZE_14': {
            'fontSize': '14px'
        },
        'FONT_SIZE_16': {
            'fontSize': '16px'
        },
        'FONT_SIZE_18': {
            'fontSize': '18px'
        },
        'FONT_SIZE_20': {
            'fontSize': '20px'
        },
        'FONT_SIZE_22': {
            'fontSize': '22px'
        },
        'FONT_SIZE_24': {
            'fontSize': '24px'
        },
        'FONT_SIZE_26': {
            'fontSize': '26px'
        },
        'FONT_SIZE_28': {
            'fontSize': '28px'
        },
        'FONT_SIZE_30': {
            'fontSize': '30px'
        },
        'FONT_SIZE_36': {
            'fontSize': '36px'
        },
        'FONT_SIZE_42': {
            'fontSize': '42px'
        },
        'FONT_SIZE_48': {
            'fontSize': '48px'
        },
        CODE: {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2,
          }
    };

    const toggleBlockType = async (blockType) => {
        const newState = RichUtils.toggleBlockType(editorState, blockType);
        setEditorState(newState);
        if(onRichTextEditorStateChanged === null || onRichTextEditorStateChanged === undefined){
            return;
        }

        onRichTextEditorStateChanged(newState)
    }

    const toggleInlineStyle = async (inlineStyle) => {
        console.log('toggleInlineStyle ' + inlineStyle);

        if(inlineStyle === 'COLOR') {
            pickColorClick();
            return;
        }

        const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
        setEditorState(newState);
        if(onRichTextEditorStateChanged === null || onRichTextEditorStateChanged === undefined){
            return;
        }

        onRichTextEditorStateChanged(newState);
    }

    function BlockButton(props) {
        const onToggle = async (e) => {
            e.preventDefault();
            props.onToggle(props.style)
        }
        
        const renderBlockBtn = () => {
            let className = 'RichEditor-styleButton';
            if (props.active) {
                className += ' RichEditor-activeButton';
            }

            return (
                <span className={className} onMouseDown={onToggle}>
                  {props.label}
                </span>
            );
        }

        return (
            <div>
                {renderBlockBtn()}
            </div>
        );
    }

    const getBlockStyle = (block) => {
        switch (block.getType()) {
          case 'blockquote':
            return 'RichEditor-blockquote';
          default: return null;
        }
    }

    var INLINE_STYLES = [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'},
        {label: 'Monospace', style: 'CODE'},
        {label: 'Color', style: 'COLOR'},
    ];

    const BLOCK_TYPES = [
        {label: 'H1', style: 'header-one'},
        {label: 'H2', style: 'header-two'},
        {label: 'H3', style: 'header-three'},
        {label: 'H4', style: 'header-four'},
        {label: 'H5', style: 'header-five'},
        {label: 'H6', style: 'header-six'},
        {label: 'Blockquote', style: 'blockquote'},
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'Code Block', style: 'code-block'},
    ];

    const BlockStyleControls = (props) => {
        const {editorState} = props;
        if(!editorState || editorState === undefined || editorState === null){
            return;
        }
        const selection = editorState.getSelection();
        const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();
    
        return (
            <div className="RichEditor-controls">
            <View style={{flex: 1, flexDirection: 'row'}}>          
            {BLOCK_TYPES.map((type) =>
              <BlockButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}          
            </View>
            </div>
        );
    };

    const InlineStyleControls = (props) => {
        if(!editorState || editorState === undefined || editorState === null){
            return;
        }

        const currentStyle = editorState.getCurrentInlineStyle();
        
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
            {INLINE_STYLES.map((type) =>
              <BlockButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />              
            )}            
          </View>
        );
    };

    const onDefaultColorPicked = (color) => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT');
        setEditorState(newState);
        setShowColorPickerDlg(false);
        if(onRichTextEditorStateChanged === null || onRichTextEditorStateChanged === undefined){
            return;
        }

        onRichTextEditorStateChanged(newState);
    }

    const onColorPicked = (color) => {
        console.log(color)
        console.log(color.hex)
        let code = 'HIGHLIGHT';

        switch(color.hex)
        {
            case '#f44336':
                code = 'RED'
                break;
            case '#e91e63':
                code = 'RED1'
                break;
            case '#9c27b0':
                code = 'PURPLE'
                break;
            case '#673ab7':
                code = 'PURPLE1'
                break;
            case '#3f51b5':
                code = 'BLUE'
                break;
            case '#2196f3':
                code = 'BLUE1'
                break;
            case '#03a9f4':
                code = 'BLUE2'
                break;
            case '#00bcd4':
                code = 'OLDHUE'
                break;
            case '#009688':
                code = 'OLDHUE1'
                break;
            case '#4caf50':
                code = 'GREEN'
                break;
            case '#8bc34a':
                code = 'GREEN1'
                break;
            case '#cddc39':
                code = 'GREEN2'
                break;
            case '#ffeb3b':
                code = 'YELLOW'
                break;
            case '#ffc107':
                code = 'YELLOW1'
                break;
            case '#ff9800':
                code = 'YELLOW2'
                break;
            case '#ff5722':
                code = 'MARS'
                break;
            case '#795548':
                code = 'BROWN'
                break;
            case '#607d8b':
                code = 'GREY'
                break;
            default:
                code = 'HIGHLIGHT'
                break;
        }

        setShowColorPickerDlg(false);
        const newState = RichUtils.toggleInlineStyle(editorState, code);
        setEditorState(newState);
        if(onRichTextEditorStateChanged === null || onRichTextEditorStateChanged === undefined){
            return;
        }

        onRichTextEditorStateChanged(newState);
    }

    const fontSizes = [
        { value: '12px', label: '12' },
        { value: '14px', label: '14' },
        { value: '16px', label: '16' },
        { value: '18px', label: '18' },
        { value: '20px', label: '20' },
        { value: '22px', label: '22' },
        { value: '24px', label: '24' },
        { value: '26px', label: '26' },
        { value: '28px', label: '28' },
        { value: '30px', label: '30' },
        { value: '36px', label: '36' },
        { value: '42px', label: '42' },
        { value: '48px', label: '48' },
    ]

    const handleFontSizeChange = value => {
        console.log(value);
        let code = '';
        focusEditor();

        switch(value.label)
        {
            case '12':
                code = 'FONT_SIZE_12'
                break;
            case '14':
                code = 'FONT_SIZE_14'
                break;
            case '16':
                code = 'FONT_SIZE_16'
                break;
            case '18':
                code = 'FONT_SIZE_18'
                break;
            case '20':
                code = 'FONT_SIZE_20'
                break;
            case '22':
                code = 'FONT_SIZE_22'
                break;
            case '24':
                code = 'FONT_SIZE_24'
                break;
            case '26':
                code = 'FONT_SIZE_26'
                break;
            case '28':
                code = 'FONT_SIZE_28'
                break;
            case '30':
                code = 'FONT_SIZE_30'
                break;
            case '36':
                code = 'FONT_SIZE_36'
                break;
            case '42':
                code = 'FONT_SIZE_42'
                break;
            case '48':
                code = 'FONT_SIZE_48'
                break;
            default:
                code = 'HIGHLIGHT'
                break;
        }

        const newState = RichUtils.toggleInlineStyle(editorState, code);
        setEditorState(newState);
        if(onRichTextEditorStateChanged === null || onRichTextEditorStateChanged === undefined){
            return;
        }

        onRichTextEditorStateChanged(newState);
    };

    const rendrFontSize = () => {
        return (
            <Select options={fontSizes}
                onChange={handleFontSizeChange}                
                placeholder="Font size"
            />
        );
    }

    const rendrPickColor = () => {
        return (
                <div>
                    <ColorPickerDlg showModal={showColorPickerDlg}
                    onClose={onColorPickerDlgClose}
                    onColorPicked={onColorPicked}
                    onDefaultColorPicked={onDefaultColorPicked} />
                </div>
        );
    }

    const pickColorClick = () => {
        setShowColorPickerDlg(true);
    }

    const onColorPickerDlgClose = () => {
        console.log('calling onColorPickerDlgClose');
        setShowColorPickerDlg(false);
    }

    const renderEitor = () => {
      let className = 'RichEditor-editor';
      if(!editorState || editorState === undefined || editorState === null){
          return;
      }
      var contentState = editorState.getCurrentContent();
      if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
          className += ' RichEditor-hidePlaceholder';
        }
      }

      if(isReadOnly){
        return(
            <div>
                <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    ref={editor}
                    editorState={editorState}
                    onChange={editorState => {setEditorState(editorState)
                        if(onRichTextEditorStateChanged != null){
                            onRichTextEditorStateChanged(editorState)
                        }
                    }}
                    readOnly={isReadOnly}/>
            </div>  
        );
      }

        return(
            <div className='RichEditor-root'>
            <div className={className}>
                <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    ref={editor}
                    editorState={editorState}
                    readOnly={isReadOnly}
                    spellCheck={true}
                    placeholder="Your post goes here ..."
                    onChange={editorState => {setEditorState(editorState)
                        if(onRichTextEditorStateChanged != null){
                            onRichTextEditorStateChanged(editorState)
                        }
                    }}
                />
            </div>
            </div>
        );
    }

    const renderEitorHeader = () => {
        if(isReadOnly){
            return;
        }

        return (
            <div className="RichEditor-root">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={toggleBlockType}
                />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", zIndex: 1000}}>
                    <View>
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={toggleInlineStyle}
                    />
                    </View>
                    <View style={{flex: 0.3, justifyContent: "flex-start", zIndex: 1000}}>
                    {rendrFontSize()}
                    </View>
                </View>
                {rendrPickColor()}
                
            </div>            
        );
    }

    return (
        <div>
            {renderEitorHeader()}
            {renderEitor()}
        </div>
    );
}

export default PostAdEditor;