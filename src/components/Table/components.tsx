import { CellPropsT, H5, TableHeaderCellT } from '..'

export const RenderCell = (props: CellPropsT) => {
  const Cell = props?.column?.Cell
    ? props?.column?.Cell
    : () => (
        <div className="flex h-full w-full items-center ">
          {props?.value || '-'}
        </div>
      )
  return <Cell {...props} />
}
export const RenderHeader = (props: TableHeaderCellT) => {
  const Header = props?.HeaderCell
    ? props?.HeaderCell
    : () => <H5 className="flex h-full w-full items-center">{props?.header}</H5>
  return <Header {...props} />
}
