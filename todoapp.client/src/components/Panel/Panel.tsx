interface IPanelProps {
    children?: React.ReactNode;
    className: string;
}

export const Panel = (props: IPanelProps) => <div className={props.className} >{props.children}</div>;

//export function Panel(props: IPanelProps) {
//    return <div className="header">{props.children}</div>;
//}
