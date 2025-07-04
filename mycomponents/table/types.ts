import { ReactNode } from "react";
import { CustomPaginationProps } from "../pagination";

interface HeaderCellProps{
    element?: ReactNode;
    label?: string;
    onClick?: () => unknown;
}
export interface BodyCellProps {
    // icon?: ReactNode;
    element?: ReactNode;
    label?: string;
    subLabel?: string;
    tooltipContent?: string;
    onClick?: () => unknown;
}
export type RowContentProps = BodyCellProps[]

export type HeaderContentProps = HeaderCellProps[]

export interface TableProps {
    headers: HeaderContentProps;
    rows: RowContentProps[];
    pagination?: CustomPaginationProps;
    isLoading?: boolean;
    className?: string;
    emptyStateContent?: ReactNode;
}

