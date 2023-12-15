import { ReactNode } from 'react';
import { Panel } from '../Panel/Panel';

export const Header = (props: { children?: ReactNode; }) => <Panel className="header" children={props.children} />;
