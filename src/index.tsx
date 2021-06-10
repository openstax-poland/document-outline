import * as React from 'react'
import { Ancestor, Element } from 'slate'
import { useSlate } from 'slate-react'


/**
 * `RenderElementProps` are passed to the `renderElement` handler.
 */

export interface RenderOutlineElementProps {
    element: Element
    children: React.ReactNode
}

/**
 * `DocumentOutlineProps` are passed to the `<DocumentOutline>` component.
 */

export type DocumentOutlineProps = {
    renderElement: (props: RenderOutlineElementProps) => JSX.Element | null,
    as?: React.ElementType,
}

const renderChildren = (
    node: Ancestor,
    renderElement: (props: RenderOutlineElementProps) => JSX.Element | null,
) => {
    const children: JSX.Element[] = []
    node.children.forEach(child => {
        if (Element.isElement(child)) {
            const element = renderElement({
                element: child,
                children: renderChildren(child, renderElement),
            })
            if (element) {
                children.push(<li>{element}</li>)
            }
        }
    })

    return children.length ? <ol>{children}</ol> : null
}

/**
 * DocumentOutline.
 */

const DocumentOutline = (props: DocumentOutlineProps): JSX.Element => {
    const editor = useSlate()
    const ref = React.useRef<HTMLDivElement>(null)
    const {
        renderElement,
        as: Component = 'div',
    } = props

    return (
        <Component
            ref={ref} >
            {renderChildren(editor, renderElement)}
        </Component>
    )
}

export default DocumentOutline
