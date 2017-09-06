import React from 'react'
import { inject, observer } from 'mobx-react'
import { LinearProgress } from 'material-ui/Progress'
import WindowList from './WindowList'
import Search from './Search'
import Tools from './Tools'

@inject('windowStore')
@inject('searchStore')
@inject('tabStore')
@observer
export default class App extends React.Component {
  componentDidMount () {
    const { windowStore: { updateAllWindows } } = this.props
    chrome.windows.onCreated.addListener(updateAllWindows)
    chrome.windows.onRemoved.addListener(updateAllWindows)
    chrome.tabs.onCreated.addListener(updateAllWindows)
    chrome.tabs.onUpdated.addListener(updateAllWindows)
    chrome.tabs.onMoved.addListener(updateAllWindows)
    chrome.tabs.onDetached.addListener(updateAllWindows)
    chrome.tabs.onRemoved.addListener(updateAllWindows)
    chrome.tabs.onReplaced.addListener(updateAllWindows)
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  onKeyDown = (e) => {
    const {
      searchStore: { up, down, enter, select, typing, query },
      tabStore: { remove }
    } = this.props
    console.log(e.keyCode)
    switch (e.keyCode) {
      // DOWN
      case 40:
        e.preventDefault()
        down()
        break
      // UP
      case 38:
        e.preventDefault()
        up()
        break
      // Enter
      case 13:
        e.preventDefault()
        enter()
        break
      // Escape
      case 27:
        if (typing) {
          e.preventDefault()
          this.search.blur()
        }
        break
      // Delete
      case 8:
        if (!query) {
          e.preventDefault()
          this.search.blur()
        }
        break
      default:
        break
    }
    console.log(typing)
    if (typing) {
      return
    }
    switch (e.keyCode) {
      // X
      case 88:
        e.preventDefault()
        select()
        break
      // j
      case 74:
        e.preventDefault()
        down()
        break
      // k
      case 75:
        e.preventDefault()
        up()
        break
      // Delete
      case 8:
        e.preventDefault()
        remove()
        break
      // /
      case 191:
        e.preventDefault()
        this.search.focus()
        break
      default:
        break
    }
  }

  render () {
    const { windowStore: { tabCount } } = this.props
    if (!tabCount) {
      return (<LinearProgress />)
    }
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100vh'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: '0 0 auto',
          padding: '0 4px'
        }}>
          <Search inputRef={(input) => { this.search = input }} />
          <Tools />
        </div>
        <WindowList />
      </div>
    )
  }
}
