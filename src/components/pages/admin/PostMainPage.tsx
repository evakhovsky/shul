import { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from '@editorjs/header';
import List from '@editorjs/list';

import TextColorTool from "editorjs-text-background-color-plugin";
import FontFamilyTool from "editorjs-inline-font-family-tool";

class SafeFontFamilyTool extends FontFamilyTool {
  addFontFamilyOptions() {
    const dropdownNode = this.nodes.button?.querySelector(`#${this.fontFamilyDropDown}`) as HTMLElement | null;
    const currentValue = dropdownNode?.innerHTML ?? this.selectedFontFamily ?? "";

    this.selectionList = document.createElement("div");
    this.selectionList.setAttribute("class", "selectionList-font-family");

    const selectionListWrapper = document.createElement("div");
    selectionListWrapper.setAttribute("class", "selection-list-wrapper-font");
    const fontFamilyOptions = this.config.fontFamilyList ?? this.config.fontNames ?? [
      "Arial",
      "Courier New",
      "Georgia",
      "Times New Roman",
      "Verdana",
    ];

    for (const value of fontFamilyOptions) {
      const option = document.createElement("div");
      option.setAttribute("value", value);
      option.setAttribute("style", `font-family:${value}`);
      option.setAttribute("title", value);
      option.classList.add("selection-list-option");

      if (currentValue === value || this.selectedFontFamily === value) {
        option.classList.add("selection-list-option-active");
      }

      option.innerHTML = value;
      selectionListWrapper.append(option);
    }

    this.selectionList.append(selectionListWrapper);
    this.nodes.button.append(this.selectionList);
    this.selectionList.addEventListener("click", this.toggleFontFamilySelector);

    setTimeout(() => {
      if (typeof this.togglingCallback === "function") {
        this.togglingCallback(true);
      }
    }, 50);
  }

  replaceFontSizeInWrapper(fontFamily: string) {
    const displaySelectedFontFamily = this.nodes.button?.querySelector(`#${this.fontFamilyDropDown}`) as HTMLElement | null;
    if (displaySelectedFontFamily) {
      displaySelectedFontFamily.innerHTML = fontFamily;
    }
  }
}

class FontSizeTool {
  static get isInline() {
    return true;
  }

  static get title() {
    return "Size";
  }

  static get sanitize() {
    return {
      span: {
        style: true,
      },
    };
  }

  private api: any;
  private config: any;
  private nodes: { button?: HTMLButtonElement; dropdown?: HTMLDivElement; select?: HTMLSelectElement };
  private currentValue: string;

  constructor({ api, config }: { api: any; config: any }) {
    this.api = api;
    this.config = config;
    this.nodes = {};
    this.currentValue = this.config.defaultSize || "16px";
  }

  render() {
    this.nodes.button = document.createElement("button");
    this.nodes.button.type = "button";
    this.nodes.button.className = "ce-inline-tool ce-inline-tool--font-size";
    this.nodes.button.textContent = this.currentValue;
    this.nodes.button.addEventListener("click", this.handleOpen);
    return this.nodes.button;
  }

  handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.nodes.dropdown) {
      this.closeDropdown();
      return;
    }

    const button = this.nodes.button;
    if (!button) {
      return;
    }

    const dropdown = document.createElement("div");
    dropdown.className = "font-size-dropdown";

    const select = document.createElement("select");
    select.className = "font-size-select";
    select.value = this.currentValue;

    const sizes = this.config.fontSizes || ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
    sizes.forEach((size: string) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      select.appendChild(option);
    });

    select.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLSelectElement;
      this.applyFontSize(target.value);
      this.currentValue = target.value;
      if (this.nodes.button) {
        this.nodes.button.textContent = target.value;
      }
      this.closeDropdown();
    });

    dropdown.appendChild(select);
    document.body.appendChild(dropdown);
    this.positionDropdown(dropdown, button);
    this.nodes.dropdown = dropdown;
    this.nodes.select = select;
    document.addEventListener("click", this.handleOutsideClick);
  };

  applyFontSize(size: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    const wrapper = document.createElement("span");
    wrapper.style.fontSize = size;
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);

    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  positionDropdown(dropdown: HTMLDivElement, button: HTMLButtonElement) {
    const buttonRect = button.getBoundingClientRect();
    const left = Math.max(8, buttonRect.left);
    const top = buttonRect.bottom + 6;

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${top}px`;
    dropdown.style.minWidth = `${buttonRect.width}px`;
  }

  handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node;
    if (this.nodes.dropdown && this.nodes.button && !this.nodes.dropdown.contains(target) && !this.nodes.button.contains(target)) {
      this.closeDropdown();
    }
  };

  closeDropdown() {
    if (this.nodes.dropdown) {
      this.nodes.dropdown.remove();
      this.nodes.dropdown = undefined;
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }

  clear() {
    this.currentValue = this.config.defaultSize || "16px";
  }
}

const editorToolbarStyles = `
  .ce-inline-toolbar {
    padding: 8px 10px;
    border-radius: 12px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
    min-width: 260px;
    min-height: 52px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ce-inline-toolbar .ce-inline-tool {
    min-width: 44px;
    min-height: 44px;
    padding: 8px 10px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ce-inline-toolbar .ce-inline-tool--font {
    min-width: 170px;
    justify-content: space-between;
  }

  .ce-inline-toolbar .ce-inline-tool--font-size {
    min-width: 90px;
  }

  .font-size-dropdown {
    position: fixed;
    z-index: 10000;
    padding: 8px;
    border-radius: 10px;
    background: white;
    border: 1px solid #d0d7de;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
  }

  .font-size-select {
    min-width: 135px;
    height: 44px;
    padding: 8px 10px;
    border: 1px solid #d0d7de;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
  }

  .selectionList-font-family {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: min(400px, 80vw);
    max-height: 380px;
    overflow-y: auto;
    overflow-x: hidden;
    background: white;
    border: 1px solid #d0d7de;
    border-radius: 10px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
    z-index: 1000;
  }

  .selection-list-wrapper-font {
    display: flex;
    flex-direction: column;
  }

  .selection-list-option {
    padding: 12px 14px;
    font-size: 14px;
    line-height: 1.25;
    cursor: pointer;
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .selection-list-option:hover,
  .selection-list-option-active {
    background: #f3f4f6;
  }

  .button-wrapper-text-font-family {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .selected-font-family {
    width: 100%;
    font-size: 13px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface EditorProps {
  initialData?: OutputData;
  onChange?: (data: OutputData) => void;
}

export default function ReusableEditor({ initialData, onChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (containerRef.current && !editorRef.current) {
      const editor = new EditorJS({
        holder: containerRef.current,
        placeholder: "Highlight text to change color, background, or typography...",
        data: initialData,
        inlineToolbar: ["bold", "italic", "color", "fontFamily", "fontSize"],
        
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link"],
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          color: {
            class: TextColorTool,
            config: {
              textColors: ["#000000", "#FF5733", "#33FF57", "#3357FF"],
              backgroundColors: ["#FFFF00", "#FFC0CB", "#00FFFF", "#FFFFFF"],
            },
          },
          fontFamily: {
            class: SafeFontFamilyTool as any,
            config: {
              fontFamilyList: [
                "Arial",
                "Arial Black",
                "Comic Sans MS",
                "Courier New",
                "Georgia",
                "Helvetica",
                "Times New Roman",
                "Trebuchet MS",
                "Verdana",
              ],
            },
          },
          fontSize: {
            class: FontSizeTool as any,
            config: {
              defaultSize: "16px",
              fontSizes: ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "48px", "54px"],
            },
          },
        },

        onChange: async () => {
          if (onChange) {
            const savedData = await editor.save();
            onChange(savedData);
          }
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData, onChange]);

  return (
    <div style={{ padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "0.375rem" }}>
      <style>{editorToolbarStyles}</style>
      <div ref={containerRef} />
    </div>
  )
}
