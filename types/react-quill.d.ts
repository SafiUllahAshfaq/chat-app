declare module "react-quill" {
  import * as React from "react";

  export interface ReactQuillProps {
    value: string;
    onChange: (value: string) => void;
    modules?: object;
    formats?: string[];
    theme?: string;
    readOnly?: boolean;
    placeholder?: string;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;
  }

  class ReactQuill extends React.Component<ReactQuillProps> {}
  export default ReactQuill;
}
