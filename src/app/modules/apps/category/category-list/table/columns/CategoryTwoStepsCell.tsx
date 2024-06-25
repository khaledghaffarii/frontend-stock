import {FC} from 'react'

type Props = {
  two_steps?: boolean
}

const CategoryTwoStepsCell: FC<Props> = ({two_steps}) => (
  <> {two_steps && <div className='badge badge-light-success fw-bolder'>Enabled</div>}</>
)

export {CategoryTwoStepsCell}
