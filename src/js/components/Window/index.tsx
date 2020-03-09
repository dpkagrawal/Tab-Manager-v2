import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'
import Title from './Title'
import Tabs from './Tabs'
import Preview from 'components/Preview'
import { ItemTypes, getTargetTab } from 'libs/react-dnd'
import { useStore } from 'components/StoreContext'
import { useTheme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'
import Loading from 'components/Loading'

const Window = observer(props => {
  const theme = useTheme()
  const { dragStore } = useStore()
  const { win } = props
  const { lastFocused, showTabs } = win
  const [dropProps, drop] = useDrop({
    accept: ItemTypes.TAB,
    canDrop: () => win.canDrop,
    drop: (_, monitor) => {
      if (monitor.didDrop()) {
        return
      }
      const tab = getTargetTab(win.tabs, false)
      if (tab) {
        dragStore.drop(tab, false)
      }
    },
    collect: monitor => {
      return {
        canDrop: monitor.canDrop(),
        isDragging: !!monitor.getItem(),
        isOver: monitor.isOver({ shallow: true })
      }
    }
  })
  const { canDrop, isOver, isDragging } = dropProps
  const style: CSSProperties = {
    minWidth: '20rem',
    height: 'fit-content',
    boxSizing: 'border-box'
  }
  if (isDragging && isOver && !canDrop) {
    style.backgroundColor = theme.palette.error.light
  }
  const dropIndicator = canDrop && isOver && <Preview />
  if (!win.visibleLength) {
    return null
  }
  return (
    <div
      ref={drop}
      style={style}
      className={classNames('w-full p-1 mb-10', {
        'shadow-2xl': lastFocused,
        'shadow-sm': !lastFocused
      })}
    >
      <Title {...props} />
      {showTabs ? <Tabs {...props} /> : <Loading small />}
      {dropIndicator}
    </div>
  )
})

// This export is for testing
export { Window }

export default Window
