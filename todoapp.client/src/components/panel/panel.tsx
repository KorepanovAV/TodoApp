import './panel.css';

interface IPanelProps {
    children?: React.ReactNode;
    className: string;
}

export const Panel = (props: IPanelProps) => <div className={props.className}>{props.children}</div>;
